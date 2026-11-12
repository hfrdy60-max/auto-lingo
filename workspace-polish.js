/* AUTONEX workspace navigation — guided pages and focused learning tabs */
(() => {
  "use strict";
  const app = document.querySelector(".app-shell");
  if (!app) return;
  const pane = key => app.querySelector('.app-page[data-pane="' + key + '"]');
  const section = id => document.getElementById(id);
  const pages = {
    learn: {
      label: "LEARNING CENTER",
      title: "مسیر یادگیریت را منظم شروع کن",
      description: "یک تخصص را انتخاب کن، درس‌ها را به‌ترتیب جلو ببر و هر وقت آماده بودی وارد آموزش عمیق‌تر سیستم‌های خودرو شو.",
      icon: "▤", tone: "violet",
      note: "پیشنهاد شروع",
      noteText: "برای شروع، از «مسیرهای یادگیری» یک موضوع انتخاب کن.",
      links: [["۰۱","مسیرهای یادگیری","paths"],["۰۲","تعیین سطح","placement"],["۰۳","آکادمی فنی","technicalAcademy"]],
      steps: [["۱","انتخاب تخصص","یکی از مسیرهای آموزشی"],["۲","مطالعه درس‌ها","واژه، معنی و مثال"],["۳","تمرین و تثبیت","تمرین و آزمون پایان درس"]]
    },
    practice: {
      label: "PRACTICE STUDIO", title: "یادگیری را به مهارت تبدیل کن",
      description: "سناریوهای آموزشی را حل کن، با شبیه‌سازهای مفهومی تمرین کن و در پایان واژه‌های دشوار را مرور کن.",
      icon: "✧", tone: "cyan", note: "روش پیشنهادی",
      noteText: "یک تمرین را کامل کن و بعد سراغ مرور هوشمند برو.",
      links: [["۰۱","آزمایشگاه آموزشی","learningLab"],["۰۲","مرور هوشمند","smartReview"],["۰۳","دفترچه اشتباهات","myProgress"]],
      steps: [["۱","موضوع را انتخاب کن","سناریو یا شبیه‌ساز"],["۲","خودت پاسخ بده","بدون دیدن جواب"],["۳","اشتباهات را مرور کن","برای یادگیری ماندگار"]]
    },
    dictionary: {
      label: "TECHNICAL DICTIONARY", title: "واژه درست را سریع پیدا کن",
      description: "جست‌وجو را به فارسی یا انگلیسی انجام بده و با فیلتر تخصص، نتیجه‌ها را محدود کن.",
      icon: "Aa", tone: "orange", note: "راهنمای جست‌وجو",
      noteText: "نام قطعه، مخفف، اصطلاح دیاگ یا معنی فارسی را وارد کن.",
      links: [["⌕","جست‌وجوی واژه","searchInput"],["▦","فیلتر تخصص","filters"],["↗","تمرین واژه‌ها","smartReview"]],
      steps: [["۱","واژه را جست‌وجو کن","فارسی یا انگلیسی"],["۲","تخصص را فیلتر کن","نتیجه‌های مرتبط‌تر"],["۳","مثال را بخوان","کاربرد در جمله فنی"]]
    },
    progress: {
      label: "MY LEARNING JOURNEY", title: "مسیر پیشرفتت را دنبال کن",
      description: "آمار این صفحه از فعالیت‌های ثبت‌شده در همین دستگاه ساخته می‌شود؛ نتیجه یا پیشرفت ساختگی نمایش داده نمی‌شود.",
      icon: "◷", tone: "gold", note: "قدم بعدی",
      noteText: "موارد نیازمند مرور را ببین و دوباره در تمرین‌ها شرکت کن.",
      links: [["۱","گزارش پیشرفت","myProgress"],["۲","مرور هوشمند","smartReview"],["۳","واژه‌نامه","dictionary"]],
      steps: [["۱","آمار را بررسی کن","واژه‌ها و آزمون‌ها"],["۲","اشتباهات را پیدا کن","پاسخ‌های نیازمند تمرین"],["۳","به تمرین برگرد","و دوباره پیشرفت کن"]]
    }
  };
  const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function addIntro(key) {
    const host=pane(key), spec=pages[key];
    if(!host||!spec||host.querySelector(".page-intro")) return;
    const intro=document.createElement("section");
    intro.className="page-intro intro-"+spec.tone;
    intro.setAttribute("aria-label",spec.title);
    intro.innerHTML=
      '<div class="page-intro-main"><div class="page-intro-copy"><span class="page-intro-label">'+spec.label+'</span><h1>'+spec.title+'</h1><p>'+spec.description+'</p></div><div class="page-intro-symbol" aria-hidden="true">'+spec.icon+'</div></div>'+
      '<div class="page-route">'+spec.steps.map(x=>'<div class="route-step"><span>'+x[0]+'</span><div><b>'+x[1]+'</b><small>'+x[2]+'</small></div></div>').join("")+'</div>'+
      '<div class="page-intro-bottom"><div class="page-intro-note"><b>'+spec.note+'</b><span>'+spec.noteText+'</span></div><nav class="page-shortcuts" aria-label="میان‌برهای این بخش">'+
      spec.links.map(x=>'<button type="button" class="page-shortcut" data-go-page="'+key+'" data-go-target="'+x[2]+'"><span>'+x[0]+'</span><b>'+x[1]+'</b><i>←</i></button>').join("")+
      '</nav></div>';
    host.insertBefore(intro,host.firstChild);
  }
  Object.keys(pages).forEach(addIntro);

  // Turn the long course page into three clearly separated learning destinations.
  const learn=pane("learn");
  if(learn && !learn.querySelector(".learn-workspace")) {
    const ids=["paths","pathDetail","placement","technicalAcademy"];
    const nodes=ids.map(id=>section(id)).filter(Boolean);
    const workspace=document.createElement("div");
    workspace.className="learn-workspace";
    const nav=document.createElement("nav");
    nav.className="learn-tabs";
    nav.setAttribute("aria-label","بخش‌های آموزش");
    nav.innerHTML=
      '<button type="button" class="learn-tab active" data-learn-tab="paths"><span>01</span><b>مسیرهای یادگیری</b><small>انتخاب تخصص و درس‌ها</small></button>'+
      '<button type="button" class="learn-tab" data-learn-tab="placement"><span>02</span><b>تعیین سطح</b><small>آزمون شروع پیشنهادی</small></button>'+
      '<button type="button" class="learn-tab" data-learn-tab="academy"><span>03</span><b>آکادمی فنی</b><small>آموزش سیستم‌های خودرو</small></button>';
    workspace.appendChild(nav);
    const makePanel=(key,label)=>{
      const p=document.createElement("div");
      p.className="learn-panel";
      p.dataset.learnPanel=key;
      p.setAttribute("aria-label",label);
      workspace.appendChild(p);
      return p;
    };
    const pathsPanel=makePanel("paths","مسیرهای یادگیری");
    const levelPanel=makePanel("placement","تعیین سطح");
    const academyPanel=makePanel("academy","آکادمی فنی");
    [section("paths"),section("pathDetail")].filter(Boolean).forEach(n=>pathsPanel.appendChild(n));
    if(section("placement")) levelPanel.appendChild(section("placement"));
    if(section("technicalAcademy")) academyPanel.appendChild(section("technicalAcademy"));
    // Insert the tabbed workspace immediately after the page introduction.
    const intro=learn.querySelector(".page-intro");
    if(intro) intro.after(workspace); else learn.insertBefore(workspace,learn.firstChild);
    function setTab(key,scroll=false) {
      const valid=["paths","placement","academy"].includes(key)?key:"paths";
      workspace.querySelectorAll(".learn-tab").forEach(b=>{
        const active=b.dataset.learnTab===valid;
        b.classList.toggle("active",active);
        b.setAttribute("aria-selected",String(active));
      });
      workspace.querySelectorAll(".learn-panel").forEach(p=>{p.hidden=p.dataset.learnPanel!==valid;});
      if(scroll) nav.scrollIntoView({behavior:"smooth",block:"start"});
    }
    nav.addEventListener("click",e=>{
      const b=e.target.closest("[data-learn-tab]");
      if(b)setTab(b.dataset.learnTab);
    });
    workspace.addEventListener("autonex:select-tab",e=>setTab(e.detail));
    setTab("paths");
  }

  const accentMap={paths:"violet",pathDetail:"violet",placement:"green",technicalAcademy:"blue",learningLab:"cyan",smartReview:"pink",dictionary:"orange",myProgress:"gold"};
  Object.keys(accentMap).forEach(id=>{
    const node=section(id);
    if(node)node.classList.add("autonex-section","accent-"+accentMap[id]);
  });
  function goTo(page,target) {
    const nav=app.querySelector('.side-link[data-page="'+page+'"]');
    if(nav)nav.click();
    if(page==="learn" && ["paths","placement","technicalAcademy","pathDetail"].includes(target)) {
      const key=target==="placement"?"placement":target==="technicalAcademy"?"academy":"paths";
      const workspace=learn?.querySelector(".learn-workspace");
      if(workspace)workspace.dispatchEvent(new CustomEvent("autonex:select-tab",{detail:key}));
    }
    if(!target)return;
    window.setTimeout(()=>{
      const el=section(target);
      if(!el)return;
      el.scrollIntoView({behavior:"smooth",block:target==="searchInput"?"center":"start"});
      if(target==="searchInput")el.focus({preventScroll:true});
    },120);
  }
  app.addEventListener("click",e=>{
    const b=e.target.closest("[data-go-page]");
    if(!b)return;
    e.preventDefault();
    goTo(b.dataset.goPage,b.dataset.goTarget);
  });
  const search=section("searchInput");
  if(search)search.setAttribute("aria-label","جست‌وجوی واژه فارسی یا انگلیسی");
  const filters=section("filters");
  if(filters)filters.setAttribute("aria-label","فیلتر بر اساس تخصص خودرو");
  const grid=section("termGrid");
  if(grid)grid.setAttribute("aria-live","polite");
  app.querySelectorAll(".app-page").forEach(host=>{
    host.setAttribute("role","region");
    host.setAttribute("aria-label",host.dataset.pane||"بخش آکادمی");
  });
})();