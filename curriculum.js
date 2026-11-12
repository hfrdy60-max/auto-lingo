/* AUTO LINGO structured curriculum renderer */
(() => {
 const $=id=>document.getElementById(id);
 const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const status=$("curriculumStatus"), cards=$("curriculumCards"), view=$("curriculumLesson");
 if(!status||!cards||!view)return;
 let indexData=null;
 async function load(){
  try{
   const r=await fetch("data/lessons/index.json");if(!r.ok)throw Error("index "+r.status);
   indexData=await r.json();
   status.textContent="فهرست محتوای ساختاریافته بارگذاری شد. درس‌های در دسترس: "+indexData.lessons.length;
   cards.innerHTML=indexData.lessons.map(x=>'<article class="curriculum-card"><span class="curriculum-code">'+esc(x.lesson_id)+' • '+esc(x.level_id)+'</span><h3>'+esc(x.title_fa)+'</h3><b dir="ltr">'+esc(x.title_en)+'</b><p>جایگاه در برنامه: '+esc(x.curriculum_position)+' از ۸۰ • وضعیت: نیازمند بازبینی</p><button type="button" data-open-curriculum="'+esc(x.lesson_id)+'">باز کردن محتوای درس ←</button></article>').join("");
   cards.querySelectorAll("[data-open-curriculum]").forEach(b=>b.addEventListener("click",()=>openLesson(b.dataset.openCurriculum)));
  }catch(e){status.textContent="بارگذاری محتوای درس با خطا روبه‌رو شد؛ اتصال اینترنت و مسیر فایل را بررسی کن.";console.error(e)}
 }
 async function openLesson(id){
  const meta=indexData.lessons.find(x=>x.lesson_id===id);if(!meta)return;
  view.classList.remove("hidden");view.innerHTML="<p>در حال بارگذاری محتوای درس…</p>";
  try{
   const [lr,sr,mr]=await Promise.all([fetch(meta.content_path),fetch(meta.sources_path),fetch(meta.term_mapping_path)]);
   if(!lr.ok||!sr.ok||!mr.ok)throw Error("lesson asset missing");
   const [L,S,M]=await Promise.all([lr.json(),sr.json(),mr.json()]);
   const vocab=L.sections.flatMap(s=>s.vocabulary||[]);
   const terms=vocab.map(v=>'<article class="curriculum-item"><b dir="ltr">'+esc(v.en)+'</b><span>'+esc(v.fa)+'</span><small dir="ltr">'+esc(v.example_en||"")+'</small><small>'+esc(v.example_fa||"")+'</small></article>').join("");
   const objectives=L.learning_objectives.map(x=>'<li>'+esc(x)+'</li>').join("");
   const sections=L.sections.map((s,i)=>'<details '+(i===0?"open":"")+'><summary>'+esc(s.title_fa)+' <small dir="ltr">— '+esc(s.title_en)+'</small></summary><div class="lesson-body"><p>'+esc(s.explanation_fa)+'</p>'+(s.key_points?'<ul>'+s.key_points.map(k=>'<li>'+esc(k)+'</li>').join("")+'</ul>':"")+'</div></details>').join("");
   const grammar=L.english_focus;
   const patterns=(grammar.patterns||[]).map(p=>'<div class="curriculum-item"><b dir="ltr">'+esc(p.pattern)+'</b><small>'+esc(p.translation_fa)+'</small></div>').join("");
   const errors=(grammar.common_errors||[]).map(e=>'<div class="curriculum-item"><b dir="ltr">'+esc(e.wrong)+'</b><small dir="ltr">'+esc(e.correct)+'</small><small>'+esc(e.reason_fa)+'</small></div>').join("");
   const read=L.reading;
   const practice=L.guided_practice.map(p=>'<div class="curriculum-item"><b>'+esc(p.prompt_fa)+'</b><small>'+esc(p.answer_en||p.answer||"")+'</small></div>').join("");
   const quiz=L.knowledge_check.map((q,i)=>{
    let answer=q.correct_answer||q.answer||"";
    let options=q.options||[];
    if(!options.length&&q.accepted_answers)options=q.accepted_answers;
    const choices=options.map(o=>'<button type="button" data-answer="'+esc(o)+'" data-correct="'+(String(o)===String(answer)?"1":"0")+'">'+esc(o)+'</button>').join("");
    return '<article class="curriculum-question"><b>'+esc(i+1)+'. '+esc(q.question_fa||q.question_en||"تمرین")+'</b>'+(q.question_en?'<p dir="ltr">'+esc(q.question_en)+'</p>':"")+(choices||'<p>پاسخ: '+esc(answer)+'</p>')+'<small class="quiz-feedback"></small></article>';
   }).join("");
   const src=S.sources.map(x=>'<li><a href="'+esc(x.url)+'" target="_blank" rel="noopener">'+esc(x.title)+'</a> — '+esc(x.publisher)+' <small>(تأییدنشده)</small><p>'+esc(x.limitations||"")+'</p></li>').join("");
   const map=M.records.map(x=>'<div class="curriculum-item"><b dir="ltr">'+esc(x.term_en)+'</b><small>'+esc(x.term_fa)+'</small><small>'+esc(x.canonical_term_id||x.canonical_part_id||"شناسه canonical پیدا نشد")+' • '+esc(x.mapping_status)+'</small></div>').join("");
   view.innerHTML='<button type="button" id="closeCurriculum">× بستن درس</button><span class="curriculum-code">'+esc(L.lesson_id)+' • '+esc(L.level_id)+' • وضعیت: نیازمند بازبینی</span><h2>'+esc(L.lesson_title_fa)+'</h2><h3 dir="ltr">'+esc(L.lesson_title_en)+'</h3><div class="curriculum-meta"><span>۲۷ دقیقه</span><span>هدف تسلط: ۷۰٪</span><span>۱۰ اصطلاح مرجع هدف</span><span>جایگاه ۱۳ از ۸۰</span></div><p>'+esc(L.lesson_intro_fa)+'</p><h3>هدف‌های یادگیری</h3><ul>'+objectives+'</ul><h3>بخش‌های آموزشی</h3>'+sections+'<h3>واژگان و مثال‌ها</h3><div class="curriculum-words">'+terms+'</div><h3>دستور زبان: There is / There are</h3><p>'+esc(grammar.grammar_fa)+'</p><div class="curriculum-words">'+patterns+errors+'</div><h3>متن خواندن</h3><article class="curriculum-item"><b dir="ltr">'+esc(read.title_en)+'</b><p dir="ltr">'+esc(read.text_en)+'</p><p>'+esc(read.text_fa)+'</p></article><h3>درک مطلب</h3><ul>'+read.comprehension.map(x=>'<li>'+esc(x.question_fa)+' — '+esc(x.answer_fa)+'</li>').join("")+'</ul><h3>تمرین هدایت‌شده</h3><div class="curriculum-words">'+practice+'</div><h3>آزمون درس</h3><div class="curriculum-quiz">'+quiz+'</div><h3>تطبیق واژگان با بانک مرجع</h3><p>فقط تطبیق دقیق شناسه‌دار به‌عنوان اصطلاح مرجع شمرده شده؛ شناسه‌ای حدس زده نشده است.</p><div class="curriculum-words">'+map+'</div><h3>منابع تحقیق</h3><ul>'+src+'</ul><p><b>محدودیت انتشار:</b> فایل صوتی و تصویر واقعی قطعات هنوز متصل نشده‌اند؛ منابع نیز کاندید و تأییدنشده‌اند. بنابراین درس برای بازبینی است، نه انتشار نهایی.</p>';
   $("closeCurriculum").addEventListener("click",()=>view.classList.add("hidden"));
   view.querySelectorAll(".curriculum-question button").forEach(b=>b.addEventListener("click",()=>{
    const box=b.closest(".curriculum-question");box.querySelectorAll("button").forEach(x=>x.disabled=true);
    b.classList.add(b.dataset.correct==="1"?"correct":"wrong");
    box.querySelector(".quiz-feedback").textContent=b.dataset.correct==="1"?"پاسخ درست است.":"پاسخ انتخابی درست نیست.";
   }));
   view.scrollIntoView({behavior:"smooth",block:"start"});
  }catch(e){view.innerHTML="<p>نمایش درس ممکن نشد. مسیر فایل‌های درس را بررسی کن.</p>";console.error(e)}
 }
 load();
})();