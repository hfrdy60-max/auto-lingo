(() => {
 const main=document.querySelector('main');
 const header=document.querySelector('.topbar');
 const footer=document.querySelector('footer');
 const sections={
  guide:document.getElementById('guide'),placement:document.getElementById('placement'),
  paths:document.getElementById('paths'),detail:document.getElementById('pathDetail'),
  progress:document.getElementById('myProgress'),academy:document.getElementById('technicalAcademy'),
  lab:document.getElementById('learningLab'),review:document.getElementById('smartReview'),
  dictionary:document.getElementById('dictionary')
 };
 const panes={
  home:[sections.guide],
  learn:[sections.placement,sections.paths,sections.detail,sections.academy],
  practice:[sections.lab,sections.review],
  dictionary:[sections.dictionary],
  progress:[sections.progress]
 };
 const app=document.createElement('div');app.className='app-shell';
 app.innerHTML=`<aside class="app-sidebar">
  <div class="sidebar-brand"><span class="brand-mark">AN<span>✦</span></span><div><b>AUTONEX</b><small>آکادمی دانش و زبان خودرو</small></div></div>
  <div class="sidebar-caption">فضای یادگیری</div>
  <button class="side-link active" data-page="home"><i>⌂</i><span>خانه</span></button>
  <button class="side-link" data-page="learn"><i>▤</i><span>دوره‌های آموزشی</span></button>
  <button class="side-link" data-page="dictionary"><i>Aa</i><span>واژه‌نامه تخصصی</span></button>
  <button class="side-link" data-page="practice"><i>✧</i><span>تمرین و آزمون</span></button>
  <button class="side-link" data-page="progress"><i>◷</i><span>کارنامه من</span></button>
  <div class="sidebar-bottom"><span class="status-dot"></span><span>محیط آموزشی شخصی</span><small>نسخه اولیه</small></div>
 </aside>
 <section class="app-main"><div class="app-topline"><button id="sidebarToggle" aria-label="باز کردن منو">☰</button><div><small>YOUR AUTOMOTIVE LEARNING HUB</small><b id="pageTitle">خانه</b></div><span class="topline-tag">AUTONEX <i>●</i></span></div>
 <div class="app-content" id="appContent"></div></section>
 <nav class="mobile-dock">
  <button class="active" data-page="home"><i>⌂</i><span>خانه</span></button>
  <button data-page="learn"><i>▤</i><span>دوره‌ها</span></button>
  <button data-page="dictionary"><i>Aa</i><span>واژه‌ها</span></button>
  <button data-page="practice"><i>✧</i><span>تمرین</span></button>
  <button data-page="progress"><i>◷</i><span>کارنامه</span></button>
 </nav>`;
 if(header)header.replaceWith(document.createComment('Legacy header replaced by AUTONEX app navigation'));
 main.parentNode.insertBefore(app,main);
 const content=app.querySelector('#appContent');
 const title=app.querySelector('#pageTitle');
 const names={home:'خانه',learn:'دوره‌های آموزشی',dictionary:'واژه‌نامه تخصصی',practice:'تمرین و آزمون',progress:'کارنامه من'};
 const home=document.createElement('section');
 home.className='autonex-home';
 home.innerHTML=`
  <div class="home-welcome">
   <div class="home-welcome-copy">
    <div class="home-kicker"><span></span> AUTONEX • AUTOMOTIVE KNOWLEDGE ACADEMY</div>
    <div class="home-greeting">به دنیای تخصصی خودرو خوش آمدی</div>
    <h1>دانش فنی را یاد بگیر؛<br><em>هوشمندانه‌تر عیب‌یابی کن.</em></h1>
    <p>از زبان تخصصی و برق خودرو تا ECU، سنسورها، نقشه‌خوانی و دستگاه‌های دیاگ؛ مسیر یادگیری‌ات را یک‌جا و مرحله‌به‌مرحله دنبال کن.</p>
    <div class="home-cta-row">
     <button class="home-cta primary" data-page="learn" data-scroll="paths">شروع یادگیری <span>←</span></button>
     <button class="home-cta secondary" data-page="dictionary">جست‌وجوی اصطلاحات <span>⌕</span></button>
    </div>
    <div class="home-trust-line"><span>✓</span> آموزش فارسی همراه با اصطلاحات استاندارد انگلیسی</div>
   </div>
   <div class="home-art" aria-hidden="true">
    <div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div>
    <div class="art-core"><span class="art-core-mark">AN</span><b>AUTONEX</b><small>LEARN • ANALYZE • MASTER</small></div>
    <div class="art-chip chip-top"><i>ϟ</i><span><b>ECU</b><small>کنترل الکترونیکی</small></span></div>
    <div class="art-chip chip-side"><i>⌁</i><span><b>LIVE DATA</b><small>داده‌های زنده</small></span></div>
    <div class="art-chip chip-bottom"><i>▦</i><span><b>DIAGNOSTICS</b><small>تحلیل و عیب‌یابی</small></span></div>
    <div class="art-spark spark-a">✦</div><div class="art-spark spark-b">+</div>
   </div>
  </div>
  <div class="home-section-heading"><div><span class="home-overline">YOUR LEARNING OVERVIEW</span><h2>نمای کلی یادگیری</h2><p>آمار محتوای آموزشی و پیشرفت ثبت‌شده روی همین دستگاه</p></div><span class="home-live-badge"><i></i> به‌روز‌رسانی خودکار</span></div>
  <div class="home-stats" id="homeStats">
   <article class="home-stat"><span class="stat-icon purple">▤</span><div><b id="statPaths">—</b><small>مسیر آموزشی</small></div><em>مسیرها</em></article>
   <article class="home-stat"><span class="stat-icon blue">Aa</span><div><b id="statWords">—</b><small>واژه و اصطلاح</small></div><em>واژه‌نامه</em></article>
   <article class="home-stat"><span class="stat-icon green">▣</span><div><b id="statLessons">—</b><small>درس آموزشی</small></div><em>درس‌ها</em></article>
   <article class="home-stat"><span class="stat-icon purple">✓</span><div><b id="statCompleted">۰</b><small>واژه تکمیل‌شده</small></div><em>پیشرفت</em></article>
  </div>
  <div class="home-section-heading quick-heading"><div><span class="home-overline">EXPLORE THE ACADEMY</span><h2>دسترسی سریع به بخش‌ها</h2><p>مستقیم وارد موضوع موردنظرت شو.</p></div><span class="home-section-note">۱۲ بخش تخصصی</span></div>
  <div class="quick-menu-grid">
   <button class="quick-card violet" data-page="learn" data-scroll="paths"><span class="quick-icon">▣</span><b>مسیرهای آموزشی</b><small>درس‌های مرحله‌ای تخصصی</small></button>
   <button class="quick-card blue" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">ϟ</span><b>برق خودرو و ECU</b><small>مدارها و واحدهای کنترل</small></button>
   <button class="quick-card green" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">⌁</span><b>سنسورها و عملگرها</b><small>عملکرد و تحلیل سیگنال</small></button>
   <button class="quick-card violet" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">▤</span><b>دستگاه‌های دیاگ</b><small>منوها و توابع تخصصی</small></button>
   <button class="quick-card blue" data-page="dictionary"><span class="quick-icon">Aa</span><b>واژه‌نامه فنی</b><small>جست‌وجوی فارسی و انگلیسی</small></button>
   <button class="quick-card green" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">⌗</span><b>نقشه‌خوانی برق</b><small>علائم و مدارها</small></button>
   <button class="quick-card violet" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">⚠</span><b>کدهای خطا</b><small>مفهوم و بررسی DTC</small></button>
   <button class="quick-card blue" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">◉</span><b>پارامترهای لایودیتا</b><small>خواندن داده‌های زنده</small></button>
   <button class="quick-card green" data-page="practice" data-scroll="learningLab"><span class="quick-icon">▷</span><b>سناریوهای عیب‌یابی</b><small>تمرین تحلیل مرحله‌ای</small></button>
   <button class="quick-card violet" data-page="practice"><span class="quick-icon">✓</span><b>آزمون و تمرین</b><small>سنجش آموخته‌ها</small></button>
   <button class="quick-card blue" data-page="practice" data-scroll="smartReview"><span class="quick-icon">↻</span><b>مرور هوشمند</b><small>مرور واژه‌های دشوار</small></button>
   <button class="quick-card green" data-page="progress"><span class="quick-icon">▥</span><b>گزارش پیشرفت</b><small>کارنامه و اشتباهات من</small></button>
  </div>
  <div class="home-bottom-grid">
   <article class="home-note-card">
    <span class="home-note-icon">✦</span><div><span class="home-overline">LEARNING TIP</span><h3>یادگیری عمیق، نه حفظ کردن</h3><p>هر اصطلاح را همراه با عملکرد قطعه، مدار مرتبط و کاربرد آن در عیب‌یابی یاد بگیر. این روش کمک می‌کند دانش فنی را در موقعیت واقعی به‌کار ببری.</p></div>
    <button data-page="learn" data-scroll="technicalAcademy">مشاهده آموزش فنی <b>←</b></button>
   </article>
   <article class="home-focus-card">
    <span class="home-overline">CORE SPECIALTIES</span><h3>محورهای اصلی آکادمی</h3>
    <div class="focus-tags"><span>برق خودرو</span><span>ECU</span><span>سنسورها</span><span>دیاگ</span><span>نقشه‌خوانی</span><span>زبان فنی</span></div>
    <small>محتوا بر اساس ساختار تخصصی و منابع قابل ردیابی توسعه پیدا می‌کند.</small>
   </article>
  </div>`;
 Object.entries(panes).forEach(([key,nodes])=>{
  const pane=document.createElement('div');pane.className='app-page';pane.dataset.pane=key;
  if(key==='home')pane.appendChild(home);
  nodes.forEach(node=>{if(node)pane.appendChild(node)});
  content.appendChild(pane);
 });
 if(footer)footer.remove();
 if(main)main.remove();
 const fa=n=>String(n).replace(/[0-9]/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
 const updateHomeStats=()=>{
  try{
   const pathList=typeof paths!=="undefined"&&Array.isArray(paths)?paths:[];
   const wordList=typeof allTerms!=="undefined"&&Array.isArray(allTerms)?allTerms:[];
   const lessonTotal=pathList.reduce((sum,p)=>sum+(Array.isArray(p.lessons)?p.lessons.length:0),0);
   const done=typeof completed!=="undefined"?Object.values(completed).filter(Boolean).length:0;
   const set=(id,value)=>{const el=home.querySelector('#'+id);if(el)el.textContent=fa(value)};
   set('statPaths',pathList.length);set('statWords',wordList.length);set('statLessons',lessonTotal);set('statCompleted',done);
  }catch(error){console.warn('AUTONEX home stats unavailable',error)}
 };
 const show=key=>{
  Object.keys(panes).forEach(name=>content.querySelector('[data-pane="'+name+'"]').classList.toggle('active',name===key));
  app.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===key));
  title.textContent=names[key];app.classList.remove('sidebar-open');
  content.scrollTop=0;window.scrollTo({top:0,behavior:'smooth'});
  history.replaceState(null,'','#'+key);
  if(key==='home')updateHomeStats();
 };
 app.querySelectorAll('.side-link,.mobile-dock button').forEach(b=>b.addEventListener('click',()=>show(b.dataset.page)));
 app.querySelector('#sidebarToggle').addEventListener('click',()=>app.classList.toggle('sidebar-open'));
 app.querySelectorAll('[data-page]').forEach(card=>{
  if(card.classList.contains('side-link')||card.closest('.mobile-dock'))return;
  card.addEventListener('click',()=>{
   const page=card.dataset.page;if(!names[page])return;
   show(page);
   const target=card.dataset.scroll&&document.getElementById(card.dataset.scroll);
   if(target)setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'start'}),120);
  });
 });
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');if(!a)return;
  const href=a.getAttribute('href');
  if(href==='#paths'||href==='#placement'||href==='#technicalAcademy'){show('learn');}
  else if(href==='#dictionary'){show('dictionary')}
  else if(href==='#myProgress'){show('progress')}
  else if(href==='#guide'||href==='#homeLink'){show('home')}
 });
 document.getElementById('backPaths')?.addEventListener('click',()=>show('learn'));
 updateHomeStats();show('home');
})();