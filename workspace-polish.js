/* AUTONEX workspace polish: guided page headers, clear section order and in-app navigation */
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
      description: "از یک تخصص شروع کن، درس‌ها را مرحله‌به‌مرحله جلو ببر و بعد دانسته‌هایت را در آکادمی فنی عمیق‌تر کن.",
      icon: "▤",
      tone: "violet",
      note: "پیشنهاد شروع",
      noteText: "اول یک مسیر انتخاب کن؛ لازم نیست همه موضوع‌ها را هم‌زمان بخوانی.",
      links: [
        ["۰۱", "انتخاب مسیر", "paths", "learn"],
        ["۰۲", "تعیین سطح", "placement", "learn"],
        ["۰۳", "آکادمی فنی", "technicalAcademy", "learn"]
      ],
      steps: [
        ["۱", "یک تخصص انتخاب کن", "برق، ECU، دیاگ یا مکانیک"],
        ["۲", "درس‌ها را به‌ترتیب بخوان", "واژه، معنی، تلفظ و مثال"],
        ["۳", "یادگیری را تثبیت کن", "تمرین و آزمون را انجام بده"]
      ]
    },
    practice: {
      label: "PRACTICE STUDIO",
      title: "یادگیری را به مهارت تبدیل کن",
      description: "با سناریوهای آموزشی و شبیه‌سازهای مفهومی تمرین کن؛ سپس واژه‌هایی را که نیاز به تکرار دارند مرور کن.",
      icon: "✧",
      tone: "cyan",
      note: "روش پیشنهادی",
      noteText: "یک سناریو را کامل کن و در پایان مرور هوشمند را انجام بده.",
      links: [
        ["۰۱", "آزمایشگاه آموزشی", "learningLab", "practice"],
        ["۰۲", "مرور هوشمند", "smartReview", "practice"],
        ["۰۳", "دفترچه اشتباهات", "myProgress", "progress"]
      ],
      steps: [
        ["۱", "موضوع را انتخاب کن", "سناریو یا شبیه‌ساز"],
        ["۲", "خودت پاسخ بده", "بدون نگاه کردن به جواب"],
        ["۳", "اشتباهات را مرور کن", "برای یادگیری ماندگار"]
      ]
    },
    dictionary: {
      label: "TECHNICAL DICTIONARY",
      title: "واژه درست را سریع پیدا کن",
      description: "جست‌وجو را به فارسی یا انگلیسی انجام بده و با فیلتر تخصص، نتیجه‌ها را محدود کن.",
      icon: "Aa",
      tone: "orange",
      note: "راهنمای جست‌وجو",
      noteText: "نام قطعه، مخفف، اصطلاح دیاگ یا معنی فارسی را وارد کن.",
      links: [
        ["⌕", "جست‌وجوی واژه", "searchInput", "dictionary"],
        ["▦", "فیلتر تخصص", "filters", "dictionary"],
        ["↗", "تمرین واژه‌ها", "smartReview", "practice"]
      ],
      steps: [
        ["۱", "واژه را جست‌وجو کن", "فارسی یا انگلیسی"],
        ["۲", "دسته تخصصی را فیلتر کن", "نتیجه‌های مرتبط‌تر"],
        ["۳", "مثال را بخوان", "کاربرد در جمله فنی"]
      ]
    },
    progress: {
      label: "MY LEARNING JOURNEY",
      title: "مسیر پیشرفتت را دنبال کن",
      description: "آمار این صفحه از فعالیت‌های ثبت‌شده در همین دستگاه ساخته می‌شود؛ نتیجه یا پیشرفت ساختگی نمایش داده نمی‌شود.",
      icon: "◷",
      tone: "gold",
      note: "قدم بعدی",
      noteText: "موارد نیازمند مرور را ببین و دوباره در تمرین‌ها شرکت کن.",
      links: [
        ["۱", "گزارش پیشرفت", "myProgress", "progress"],
        ["۲", "مرور هوشمند", "smartReview", "practice"],
        ["۳", "واژه‌نامه", "dictionary", "dictionary"]
      ],
      steps: [
        ["۱", "آمار را بررسی کن", "واژه‌ها و آزمون‌ها"],
        ["۲", "اشتباهات را پیدا کن", "پاسخ‌های نیازمند تمرین"],
        ["۳", "به تمرین برگرد", "و دوباره پیشرفت کن"]
      ]
    }
  };

  // Put the learning sections in the order a new learner naturally follows.
  const learnPane = pane("learn");
  if (learnPane) {
    ["paths", "pathDetail", "placement", "technicalAcademy"].forEach(id => {
      const node = section(id);
      if (node) learnPane.appendChild(node);
    });
  }

  const accents = {
    paths: "violet",
    pathDetail: "violet",
    placement: "green",
    technicalAcademy: "blue",
    learningLab: "cyan",
    smartReview: "pink",
    dictionary: "orange",
    myProgress: "gold"
  };
  Object.keys(accents).forEach(id => {
    const node = section(id);
    if (node) node.classList.add("autonex-section", "accent-" + accents[id]);
  });

  function stepCards(items) {
    return items.map(item =>
      '<div class="route-step"><span>' + item[0] + '</span><div><b>' + item[1] + '</b><small>' + item[2] + '</small></div></div>'
    ).join("");
  }
  function linkCards(items) {
    return items.map(item =>
      '<button type="button" class="page-shortcut" data-go-page="' + item[3] + '" data-go-target="' + item[2] + '">' +
      '<span>' + item[0] + '</span><b>' + item[1] + '</b><i>←</i></button>'
    ).join("");
  }
  function addPageIntro(key) {
    const host = pane(key);
    const spec = pages[key];
    if (!host || !spec || host.querySelector(".page-intro")) return;
    const intro = document.createElement("section");
    intro.className = "page-intro intro-" + spec.tone;
    intro.setAttribute("aria-label", spec.title);
    intro.innerHTML =
      '<div class="page-intro-main">' +
        '<div class="page-intro-copy">' +
          '<span class="page-intro-label">' + spec.label + '</span>' +
          '<h1>' + spec.title + '</h1>' +
          '<p>' + spec.description + '</p>' +
        '</div>' +
        '<div class="page-intro-symbol" aria-hidden="true">' + spec.icon + '</div>' +
      '</div>' +
      '<div class="page-route">' + stepCards(spec.steps) + '</div>' +
      '<div class="page-intro-bottom"><div class="page-intro-note"><b>' + spec.note + '</b><span>' + spec.noteText + '</span></div>' +
      '<nav class="page-shortcuts" aria-label="میان‌برهای این بخش">' + linkCards(spec.links) + '</nav></div>';
    host.insertBefore(intro, host.firstChild);
  }

  Object.keys(pages).forEach(addPageIntro);

  function goTo(page, target) {
    const nav = app.querySelector('.side-link[data-page="' + page + '"]');
    if (nav) nav.click();
    if (!target) return;
    window.setTimeout(() => {
      const el = section(target);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: target === "searchInput" ? "center" : "start" });
      if (target === "searchInput") el.focus({ preventScroll: true });
    }, 100);
  }

  app.addEventListener("click", event => {
    const button = event.target.closest("[data-go-page]");
    if (!button) return;
    event.preventDefault();
    goTo(button.dataset.goPage, button.dataset.goTarget);
  });

  // Keep keyboard navigation and deep links useful after the sections are moved.
  app.querySelectorAll(".page-shortcut").forEach(button => {
    button.setAttribute("aria-label", button.textContent.trim().replace(/\s+/g, " "));
  });

  const search = section("searchInput");
  if (search) search.setAttribute("aria-label", "جست‌وجوی واژه فارسی یا انگلیسی");
  const filters = section("filters");
  if (filters) filters.setAttribute("aria-label", "فیلتر بر اساس تخصص خودرو");
  const termGrid = section("termGrid");
  if (termGrid) termGrid.setAttribute("aria-live", "polite");

  // The page is deliberately kept uncluttered on first entry.
  app.querySelectorAll(".app-page").forEach(host => {
    host.setAttribute("role", "region");
    host.setAttribute("aria-label", host.dataset.pane || "بخش آکادمی");
  });
})();