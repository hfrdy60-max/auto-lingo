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
  <div class="home-welcome home-welcome-compact"><div class="home-welcome-copy">
   <div class="home-kicker"><span></span> AUTONEX • AUTOMOTIVE ACADEMY</div><div class="home-greeting">آکادمی دانش و زبان خودرو</div>
   <h1>هوشمند یاد بگیر؛<br><em>حرفه‌ای عیب‌یابی کن.</em></h1>
   <p>آموزش زبان فنی، برق خودرو، ECU و دستگاه‌های دیاگ؛ همه در یک مسیر منظم.</p>
   <div class="home-cta-row"><button class="home-cta primary" data-page="learn" data-scroll="paths">شروع یادگیری <span>←</span></button><button class="home-cta secondary" data-page="dictionary">واژه‌نامه <span>⌕</span></button></div>
  </div><div class="home-mini-art" aria-hidden="true"><span>AN</span><b>AUTONEX</b><small>LEARN • ANALYZE • MASTER</small><i>ϟ</i></div></div>
  <div class="home-section-heading compact-heading"><div><span class="home-overline">LEARNING OVERVIEW</span><h2>نمای کلی آکادمی</h2></div><span class="home-live-badge"><i></i> آمار محتوا</span></div>
  <div class="home-stats" id="homeStats">
   <article class="home-stat"><span class="stat-icon purple">▤</span><div><b id="statPaths">—</b><small>مسیر آموزشی</small></div></article>
   <article class="home-stat"><span class="stat-icon blue">Aa</span><div><b id="statWords">—</b><small>واژه و اصطلاح</small></div></article>
   <article class="home-stat"><span class="stat-icon green">▣</span><div><b id="statLessons">—</b><small>درس آموزشی</small></div></article>
   <article class="home-stat"><span class="stat-icon orange">✓</span><div><b id="statCompleted">۰</b><small>واژه تکمیل‌شده</small></div></article>
  </div>
  <div class="home-section-heading quick-heading compact-heading"><div><span class="home-overline">EXPLORE AUTONEX</span><h2>بخش‌های تخصصی</h2></div><span class="home-section-note">۶ حوزه اصلی</span></div>
  <div class="quick-menu-grid quick-menu-compact">
   <button class="quick-card violet" data-page="learn" data-scroll="paths"><span class="quick-icon">▣</span><b>مسیرهای آموزشی</b><small>درس‌های مرحله‌ای</small></button>
   <button class="quick-card blue" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">ϟ</span><b>برق خودرو و ECU</b><small>مدارها، کنترلرها و سنسورها</small></button>
   <button class="quick-card green" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">⌗</span><b>دیاگ و نقشه‌خوانی</b><small>منوها، توابع و نقشه‌ها</small></button>
   <button class="quick-card orange" data-page="dictionary"><span class="quick-icon">Aa</span><b>واژه‌نامه فنی</b><small>اصطلاحات فارسی و انگلیسی</small></button>
   <button class="quick-card pink" data-page="practice"><span class="quick-icon">✧</span><b>تمرین و سناریوها</b><small>آزمون و عیب‌یابی آموزشی</small></button>
   <button class="quick-card gold" data-page="progress"><span class="quick-icon">▥</span><b>کارنامه و مرور</b><small>پیشرفت و اشتباهات من</small></button>
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