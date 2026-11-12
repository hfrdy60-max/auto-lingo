/* AUTONEX — interactive sensor reference module */
(() => {
  "use strict";
  const chapterId = "sensor-reference";
  const sensorChapter = {
    id: chapterId,
    title: "مرجع جامع سنسورها",
    level: "منبع آموزشی ساختاریافته | ۱۰ سنسور اصلی",
    intro: "شناخت عملکرد، سیگنال، پایه‌ها، عیب‌یابی و واژگان فنی سنسورهای خودرو.",
    flow: ["مبانی ECU", "شناخت سنسور", "تحلیل سیگنال", "تست و عیب‌یابی"],
    sections: [["مرجع سنسورها", "این بخش از بانک مرجع سنسورهای خودرو بارگذاری می‌شود.", "ECU = واحد کنترل الکترونیکی"]]
  };
  if (!Array.isArray(academyChapters) || academyChapters.some(x => x.id === chapterId)) return;
  const chapterIndex = academyChapters.length;
  academyChapters.push(sensorChapter);

  const baseRenderAcademy = renderAcademy;
  let ref = null;
  let loadError = "";
  let view = "sensors";
  let selectedId = "CKP";
  let detailTab = "principle";
  let searchTerm = "";
  let categoryFilter = "همه";
  let quizAnswered = false;

  const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[ch]));
  const arr = value => Array.isArray(value) ? value : [];
  const faNum = value => {
    try { return Number(value).toLocaleString("fa-IR"); } catch { return String(value); }
  };
  const currentSensor = () => ref?.sensors?.find(s => s.id === selectedId) || ref?.sensors?.[0];

  function tabButton(key, label, active) {
    return '<button type="button" class="sensor-subtab '+(active?'active':'')+'" data-sensor-view="'+esc(key)+'">'+esc(label)+'</button>';
  }
  function sensorChapterHeader() {
    academyTabs.innerHTML = academyChapters.map((c,i) =>
      '<button class="academy-tab '+(i===activeChapter?'active':'')+'" data-chapter="'+i+'">'+esc(c.title)+'</button>'
    ).join("");
    academyTabs.querySelectorAll("[data-chapter]").forEach(button => {
      button.addEventListener("click", () => {
        activeChapter = Number(button.dataset.chapter);
        activeSection = 0;
        renderAcademy();
      });
    });
  }
  function sourceStrip() {
    const pdf = "فردین گردی - سنسورهای خودرو_CY2wHXq.pdf";
    return '<div class="sensor-source-strip"><div><b>منبع آموزشی</b><span>'+esc(ref.meta.author)+' • '+esc(ref.meta.institution)+' • '+esc(ref.meta.academic_year)+'</span><small>'+esc(ref.meta.scope_note)+'</small></div><a href="'+encodeURI(pdf)+'" target="_blank" rel="noopener">مشاهده PDF اصلی ↗</a></div>';
  }
  function renderOverview() {
    const e = ref.ecu;
    return '<div class="sensor-reference-heading"><span class="eyebrow">ECU FUNDAMENTALS</span><h3>'+esc(e.title)+'</h3><p>'+esc(e.intro)+'</p></div>'+
      '<div class="sensor-info-grid">'+arr(e.responsibilities).map((x,i)=>'<article class="sensor-info-card"><small>وظیفه '+faNum(i+1)+'</small><b>'+esc(x)+'</b></article>').join("")+'</div>'+
      '<h4 class="sensor-block-title">انواع حافظه ECU</h4><div class="sensor-memory-grid">'+arr(e.memories).map(m=>'<article class="sensor-memory-card"><span>'+esc(m.en)+'</span><h4>'+esc(m.name)+'</h4><b>'+esc(m.types)+'</b><p>'+esc(m.description)+'</p></article>').join("")+'</div>'+
      '<div class="sensor-callout"><b>نکته مهم</b><p>رفتار حافظه و داده‌های تطبیقی در ECUهای مختلف یکسان نیست. زمان قطع برق و پیامدهای آن را از دستورالعمل همان خودرو بررسی کن.</p></div>'+
      '<h4 class="sensor-block-title">نمونه ECUهای ذکرشده در منبع</h4><p class="sensor-muted">'+esc(e.catalog_note)+'</p>'+
      '<div class="sensor-table-wrap"><table class="sensor-table"><thead><tr><th>مدل ECU</th><th>خودرو / کاربرد ذکرشده</th><th>کانکتور و پایه</th></tr></thead><tbody>'+arr(e.ecu_catalog).map(row=>'<tr><td dir="ltr">'+esc(row[0])+'</td><td>'+esc(row[1])+'</td><td>'+esc(row[2])+'</td></tr>').join("")+'</tbody></table></div>'+
      '<h4 class="sensor-block-title">مروری بر تاریخچه حسگرهای خودرو</h4><div class="sensor-timeline">'+arr(e.timeline).map(item=>'<article><b>'+esc(item[0])+'</b><p>'+esc(item[1])+'</p></article>').join("")+'</div>'+
      '<h4 class="sensor-block-title">روش استاندارد فکرکردن در عیب‌یابی سنسور</h4><ol class="sensor-method-list">'+arr(ref.diagnostic_method).map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol>';
  }
  const detailDefinitions = [
    ["principle","عملکرد و وظیفه"],
    ["signal","پایه‌ها و سیگنال"],
    ["symptoms","علائم خرابی"],
    ["tests","روش‌های تست"],
    ["notes","نکات تعمیرگاهی"],
    ["vocab","واژگان انگلیسی"]
  ];
  function detailBody(sensor) {
    const map = {
      principle: [["اصل کار",sensor.principle],["ساختمان / نوع سنسور",sensor.construction],["کاربرد اطلاعات در ECU",arr(sensor.ecu_uses).join(" • ")],["محل نصب",sensor.location]],
      signal: [["پایه‌ها و اتصالات",arr(sensor.pinout).join("\n")],["نوع و شکل سیگنال",arr(sensor.signal).join("\n")]],
      symptoms: [["نشانه‌های احتمالی",arr(sensor.symptoms).join("\n")],["تذکر تشخیصی","هیچ‌یک از این نشانه‌ها به‌تنهایی اثبات خرابی سنسور نیست. تغذیه، سیم‌کشی، کانکتور، شرایط مکانیکی و داده‌های مرتبط نیز باید بررسی شوند."]],
      tests: [["روش‌های بررسی",arr(sensor.tests).join("\n")],["ترتیب پیشنهادی",arr(ref.diagnostic_method).join("\n")]],
      notes: [["نکات و محدودیت‌ها",arr(sensor.notes).join("\n")],["هشدارهای فنی",arr(sensor.cautions).join("\n")],["شماره صفحات منبع","صفحات "+sensor.pages]],
      vocab: [["واژگان و معادل فارسی",arr(sensor.vocab).map(v=>v[0]+" = "+v[1]).join("\n")],["اصطلاح کلیدی",sensor.name_en+" = "+sensor.name_fa]]
    };
    return (map[detailTab] || map.principle).map(([title,text]) =>
      '<section class="sensor-detail-block"><h4>'+esc(title)+'</h4><p>'+esc(text)+'</p></section>'
    ).join("");
  }
  function renderSensorDetail(sensor) {
    const quiz = sensor.quiz || {};
    return '<article class="sensor-detail-panel">'+
      '<div class="sensor-detail-top"><div><span class="sensor-code">'+esc(sensor.id)+'</span><span class="sensor-category">'+esc(sensor.category)+'</span><h3>'+esc(sensor.name_fa)+'</h3><p dir="ltr">'+esc(sensor.name_en)+'</p></div><span class="sensor-page">صفحات '+esc(sensor.pages)+'</span></div>'+
      '<div class="sensor-detail-tabs">'+detailDefinitions.map(x=>'<button type="button" class="sensor-subtab '+(detailTab===x[0]?'active':'')+'" data-sensor-detail="'+esc(x[0])+'">'+esc(x[1])+'</button>').join("")+'</div>'+
      '<div class="sensor-detail-content">'+detailBody(sensor)+'</div>'+
      '<div class="sensor-quiz"><div><span>CHECK YOUR KNOWLEDGE</span><b>سنجش سریع: '+esc(sensor.id)+'</b></div><p>'+esc(quiz.q||"")+'</p><div class="sensor-quiz-options">'+arr(quiz.options).map((x,i)=>'<button type="button" data-sensor-answer="'+i+'" '+(quizAnswered?'disabled':'')+'>'+esc(x)+'</button>').join("")+'</div><p class="sensor-quiz-feedback" id="sensorQuizFeedback">'+(quizAnswered?'<span>'+esc(quiz.why||"")+'</span>':"")+'</p></div>'+
      '</article>';
  }
  function renderSensorList() {
    const sensors = arr(ref.sensors);
    const categories = ["همه",...new Set(sensors.map(s=>s.category))];
    const filtered = sensors.filter(s =>
      (categoryFilter==="همه" || s.category===categoryFilter) &&
      (s.name_fa+" "+s.name_en+" "+s.id+" "+s.category).toLowerCase().includes(searchTerm.toLowerCase())
    );
    const selected = currentSensor();
    return '<div class="sensor-library-intro"><div><span class="eyebrow">SENSOR KNOWLEDGE BASE</span><h3>بانک مرجع ۱۰ سنسور اصلی موتور</h3><p>یک سنسور را انتخاب کن تا عملکرد، مدار، سیگنال، علائم خرابی، روش آزمون و اصطلاحات تخصصی آن را ببینی.</p></div><strong>'+faNum(sensors.length)+'<small>سنسور</small></strong></div>'+
      '<label class="sensor-search"><span>⌕</span><input id="sensorSearchInput" type="search" value="'+esc(searchTerm)+'" placeholder="جست‌وجو: CKP، سنسور دما، MAP ..."></label>'+
      '<div class="sensor-category-filters">'+categories.map(c=>'<button type="button" data-sensor-category="'+esc(c)+'" class="'+(categoryFilter===c?'active':'')+'">'+esc(c)+'</button>').join("")+'</div>'+
      '<div class="sensor-layout"><div class="sensor-card-list">'+filtered.map(s=>'<button type="button" data-select-sensor="'+esc(s.id)+'" class="sensor-card '+(selected&&selected.id===s.id?'active':'')+'"><span>'+esc(s.id)+'</span><b>'+esc(s.name_fa)+'</b><small dir="ltr">'+esc(s.name_en)+'</small><em>'+esc(s.category)+'</em></button>').join("")+(filtered.length?"":'<p class="sensor-muted">نتیجه‌ای پیدا نشد.</p>')+'</div>'+
      '<div class="sensor-detail-host">'+(selected?renderSensorDetail(selected):'<div class="sensor-detail-panel">سنسوری انتخاب نشده است.</div>')+'</div></div>';
  }
  function renderLimitations() {
    return '<div class="sensor-reference-heading"><span class="eyebrow">SOURCE REVIEW</span><h3>راهنمای اعتبارسنجی و محدودیت‌های منبع</h3><p>محتوای تحقیق در برنامه حفظ شده، اما موارد مدل‌محور به‌عنوان قانون همگانی عرضه نمی‌شوند.</p></div>'+
      '<div class="sensor-limitations">'+arr(ref.source_limitations).map((x,i)=>'<article><b>'+faNum(i+1)+'</b><p>'+esc(x)+'</p></article>').join("")+'</div>'+
      '<div class="sensor-callout warning"><b>قانون اصلی تعمیرگاهی</b><p>ابتدا شماره فنی قطعه و نقشه همان خودرو را پیدا کن. سپس تغذیه، زمین، سیگنال و شرایط واقعی کار را اندازه بگیر. تعویض قطعه فقط به‌دلیل ثبت یک کد خطا روش تشخیص قابل اتکایی نیست.</p></div>'+
      '<div class="sensor-source-strip"><div><b>مشخصات فایل منبع</b><span>'+esc(ref.meta.title_fa)+' • '+faNum(ref.meta.document_pages)+' صفحه • '+esc(ref.meta.source_pages)+'</span><small>منابع فهرست‌شده در PDF شامل کتاب «سنسورها در خودرو» و چند منبع عمومی وب است؛ برای تمام مقادیر فنی ارجاع مستقل و صفحه‌به‌صفحه ارائه نشده است.</small></div></div>';
  }
  function renderSensorModule() {
    sensorChapterHeader();
    const nav = '<div class="sensor-module-nav">'+
      tabButton("sensors","۱۰ سنسور خودرو",view==="sensors")+
      tabButton("ecu","ECU، حافظه و مدل‌ها",view==="ecu")+
      tabButton("limits","روش تشخیص و اعتبار منبع",view==="limits")+
      '</div>';
    academyContent.innerHTML = '<div class="sensor-module">'+
      '<div class="sensor-module-hero"><div><span class="eyebrow">AUTONEX TECHNICAL REFERENCE</span><h2>سنسورهای خودرو؛ از شناخت تا عیب‌یابی</h2><p>محتوای تحقیق ۴۰ صفحه‌ای به فصل آموزشی، واژه‌نامه فنی و مسیر عیب‌یابی تبدیل شده است.</p></div><div class="sensor-hero-stat"><b>۱۰</b><span>سنسور ساختاریافته</span><b>۳</b><span>بخش مرجع</span></div></div>'+
      sourceStrip()+nav+
      (view==="ecu"?renderOverview():view==="limits"?renderLimitations():renderSensorList())+
      '</div>';
    academyContent.querySelectorAll("[data-sensor-view]").forEach(b=>b.addEventListener("click",()=>{
      view=b.dataset.sensorView; renderAcademy();
    }));
    const search = document.getElementById("sensorSearchInput");
    if (search) search.addEventListener("input",e=>{
      searchTerm=e.target.value;
      const pos=e.target.selectionStart;
      renderAcademy();
      const next=document.getElementById("sensorSearchInput");
      if(next){next.focus();next.setSelectionRange(pos,pos);}
    });
    academyContent.querySelectorAll("[data-sensor-category]").forEach(b=>b.addEventListener("click",()=>{
      categoryFilter=b.dataset.sensorCategory; renderAcademy();
    }));
    academyContent.querySelectorAll("[data-select-sensor]").forEach(b=>b.addEventListener("click",()=>{
      selectedId=b.dataset.selectSensor; detailTab="principle"; quizAnswered=false; renderAcademy();
    }));
    academyContent.querySelectorAll("[data-sensor-answer]").forEach(b=>b.addEventListener("click",()=>{
      const s=currentSensor(),q=s?.quiz;if(!q)return;
      quizAnswered=true;
      const choice=Number(b.dataset.sensorAnswer),correct=choice===q.answer;
      academyContent.querySelectorAll("[data-sensor-answer]").forEach(x=>{
        x.disabled=true;
        if(Number(x.dataset.sensorAnswer)===q.answer)x.classList.add("correct");
      });
      if(!correct)b.classList.add("incorrect");
      const feedback=document.getElementById("sensorQuizFeedback");
      if(feedback)feedback.textContent=(correct?"درست است. ":"پاسخ صحیح: "+q.options[q.answer]+" — ")+(q.why||"");
    }));
    academyContent.querySelectorAll(".sensor-module-nav [data-sensor-view]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.sensorView===view)));
    const detailTabs = academyContent.querySelector(".sensor-detail-tabs");
    if (detailTabs) detailTabs.querySelectorAll("[data-sensor-detail]").forEach(b=>b.addEventListener("click",()=>{detailTab=b.dataset.sensorDetail;quizAnswered=false;renderAcademy();}));
  }
  const originalGlobalRender = renderAcademy;
  renderAcademy = function() {
    if (activeChapter !== chapterIndex) return originalGlobalRender();
    if (!ref) {
      sensorChapterHeader();
      academyContent.innerHTML = '<div class="sensor-loading"><span class="eyebrow">LOADING TECHNICAL REFERENCE</span><h3>در حال بارگذاری بانک سنسورها…</h3><p>'+(loadError?esc(loadError):"محتوای مرجع در حال دریافت است.")+'</p></div>';
      return;
    }
    renderSensorModule();
  };
  originalGlobalRender();

  fetch("data/technical_reference/automotive_sensors_fardin_ghordi.json")
    .then(response => { if(!response.ok) throw new Error("HTTP "+response.status); return response.json(); })
    .then(data => {
      if (!data || !Array.isArray(data.sensors) || data.sensors.length !== 10) throw new Error("ساختار بانک مرجع معتبر نیست.");
      ref = data;
      if (activeChapter === chapterIndex) renderAcademy();
    })
    .catch(error => {
      loadError = "بارگذاری مرجع انجام نشد: "+(error?.message || "خطای ناشناخته");
      if (activeChapter === chapterIndex) renderAcademy();
      console.error("AUTONEX sensor reference:", error);
    });
})();