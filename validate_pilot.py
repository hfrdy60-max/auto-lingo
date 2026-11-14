#!/usr/bin/env python3
"""Validate the AUTO LINGO pilot bank (schema + cross-file integrity).
Usage: python3 tools/validate_pilot.py   (run from the chatgpt3/ folder)
Uses the 'jsonschema' package if installed; otherwise a built-in draft-07 subset
(type, enum, const, required, properties, additionalProperties, items, minItems,
minLength, minimum, pattern). Exit code 1 on any error."""
import json,glob,re,os,sys,collections
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J=lambda p:json.load(open(os.path.join(ROOT,p),encoding='utf-8'))
def _t(v,t):
    m={"string":str,"array":list,"object":dict,"boolean":bool,"null":type(None),"integer":int}
    return isinstance(v,m[t]) and not (t=="integer" and isinstance(v,bool))
def check(v,s,path,errs):
    if "const" in s and v!=s["const"]: errs.append(f"{path}: const {s['const']!r}")
    if "enum" in s and v not in s["enum"]: errs.append(f"{path}: {v!r} not in enum")
    if "type" in s:
        ts=s["type"] if isinstance(s["type"],list) else [s["type"]]
        if not any(_t(v,t) for t in ts): errs.append(f"{path}: wrong type {type(v).__name__}"); return
    if isinstance(v,str):
        if "pattern" in s and not re.search(s["pattern"],v): errs.append(f"{path}: pattern mismatch {v[:40]!r}")
        if "minLength" in s and len(v)<s["minLength"]: errs.append(f"{path}: too short")
    if isinstance(v,int) and not isinstance(v,bool) and "minimum" in s and v<s["minimum"]: errs.append(f"{path}: below minimum")
    if isinstance(v,dict):
        for k in s.get("required",[]):
            if k not in v: errs.append(f"{path}: missing {k}")
        props=s.get("properties",{})
        if s.get("additionalProperties") is False:
            for k in v:
                if k not in props: errs.append(f"{path}: unexpected field {k}")
        for k,sub in props.items():
            if k in v: check(v[k],sub,f"{path}.{k}",errs)
    if isinstance(v,list):
        if "minItems" in s and len(v)<s["minItems"]: errs.append(f"{path}: fewer than {s['minItems']} items")
        if "items" in s:
            for i,x in enumerate(v): check(x,s["items"],f"{path}[{i}]",errs)
def validate(v,s,path):
    errs=[]
    try:
        import jsonschema
        for e in jsonschema.Draft7Validator(s).iter_errors(v): errs.append(f"{path}: {e.message[:120]}")
    except ImportError: check(v,s,path,errs)
    return errs
TOK=r'(\d+|[ivx]+)'
def toks(spec):
    out=set()
    for part in spec.split(';'):
        m=re.fullmatch(rf'{TOK}(?:-{TOK})?',part.strip()); a,b=m[1],m[2] or m[1]
        if a.isdigit() and b.isdigit(): out|=set(range(int(a),int(b)+1))
        else: out|={a,b}
    return out
errs=[]
es=J("schema/entry.schema.json"); ss=J("schema/source.schema.json"); ds=J("schema/device.schema.json")
recs=[]
for f in sorted(glob.glob(os.path.join(ROOT,"entries/autel/*.json"))):
    for r in json.load(open(f,encoding='utf-8')): recs.append(r); errs+=validate(r,es,r.get('id','?'))
srcs=J("sources/sources.json"); errs+=validate(srcs,ss,"sources")
dev=J("devices/autel_maxisys_ms906_pro.json"); errs+=validate(dev,ds,"device")
by={r['id']:r for r in recs}; sid={s['source_id']:s for s in srcs}
if len(by)!=len(recs): errs.append("duplicate ids")
INV={"parent":"child","child":"parent","sibling":"sibling","contrast":"contrast","see_also":"see_also"}
cited=set(toks(dev['hardware_facts']['source_refs'][0]['printed_page']))
for x in dev['hardware_facts']['source_refs']+dev['device_software']['source_refs']: cited|=toks(x['printed_page'])
pairs=collections.Counter()
for r in recs:
    i=r['id']; pairs[(r['term_en'],r['context'])]+=1
    sd=r['source_document']
    if sd['source_id'] not in sid or sd['document_edition']!=sid[sd['source_id']]['document_edition']: errs.append(f"{i}: source_document mismatch")
    if r['device_software']['diagnostic_software_version'] is not None: errs.append(f"{i}: software version must stay null until read from device")
    if r['verification']['translation']['status']!="draft_unreviewed": errs.append(f"{i}: translation status changed")
    for x in r['source_refs']:
        if x['source_id'] not in sid: errs.append(f"{i}: unknown source {x['source_id']}")
        cited|=toks(x['printed_page'])
    for x in r['workshop_example_basis']: cited|=toks(x['printed_page'])
    for x in r['term_variants_in_manual']: cited|=toks(x['printed_pages'])
    cited|=toks(r['usage_basis'])
    parents=[t for t in r['related_terms'] if t['relation']=='parent']
    if len(parents)!=1: errs.append(f"{i}: needs exactly one parent record (internal or external), has {len(parents)}")
    seen=set()
    for t in r['related_terms']:
        cited|=toks(t['source_pages'])
        k=(t['term'],t['relation'],t['target_id'])
        if k in seen: errs.append(f"{i}: duplicate relation {k}")
        seen.add(k)
        if t['target_id']:
            if t['target_id']==i: errs.append(f"{i}: self relation")
            g=by.get(t['target_id'])
            if not g: errs.append(f"{i}: dangling target {t['target_id']}"); continue
            if t['term']!=g['term_en']: errs.append(f"{i}: term text != target term_en ({t['term']})")
            if t['target_context']!=g['context']: errs.append(f"{i}: target_context wrong for {t['target_id']}")
            if not any(u['target_id']==i and u['relation']==INV[t['relation']] for u in g['related_terms']): errs.append(f"{i}: no inverse on {t['target_id']}")
        elif t['target_context'] is not None: errs.append(f"{i}: external term must have null target_context")
    if "هنوز تکمیل نشده" in r['workshop_example_fa']: errs.append(f"{i}: placeholder example")
for k,v in pairs.items():
    if v>1: errs.append(f"duplicate (term_en, context) {k}")
# sources.pages_cited must equal computed set
def listed(s):
    out=set(s['pages_cited']['front_matter'])
    for r in s['pages_cited']['numbered']: out|=set(range(r['from'],r['to']+1))
    return out
if listed(srcs[0])!=cited: errs.append(f"sources.pages_cited mismatch: only-in-data={sorted(map(str,cited-listed(srcs[0])))} only-in-sources={sorted(map(str,listed(srcs[0])-cited))}")
print("records:",len(recs),"| relations:",sum(len(r['related_terms']) for r in recs),"| errors:",len(errs))
for e in errs[:50]: print(" -",e)
sys.exit(1 if errs else 0)
