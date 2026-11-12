#!/usr/bin/env python3
"""Strict AUTO LINGO asset manifest validator (Python standard library).
Usage: python scripts/validate_asset_manifest_v2.py [manifest.json] [--verify-files]
"""
import hashlib,json,re,sys
from pathlib import Path
from datetime import date
from urllib.parse import urlparse
ROOT=Path(__file__).resolve().parents[1]
ROOT_KEYS={"manifest_name","schema_version","status","description","assets"}
REQ={"asset_id","entity_refs","asset_type","source_url","provider","creator","rights_holder","license_name","license_url","permission_evidence","attribution","accessed_at","sha256","file_path","modification_status","modifications","distribution_permissions","technical_identity_status","technical_reviewer","technical_reviewed_at","rights_status","rights_reviewer","rights_reviewed_at","release_status"}
PERMS={"educational","commercial","redistribution","derivatives"}
REF=re.compile(r"^(PART-[0-9]{6}|TERM-[0-9]{6}|SYS-[0-9]{3,}|DIAG-[0-9]{5}|LESSON-[0-9]{4}|VM-[0-9]{5}|BRAND-[0-9]{3}|SCN-[0-9]{4})$")
errors=[]
def err(w,m): errors.append(f"{w}: {m}")
def nonempty(x): return isinstance(x,str) and bool(x.strip())
def dateok(x):
 try: date.fromisoformat(x); return True
 except (TypeError,ValueError): return False
def urlok(x):
 if not isinstance(x,str): return False
 p=urlparse(x); return p.scheme in ("http","https") and bool(p.netloc)
def enumok(value, choices): return isinstance(value,str) and value in choices
def main():
 args=sys.argv[1:]; verify="--verify-files" in args; args=[x for x in args if x!="--verify-files"]
 path=Path(args[0]) if args else ROOT/"data/assets/asset_manifest_v1_1.json"
 try: d=json.loads(path.read_text(encoding="utf-8"))
 except Exception as e: print("ERROR: invalid JSON:",e); return 2
 if not isinstance(d,dict): print("ERROR: root must be object"); return 1
 if set(d)-ROOT_KEYS: err("manifest","unknown keys: "+str(sorted(set(d)-ROOT_KEYS)))
 if ROOT_KEYS-set(d): err("manifest","missing keys: "+str(sorted(ROOT_KEYS-set(d))))
 if d.get("manifest_name")!="AUTO LINGO asset provenance manifest": err("manifest","invalid manifest_name")
 if d.get("schema_version")!="1.1.0": err("manifest","schema_version must be 1.1.0")
 if not enumok(d.get("status"),{"proposed","active"}): err("manifest","status must be proposed or active")
 if not nonempty(d.get("description")): err("manifest","description required")
 assets=d.get("assets")
 if not isinstance(assets,list): err("manifest","assets must be array"); assets=[]
 seen=set()
 for i,a in enumerate(assets):
  w=f"assets[{i}]"
  if not isinstance(a,dict): err(w,"must be object"); continue
  if set(a)-REQ: err(w,"unknown keys: "+str(sorted(set(a)-REQ)))
  if REQ-set(a): err(w,"missing keys: "+str(sorted(REQ-set(a)))); continue
  aid=a["asset_id"]
  if not nonempty(aid) or not re.fullmatch(r"ASSET-[A-Z0-9-]+",aid): err(w,"invalid asset_id")
  elif aid in seen: err(w,"duplicate asset_id")
  if isinstance(aid,str): seen.add(aid)
  refs=a["entity_refs"]
  if not isinstance(refs,list) or not refs: err(w,"entity_refs must be non-empty array"); refs=[]
  if all(isinstance(x,str) for x in refs) and len(refs)!=len(set(refs)): err(w,"duplicate entity_refs")
  for ref in refs:
   if not isinstance(ref,str) or not REF.fullmatch(ref): err(w,f"invalid entity ref {ref!r}")
  if not enumok(a["asset_type"],{"image","audio","video","diagram","document","other"}): err(w,"invalid asset_type")
  if not urlok(a["source_url"]): err(w,"source_url must be http(s)")
  for k in ("provider","creator","rights_holder","license_name","permission_evidence","attribution","file_path"):
   if not nonempty(a[k]): err(w,k+" must be non-empty string")
  if a["license_url"] is not None and not urlok(a["license_url"]): err(w,"license_url must be null or http(s)")
  if not dateok(a["accessed_at"]): err(w,"invalid accessed_at")
  if not isinstance(a["sha256"],str) or not re.fullmatch(r"[a-fA-F0-9]{64}",a["sha256"]): err(w,"sha256 must be 64 hex")
  if not enumok(a["modification_status"],{"unmodified","modified","unknown"}): err(w,"invalid modification_status")
  mods=a["modifications"]
  if not isinstance(mods,list) or any(not isinstance(x,str) for x in mods): err(w,"modifications must be string array"); mods=[]
  if a["modification_status"]=="modified" and not any(nonempty(x) for x in mods): err(w,"modified requires description")
  p=a["distribution_permissions"]
  if not isinstance(p,dict): err(w,"permissions must be object"); p={}
  else:
   if set(p)!=PERMS: err(w,"permissions must contain exactly "+str(sorted(PERMS)))
   if any(type(v) is not bool for v in p.values()): err(w,"all permissions must be explicit booleans")
  if not enumok(a["technical_identity_status"],{"pending","approved","rejected"}): err(w,"invalid technical status")
  if not enumok(a["rights_status"],{"pending","cleared","rejected"}): err(w,"invalid rights status")
  if not enumok(a["release_status"],{"blocked","eligible","retired"}): err(w,"invalid release status")
  for k in ("technical_reviewer","rights_reviewer"):
   if a[k] is not None and not isinstance(a[k],str): err(w,k+" must be string or null")
  for k in ("technical_reviewed_at","rights_reviewed_at"):
   if a[k] is not None and not dateok(a[k]): err(w,k+" must be date or null")
  if a["release_status"]=="eligible":
   if d.get("status")!="active": err(w,"eligible requires manifest status=active")
   for k in ("technical_reviewer","rights_reviewer"):
    if not nonempty(a[k]): err(w,"eligible requires "+k)
   for k in ("technical_reviewed_at","rights_reviewed_at"):
    if not dateok(a[k]): err(w,"eligible requires "+k)
   if a["technical_identity_status"]!="approved" or a["rights_status"]!="cleared": err(w,"eligible requires approved technical identity and cleared rights")
   if any(type(p.get(k)) is not bool for k in PERMS): err(w,"eligible requires all permissions explicitly true/false")
   if a["modification_status"]=="unknown": err(w,"eligible cannot have unknown modification status")
   if a["license_url"] is None and not nonempty(a["permission_evidence"]): err(w,"eligible requires license URL or permission evidence")
  if verify:
   fp=Path(a["file_path"]) if isinstance(a["file_path"],str) else Path("/")
   if fp.is_absolute() or ".." in fp.parts: err(w,"file_path must be safe repository-relative path")
   else:
    f=ROOT/fp
    if not f.is_file(): err(w,"asset file missing: "+str(fp))
    elif hashlib.sha256(f.read_bytes()).hexdigest().lower()!=str(a["sha256"]).lower(): err(w,"SHA-256 mismatch")
 if errors: print("\n".join("ERROR: "+x for x in errors)); return 1
 print(f"OK: strict manifest checks passed ({len(assets)} assets)."+(" Hashes verified." if verify else ""))
 return 0
if __name__=="__main__": raise SystemExit(main())
