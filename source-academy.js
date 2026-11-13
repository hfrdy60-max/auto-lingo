/* AUTONEX — source-based technical courses (expanded content integration) */
(() => {
 "use strict";
 if(!Array.isArray(academyChapters)||typeof renderAcademy!=="function") return;
 const defs=[
  {id:"hk-electrical",file:"data/technical_reference/hyundai_kia_electrical_fuel.json",title:"برق و انژکتور هیوندای و کیا",short:"HYUNDAI • KIA",icon:"⚡",kind:"book"},
  {id:"bosch-gasoline",file:"data/technical_reference/bosch_gasoline_engine_management.json",title:"مدیریت موتور بنزینی بوش",short:"BOSCH • GASOLINE",icon:"◈",kind:"book"},
  {id:"autel-ms906pro",file:"autel_all_entries (1).json",deviceFile:"autel_maxisys_ms906_pro.json",title:"آموزش دستگاه دیاگ Autel MS906 Pro",short:"AUTEL • MAXISYS",icon:"▣",kind:"autel"},
  {id:"sensor-diagnostics",file:"data/technical_reference/cross_domain_sensor_diagnostics.json",title:"کارگاه عیب‌یابی سنسورها و داده زنده",short:"SENSOR DIAGNOSTICS",icon:"⌁",kind:"sensors"}
 ];
 const offset=academyChapters.length;
 defs.forEach(d=>academyChapters.push({id:d.id,title:d.title,level:"مرجع تخصصی و درس‌های کاربردی",intro:"درس‌های ساختاریافته با مسیر مطالعه، واژگان و ارجاع منبع.",flow:["شناخت سیستم","تحلیل داده","بررسی مدار","عیب‌یابی"],sections:[["آکادمی فنی","محتوای آموزشی در حال بارگذاری است.","AUTONEX"]]}));
 const states=Object.fromEntries(defs.map(d=>[d.id,{data:null,error:"",moduleId:"",topicId:"",search:"",answered:false,answerIndex:null}]));
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const arr=v=>Array.isArray(v)?v:[];
 const num=v=>Number(v||0).toLocaleString("fa-IR");
 const oldRender=renderAcademy;
 const fetchJSON=async path=>{const r=await fetch(path);if(!r.ok)throw Error("HTTP "+r.status+" — "+path);return r.json()};
 function makeTopic({id,title,level="متوسط",summary="",concepts=[],procedure=[],diagnostic=[],terms=[],source_pages="",quiz=null}){
  return {id,title,level,summary,concepts,procedure,diagnostic,terms,source_pages,quiz};
 }
 function adaptSensors(raw){
  const groups=[
   {id:"timing",title:"زمان‌بندی و هم‌زمانی موتور",items:["CKP","CMP"]},
   {id:"air-load",title:"هوای ورودی و درخواست راننده",items:["TPS","MAP","IAT","APP"]},
   {id:"combustion",title:"دما، احتراق و آلایندگی",items:["ECT","KNK","O2"]},
   {id:"vehicle-network",title:"سرعت خودرو و شبکه ارتباطی",items:["VSS"]}
  ];
  const modules=groups.map(g=>({id:g.id,title:g.title,summary:"تحلیل داده زنده، مدار الکتریکی و ارتباط سنسورها با عملکرد ECU.",topics:raw.sensor_workflows.filter(x=>g.items.includes(x.sensor_id)).map(x=>makeTopic({
   id:"sensor-"+x.sensor_id.toLowerCase(),
   title:x.sensor_name_fa,
   level:"متوسط تا پیشرفته",
   summary:x.english_term+" — مسیر آموزشی عیب‌یابی مبتنی بر شواهد.",
   concepts:[x.live_data_workflow,x.diagnostic_domains,x.dtc_policy],
   procedure:[x.circuit_workflow,x.learner_task],
   diagnostic:[...x.related_topics.map(v=>"درس مرتبط: "+v),...x.source_refs.map(v=>"منبع: "+v.source+"، صفحات "+v.printed_pages)],
   terms:[[x.english_term,x.sensor_name_fa]],
   source_pages:x.source_refs.map(v=>v.source+" («"+v.printed_pages+"»)").join(" | "),
   quiz:{q:"در بررسی "+x.sensor_name_fa+" کدام رویکرد درست‌تر است؟",options:["ترکیب داده زنده، نقشه مدار و شرایط ثبت خطا","تعویض سنسور فقط بر اساس یک DTC","فرض‌کردن یک ولتاژ و پایه‌بندی برای همه خودروها"],answer:0,why:"تشخیص باید با داده زنده، تست مدار و مشخصات همان خودرو تأیید شود."}
  }))}));
  modules.unshift({id:"diagnostic-method",title:"روش مرحله‌به‌مرحله عیب‌یابی",summary:"چارچوب مشترک برای بررسی عیب بدون تعویض حدسی قطعات.",topics:[makeTopic({
   id:"evidence-led-diagnosis",title:"از شکایت مشتری تا تأیید تعمیر",level:"پایه تا پیشرفته",
   summary:"یک روند استاندارد برای جمع‌آوری شواهد، تحلیل داده و تأیید نتیجه تعمیر.",
   concepts:[raw.meta.purpose,raw.meta.methodology,raw.meta.safety],
   procedure:raw.diagnostic_sequence,
   diagnostic:raw.evidence_rules,
   terms:[["DTC","کد عیب‌یابی"],["Freeze Frame","داده لحظه ثبت خطا"],["Live Data","داده زنده"],["OEM","سازنده اصلی خودرو"]],
   source_pages:"چارچوب تلفیقی منابع سنسورها، بوش و برق هیوندای/کیا"
  })]});
  return {meta:{title_fa:raw.meta.title_fa,author:"تدوین آموزشی AUTONEX",publisher:"تلفیق سه مرجع فنی موجود در مخزن",document_pages:null,document_edition:raw.meta.version,scope_note:raw.meta.safety,citation_note:raw.meta.dtc_policy,source_distribution_note:raw.meta.methodology},modules};
 }
 function adaptAutel(raw,device){
  const grouped=new Map();
  raw.entries.forEach(e=>{const k=e.category||"سایر";if(!grouped.has(k))grouped.set(k,[]);grouped.get(k).push(e)});
  const modules=[...grouped.entries()].map(([category,entries],index)=>({id:"autel-"+category.toLowerCase().replace(/[^a-z0-9]+/g,"-"),title:category,summary:"آموزش اصطلاحات، مسیر منو و کاربرد گزینه‌های "+category+" در دستگاه Autel.",topics:entries.map(e=>{
   const path=arr(e.menu_path).join("  ›  ");
   const pageRefs=arr(e.source_refs).map(x=>"صفحه "+x.printed_page+" — "+x.locator);
   const related=arr(e.related_terms).map(x=>x.term+" ("+x.relation+")");
   const alternatives=arr(e.menu_path_alternatives).map(x=>arr(x).join(" › "));
   const technicalStatus=e.verification?.technical?.status||"not_recorded";
   const translationStatus=e.verification?.translation?.status||"not_recorded";
   const exampleStatus=e.verification?.workshop_example?.status||"not_recorded";
   return makeTopic({
    id:e.id,title:e.term_en||e.id,level:technicalStatus==="verified"?"مسیر مستند در راهنمای دستگاه؛ وابسته به خودرو":"نیازمند بررسی",
    summary:(e.term_fa?e.term_fa+" — ":"")+(e.usage_fa||e.technical_description_fa||"شرح گزینه دستگاه دیاگ."),
    concepts:[
     "نام انگلیسی در راهنما: "+(e.term_en_as_written_in_manual||e.term_en||"—"),
     "معادل فارسی پیشنهادی: "+(e.term_fa||"در حال تکمیل")+"؛ تلفظ: "+(e.pronunciation_fa||"—"),
     "شرح فنی: "+(e.technical_description_fa||"شرح تکمیلی در حال بررسی است."),
     "دستگاه‌های مشمول: "+arr(e.applies_to).join("، "),
     "زمینه استفاده: "+(e.context||"—")
    ],
    procedure:[
     "مسیر منو: "+(path||"در راهنمای در دسترس ثبت نشده است."),
     "پیش‌نیاز: "+(e.path_prerequisite||"طبق راهنمای دستگاه بررسی شود."),
     "کاربرد آموزشی: "+(e.usage_fa||"برای این گزینه توضیح کاربرد تکمیلی ثبت نشده است."),
     ...(alternatives.length?["مسیرهای جایگزین ثبت‌شده: "+alternatives.join(" | ")]:[])
    ],
    diagnostic:[
     "محدودیت مسیر: "+(e.path_note||"نام و دسترسی گزینه ممکن است با خودرو/نسخه نرم‌افزار تغییر کند."),
     "یادداشت فنی: "+(e.notes||"—"),
     "اصطلاحات مرتبط: "+(related.join("، ")||"—"),
     "وضعیت بررسی فنی: "+technicalStatus+"؛ وضعیت ترجمه: "+translationStatus+"؛ وضعیت مثال: "+exampleStatus,
     "مثال کارگاهی: "+(e.workshop_example_fa||"برای این گزینه مثال ثبت نشده است.")+" (مثال آموزشی تألیفی؛ نه گزارش قطعی از یک تعمیر واقعی)"
    ],
    terms:[[e.term_en||"—",e.term_fa||"—"],...arr(e.term_variants_in_manual).map(v=>[v.text,"صورت دیگر در راهنما؛ صفحات "+v.printed_pages])],
    source_pages:pageRefs.join(" | ")||"ارجاع صفحه در رکورد موجود نیست"
   });
  })}));
  return {meta:{title_fa:"Autel MaxiSys MS906 Pro / MS906 Pro-TS",author:"Autel",publisher:"MaxiSys User Manual",document_pages:null,document_edition:raw.entries[0]?.source_document?.document_edition||"US V2.1",scope_note:"این محتوا بر اساس راهنمای کاربر است. مسیرهای منو وابسته به خودرو و نسخه نرم‌افزار دستگاه‌اند؛ نسخه نرم‌افزار نصب‌شده در راهنمای مورد استفاده مستند نشده است.",citation_note:"ترجمه فارسی و مثال‌های کارگاهی در وضعیت پیش‌نویس/تألیفی هستند و باید جداگانه بازبینی شوند.",source_distribution_note:"دستگاه: "+arr(device.model_family).join(" / ")+" • رابط ارتباطی: "+(device.vci||"ثبت نشده")+" • نسخه راهنما: "+(device.documentation?.document_edition||"ثبت نشده")+". نسخه نرم‌افزار خود دستگاه از این PDF قابل استنتاج نیست."},modules};
 }
 function tabs(){
  academyTabs.innerHTML=academyChapters.map((c,i)=>'<button class="academy-tab '+(i===activeChapter?'active':'')+'" data-chapter="'+i+'">'+esc(c.title)+'</button>').join("");
  academyTabs.querySelectorAll("[data-chapter]").forEach(b=>b.onclick=()=>{activeChapter=Number(b.dataset.chapter);activeSection=0;renderAcademy()});
 }
 function topics(data){return data.modules.flatMap(m=>m.topics.map(t=>({...t,moduleId:m.id,moduleTitle:m.title})))}
 function section(title,tag,items,ordered=false){
  if(!arr(items).length)return "";
  const listTag=ordered?"ol":"ul";
  return '<section class="src-detail-section"><div class="src-section-heading"><span>'+tag+'</span><h4>'+title+'</h4></div><'+listTag+' class="src-bullet-list">'+items.map(x=>'<li>'+esc(x)+'</li>').join("")+'</'+listTag+'></section>';
 }
 function terms(items){
  if(!arr(items).length)return "";
  return '<section class="src-detail-section"><div class="src-section-heading"><span>ENGLISH VOCABULARY</span><h4>واژگان فنی این درس</h4></div><div class="src-term-grid">'+items.map(x=>'<div><b dir="ltr">'+esc(x[0])+'</b><span>'+esc(x[1])+'</span></div>').join("")+'</div></section>';
 }
 function render(){
  const d=defs[activeChapter-offset],s=states[d.id];tabs();
  if(!s.data){academyContent.innerHTML='<div class="src-loading"><span class="eyebrow">SOURCE COURSE</span><h3>در حال بارگذاری دوره…</h3><p>'+esc(s.error||"محتوای آموزشی در حال دریافت است.")+'</p></div>';return}
  const data=s.data,module=data.modules.find(m=>m.id===s.moduleId)||data.modules[0],all=topics(data);
  const search=s.search.trim().toLowerCase();
  const hay=x=>[x.title,x.summary,x.moduleTitle,...arr(x.concepts),...arr(x.procedure),...arr(x.diagnostic),...arr(x.terms).flat()].join(" ").toLowerCase();
  const visible=(search?all:module.topics.map(t=>({...t,moduleId:module.id,moduleTitle:module.title}))).filter(t=>!search||hay(t).includes(search));
  const t=visible.find(x=>x.id===s.topicId)||visible[0]||all.find(x=>x.id===s.topicId)||all[0];
  if(t&&t.id!==s.topicId){s.topicId=t.id;s.answered=false;s.answerIndex=null}
  const m=data.meta,notice=[m.scope_note,m.citation_note].filter(Boolean).join(" ");
  const sourceEdition=m.document_pages?num(m.document_pages)+" صفحه":("نسخه "+(m.document_edition||"—"));
  academyContent.innerHTML='<div class="src-course"><div class="src-course-hero"><div><span class="eyebrow">AUTONEX TECHNICAL ACADEMY</span><h2>'+esc(d.title)+'</h2><p>'+esc(module.summary)+'</p></div><div class="src-course-stat"><b>'+num(all.length)+'</b><span>درس / مدخل</span><b>'+num(data.modules.length)+'</b><span>فصل</span></div></div>'+
   '<div class="src-meta"><div class="src-meta-icon">'+d.icon+'</div><div class="src-meta-copy"><span>'+d.short+'</span><b>'+esc(m.title_fa||m.source_title||"مرجع آموزشی")+'</b><small>'+esc(m.author||m.publisher||"")+' • '+esc(sourceEdition)+'</small></div><div class="src-meta-badge">'+num(all.length)+' مدخل آموزشی</div></div>'+
   '<div class="src-source-notice"><b>منبع، دامنه و وضعیت بازبینی</b><p>'+esc(notice)+'</p><small>'+esc(m.source_distribution_note||m.copyright_note||"")+'</small></div>'+
   '<label class="src-search"><span>⌕</span><input id="srcSearch" type="search" value="'+esc(s.search)+'" placeholder="جست‌وجوی درس، مسیر منو، اصطلاح یا مفهوم فنی…"></label>'+
   '<div class="src-module-nav">'+data.modules.map((x,i)=>'<button type="button" class="'+(x.id===s.moduleId?"active":"")+'" data-module="'+esc(x.id)+'"><span>'+num(i+1)+'</span>'+esc(x.title)+' <small>('+num(x.topics.length)+')</small></button>').join("")+'</div>'+
   '<div class="src-learning-layout"><div class="src-topic-list"><div class="src-topic-list-head"><b>درس‌ها و گزینه‌ها</b><span>'+num(visible.length)+' مورد</span></div>'+
   visible.map((x,i)=>'<button type="button" data-topic="'+esc(x.id)+'" class="src-topic-item '+(t&&x.id===t.id?"active":"")+'"><span class="src-topic-n">'+num(i+1)+'</span><span class="src-topic-txt"><b>'+esc(x.title)+'</b><small>'+esc(x.level)+'</small></span><i>←</i></button>').join("")+(visible.length?"":'<p class="src-no-results">موردی پیدا نشد.</p>')+
   '</div><div>'+(t?'<article class="src-detail-card"><div class="src-detail-top"><div><span class="src-detail-module">'+esc(t.moduleTitle)+'</span><span class="src-detail-level">'+esc(t.level)+'</span><h3>'+esc(t.title)+'</h3><p>'+esc(t.summary)+'</p></div><span class="src-detail-index">'+esc(t.id.toUpperCase())+'</span></div>'+
   section("مفاهیم کلیدی","CORE CONCEPTS",t.concepts)+section("مسیر و مراحل کار","WORKFLOW",t.procedure,true)+section("نکات تشخیصی، محدودیت‌ها و بازبینی","DIAGNOSTIC NOTES",t.diagnostic)+terms(t.terms)+
   (t.quiz?'<section class="src-quiz"><div class="src-quiz-top"><span>KNOWLEDGE CHECK</span><b>آزمون کوتاه</b></div><p>'+esc(t.quiz.q)+'</p><div class="src-quiz-options">'+arr(t.quiz.options).map((o,i)=>'<button type="button" data-answer="'+i+'" '+(s.answered?"disabled":"")+' class="'+(s.answered&&i===t.quiz.answer?"correct":s.answered&&i===s.answerIndex?"incorrect":"")+'">'+esc(o)+'</button>').join("")+'</div>'+(s.answered?'<div class="src-quiz-feedback '+(s.answerIndex===t.quiz.answer?"good":"bad")+'">'+(s.answerIndex===t.quiz.answer?"درست پاسخ دادی. ":"پاسخ صحیح: "+esc(t.quiz.options[t.quiz.answer])+" — ")+esc(t.quiz.why||"")+'</div>':"")+'</section>':"")+
   '<div class="src-citation"><span>ارجاع منبع</span><b>'+esc(t.source_pages||"ارجاع صفحه در حال تکمیل")+'</b></div></article>':'<article class="src-detail-card">برای شروع یکی از درس‌ها را انتخاب کن.</article>')+
   '</div></div></div>';
  academyContent.querySelectorAll("[data-module]").forEach(b=>b.onclick=()=>{s.moduleId=b.dataset.module;s.topicId="";s.search="";s.answered=false;s.answerIndex=null;renderAcademy()});
  academyContent.querySelectorAll("[data-topic]").forEach(b=>b.onclick=()=>{s.topicId=b.dataset.topic;s.answered=false;s.answerIndex=null;renderAcademy()});
  const input=academyContent.querySelector("#srcSearch");
  if(input)input.oninput=e=>{const p=e.target.selectionStart;s.search=e.target.value;renderAcademy();const n=academyContent.querySelector("#srcSearch");if(n){n.focus();n.setSelectionRange(p,p)}};
  academyContent.querySelectorAll("[data-answer]").forEach(b=>b.onclick=()=>{s.answered=true;s.answerIndex=Number(b.dataset.answer);renderAcademy()});
 }
 renderAcademy=function(){if(activeChapter<offset||activeChapter>=offset+defs.length){oldRender();return}render()};
 oldRender();
 Promise.all(defs.map(async d=>{
  try{
   let raw=await fetchJSON(d.file),data;
   if(d.kind==="autel"){const device=await fetchJSON(d.deviceFile);data=adaptAutel(raw,device)}
   else if(d.kind==="sensors")data=adaptSensors(raw);
   else data=raw;
   if(!Array.isArray(data.modules)||!data.modules.length)throw Error("ساختار ماژول‌ها خالی است");
   if(!data.modules.every(m=>Array.isArray(m.topics)))throw Error("ساختار درس‌ها معتبر نیست");
   states[d.id].data=data;
   states[d.id].moduleId=data.modules[0].id;
   states[d.id].topicId=data.modules[0].topics[0]?.id||"";
  }catch(e){states[d.id].error="بارگذاری انجام نشد: "+(e?.message||"خطای ناشناخته");console.error("AUTONEX course load",d.id,e)}
 })).then(()=>{if(activeChapter>=offset&&activeChapter<offset+defs.length)renderAcademy()});
})();