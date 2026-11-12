/* AUTO LINGO structured curriculum renderer — accessible lesson + quiz interactions */
(() => {
 "use strict";
 const $=id=>document.getElementById(id);
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const norm=v=>String(v??"").toLocaleLowerCase("en").trim().replace(/[.!?،؛,:]/g,"").replace(/\s+/g," ");
 const status=$("curriculumStatus"), cards=$("curriculumCards"), view=$("curriculumLesson");
 if(!status||!cards||!view)return;
 let indexData=null;
 async function json(path){const r=await fetch(path);if(!r.ok)throw Error(path+" ("+r.status+")");return r.json();}
 function renderQuestion(q,i){
  const pending=q.type==="image_part_id"&&!q.image_asset, opts=Array.isArray(q.options)?q.options:[];
  const answer=q.accepted_answers||[q.correct_answer||q.answer||""], disabled=pending?"disabled":"";
  const choices=opts.length?'<div class="quiz-options">'+opts.map(o=>'<button type="button" data-q="'+i+'" data-value="'+esc(o)+'" '+disabled+'>'+esc(o)+'</button>').join("")+'</div>':"";
  const input=!opts.length&&!pending?'<div class="quiz-entry"><input type="text" data-entry="'+i+'" aria-label="پاسخ سؤال '+(i+1)+'" placeholder="پاسخت را بنویس…"><button type="button" data-check="'+i+'">بررسی پاسخ</button></div>':"";
  const transcript=q.transcript_en?'<p class="quiz-transcript" dir="ltr"><b>متن تمرین شنیداری (فعلاً بدون فایل صوتی):</b> '+esc(q.transcript_en)+'</p>':"";
  const note=q.note_fa?'<small class="quiz-note">'+esc(q.note_fa)+'</small>':"";
  return '<article class="curriculum-question" data-question="'+i+'" data-answers="'+esc(JSON.stringify(answer))+'" data-explanation="'+esc(q.explanation_fa||"")+'"><b>'+esc(i+1)+'. '+esc(q.question_fa||q.question_en||"تمرین")+'</b>'+(q.question_en?'<p dir="ltr">'+esc(q.question_en)+'</p>':"")+transcript+choices+input+(pending?'<p class="quiz-note">این سؤال تا زمان افزودن تصویر معتبر و تطبیق شناسه قطعه غیرفعال است.</p>':"")+note+'<small class="quiz-feedback" aria-live="polite"></small></article>';
 }
 async function load(){
  try{
   indexData=await json("data/lessons/index.json");const lessons=Array.isArray(indexData.lessons)?indexData.lessons:[];
   status.textContent="فهرست محتوای ساختاریافته بارگذاری شد. درس‌های در دسترس: "+lessons.length;
   cards.innerHTML=lessons.map(x=>'<article class="curriculum-card"><span class="curriculum-code">'+esc(x.lesson_id)+' • '+esc(x.level_id)+'</span><h3>'+esc(x.title_fa)+'</h3><b dir="ltr">'+esc(x.title_en)+'</b><p>جایگاه در برنامه: '+esc(x.curriculum_position)+' از ۸۰ • وضعیت: نیازمند بازبینی</p><button type="button" data-open-curriculum="'+esc(x.lesson_id)+'">باز کردن محتوای درس ←</button></article>').join("");
   cards.querySelectorAll("[data-open-curriculum]").forEach(b=>b.addEventListener("click",()=>openLesson(b.dataset.openCurriculum)));
  }catch(e){status.textContent="بارگذاری فهرست درس‌ها ناموفق بود؛ اتصال اینترنت و مسیر فایل را بررسی کن.";console.error(e)}
 }
 async function openLesson(id){
  const meta=indexData?.lessons?.find(x=>x.lesson_id===id);if(!meta)return;
  view.classList.remove("hidden");view.innerHTML="<p>در حال بارگذاری محتوای درس…</p>";
  try{
   const [L,S,M]=await Promise.all([json(meta.content_path),json(meta.sources_path),json(meta.term_mapping_path)]);
   const sections=Array.isArray(L.sections)?L.sections:[];
   const vocab=sections.flatMap(s=>s.vocabulary||[]);
   const terms=vocab.map(v=>'<article class="curriculum-item"><b dir="ltr">'+esc(v.en)+'</b><span>'+esc(v.fa)+'</span><small dir="ltr">'+esc(v.example_en||"")+'</small><small>'+esc(v.example_fa||"")+'</small></article>').join("");
   const objectives=(L.learning_objectives||[]).map(x=>'<li>'+esc(x)+'</li>').join(""), prerequisites=(L.prerequisites||[]).map(x=>'<li>'+esc(x)+'</li>').join("");
   const sectionHtml=sections.map((s,i)=>'<details '+(i===0?"open":"")+'><summary>'+esc(s.title_fa)+' <small dir="ltr">— '+esc(s.title_en)+'</small></summary><div class="lesson-body"><p>'+esc(s.explanation_fa)+'</p>'+(s.key_points?.length?'<ul>'+s.key_points.map(k=>'<li>'+esc(k)+'</li>').join("")+'</ul>':"")+'</div></details>').join("");
   const grammar=L.english_focus||{}, patterns=(grammar.patterns||[]).map(p=>'<div class="curriculum-item"><b dir="ltr">'+esc(p.pattern)+'</b><small>'+esc(p.translation_fa)+'</small></div>').join("");
   const errors=(grammar.common_errors||[]).map(e=>'<div class="curriculum-item"><b dir="ltr">'+esc(e.wrong)+'</b><small dir="ltr">'+esc(e.correct)+'</small><small>'+esc(e.reason_fa)+'</small></div>').join("");
   const read=L.reading||{}, comprehension=(read.comprehension||[]).map(x=>'<li>'+esc(x.question_fa)+' — '+esc(x.answer_fa)+'</li>').join("");
   const practice=(L.guided_practice||[]).map((p,i)=>'<article class="curriculum-item"><b>'+esc(i+1)+'. '+esc(p.prompt_fa)+'</b>'+(p.options?'<p dir="ltr">'+p.options.map(esc).join(" • ")+'</p>':"")+'<small>پاسخ پیشنهادی: '+esc(p.answer_en||p.answer||"")+'</small></article>').join("");
   const quiz=(L.knowledge_check||[]).map(renderQuestion).join("");
   const src=(S.sources||[]).map(x=>'<li><a href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">'+esc(x.title)+'</a> — '+esc(x.publisher)+' <small>(تأییدنشده)</small><p>'+esc(x.limitations||"")+'</p></li>').join("");
   const map=(M.records||[]).map(x=>'<div class="curriculum-item"><b dir="ltr">'+esc(x.term_en)+'</b><small>'+esc(x.term_fa)+'</small><small>'+esc(x.canonical_term_id||x.canonical_part_id||"شناسه canonical پیدا نشد")+' • '+esc(x.mapping_status)+'</small></div>').join("");
   const relationships=(L.system_relationships||[]).map(r=>'<article class="curriculum-item"><b>'+esc(r.concept)+'</b><p dir="ltr">'+(r.items||[]).map(esc).join(" → ")+'</p><small>'+esc(r.note_fa)+'</small></article>').join("");
   const duration=L.blueprint_alignment?.estimated_minutes??"—", mastery=L.blueprint_alignment?.mastery_threshold_pct??"—", position=meta.curriculum_position??"—";
   view.innerHTML='<button type="button" id="closeCurriculum">× بستن درس</button><span class="curriculum-code">'+esc(L.lesson_id)+' • '+esc(L.level_id)+' • وضعیت: نیازمند بازبینی</span><h2>'+esc(L.lesson_title_fa)+'</h2><h3 dir="ltr">'+esc(L.lesson_title_en)+'</h3><div class="curriculum-meta"><span>'+esc(duration)+' دقیقه</span><span>هدف تسلط: '+esc(mastery)+'٪</span><span>جایگاه '+esc(position)+' از ۸۰</span></div><p>'+esc(L.lesson_intro_fa)+'</p><h3>پیش‌نیازها</h3><ul>'+prerequisites+'</ul><h3>هدف‌های یادگیری</h3><ul>'+objectives+'</ul><h3>بخش‌های آموزشی</h3>'+sectionHtml+'<h3>ارتباط اجزای سیستم</h3><div class="curriculum-words">'+relationships+'</div><h3>واژگان و مثال‌ها</h3><div class="curriculum-words">'+terms+'</div><h3>دستور زبان: '+esc(grammar.title||"There is / There are")+'</h3><p>'+esc(grammar.grammar_fa||"")+'</p><div class="curriculum-words">'+patterns+errors+'</div><h3>متن خواندن</h3><article class="curriculum-item"><b dir="ltr">'+esc(read.title_en)+'</b><p dir="ltr">'+esc(read.text_en)+'</p><p>'+esc(read.text_fa)+'</p></article><h3>درک مطلب</h3><ul>'+comprehension+'</ul><h3>تمرین هدایت‌شده</h3><div class="curriculum-words">'+practice+'</div><h3>آزمون درس</h3><p>برای هر سؤال پاسخ بده و دکمه بررسی را بزن؛ پاسخ درست پس از انتخاب نمایش داده می‌شود.</p><div class="curriculum-quiz">'+quiz+'</div><h3>تطبیق واژگان با بانک مرجع</h3><p>فقط تطبیق دقیق شناسه‌دار به‌عنوان اصطلاح مرجع شمرده شده؛ شناسه‌ای حدس زده نشده است.</p><div class="curriculum-words">'+map+'</div><h3>منابع تحقیق</h3><ul>'+src+'</ul><p><b>محدودیت انتشار:</b> فایل صوتی و تصویر واقعی قطعات هنوز متصل نشده‌اند؛ منابع نیز کاندید و تأییدنشده‌اند. بنابراین درس برای بازبینی است، نه انتشار نهایی.</p>';
   $("closeCurriculum").addEventListener("click",()=>view.classList.add("hidden"));
   function check(box,value){
    const accepted=JSON.parse(box.dataset.answers||"[]").map(norm),correct=accepted.includes(norm(value));
    box.querySelectorAll("button").forEach(b=>{if(b.dataset.q!==undefined||b.dataset.check!==undefined)b.disabled=true});
    const feedback=box.querySelector(".quiz-feedback");
    feedback.textContent=(correct?"✓ پاسخ درست است. ":"✕ پاسخ درست: "+(accepted[0]||"—")+". ")+(box.dataset.explanation||"");
    feedback.classList.toggle("correct",correct);feedback.classList.toggle("wrong",!correct);
   }
   view.querySelectorAll("[data-q]").forEach(b=>b.addEventListener("click",()=>check(b.closest(".curriculum-question"),b.dataset.value)));
   view.querySelectorAll("[data-check]").forEach(b=>b.addEventListener("click",()=>{const box=b.closest(".curriculum-question");check(box,box.querySelector("[data-entry]").value);}));
   view.scrollIntoView({behavior:"smooth",block:"start"});
  }catch(e){view.innerHTML="<p>نمایش درس ممکن نشد. مسیر یا ساختار فایل‌های درس را بررسی کن.</p>";console.error(e)}
 }
 load();
})();