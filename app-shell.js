(() => {
 const main=document.querySelector('main');
 const header=document.querySelector('.topbar');
 const footer=document.querySelector('footer');
 const hero=document.querySelector('.hero');
 const sections={
  guide:document.getElementById('guide'),placement:document.getElementById('placement'),
  paths:document.getElementById('paths'),detail:document.getElementById('pathDetail'),
  progress:document.getElementById('myProgress'),academy:document.getElementById('technicalAcademy'),
  lab:document.getElementById('learningLab'),review:document.getElementById('smartReview'),
  dictionary:document.getElementById('dictionary'),how:document.getElementById('how')
 };
 const panes={
  home:[hero,sections.guide],
  learn:[sections.placement,sections.paths,sections.detail,sections.academy],
  practice:[sections.lab,sections.review],
  dictionary:[sections.dictionary],
  progress:[sections.progress]
 };
 const app=document.createElement('div');app.className='app-shell';
 app.innerHTML=`<aside class="app-sidebar">
  <div class="sidebar-brand"><span class="brand-mark">AL<span>✦</span></span><div><b>AUTO LINGO</b><small>آکادمی تخصصی خودرو</small></div></div>
  <div class="sidebar-caption">فضای یادگیری</div>
  <button class="side-link active" data-page="home"><i>⌂</i><span>خانه</span></button>
  <button class="side-link" data-page="learn"><i>▤</i><span>دوره‌های آموزشی</span></button>
  <button class="side-link" data-page="dictionary"><i>⌕</i><span>واژه‌نامه تخصصی</span></button>
  <button class="side-link" data-page="practice"><i>✧</i><span>تمرین و آزمون</span></button>
  <button class="side-link" data-page="progress"><i>◷</i><span>کارنامه من</span></button>
  <div class="sidebar-bottom"><span class="status-dot"></span><span>محیط آموزشی شخصی</span><small>نسخه اولیه</small></div>
 </aside>
 <section class="app-main"><div class="app-topline"><button id="sidebarToggle" aria-label="باز کردن منو">☰</button><div><small>YOUR LEARNING SPACE</small><b id="pageTitle">خانه</b></div><span class="topline-tag">AUTO LINGO <i>●</i></span></div>
 <div class="app-content" id="appContent"></div></section>
 <nav class="mobile-dock">
  <button class="active" data-page="home"><i>⌂</i><span>خانه</span></button>
  <button data-page="learn"><i>▤</i><span>دوره‌ها</span></button>
  <button data-page="dictionary"><i>⌕</i><span>واژه‌ها</span></button>
  <button data-page="practice"><i>✧</i><span>تمرین</span></button>
  <button data-page="progress"><i>◷</i><span>کارنامه</span></button>
 </nav>`;
 header.replaceWith(document.createComment('Legacy header replaced by app navigation'));
 main.parentNode.insertBefore(app,main);
 const content=app.querySelector('#appContent');
 const title=app.querySelector('#pageTitle');
 const names={home:'خانه',learn:'دوره‌های آموزشی',dictionary:'واژه‌نامه تخصصی',practice:'تمرین و آزمون',progress:'کارنامه من'};
 Object.entries(panes).forEach(([key,nodes])=>{
  const pane=document.createElement('div');pane.className='app-page';pane.dataset.pane=key;
  nodes.forEach(node=>{if(node)pane.appendChild(node)});
  if(key==='home'){
   const quick=document.createElement('section');quick.className='quick-menu';
   quick.innerHTML=`<div class="quick-menu-heading"><div><span class="eyebrow">AUTO LINGO • QUICK ACCESS</span><h2>از کجا شروع کنیم؟</h2><p>دسترسی سریع به بخش‌های اصلی آکادمی</p></div><span class="quick-menu-badge">مرکز یادگیری</span></div>
   <div class="quick-menu-grid">
    <button class="quick-card violet" data-page="learn" data-scroll="paths"><span class="quick-icon">▣</span><b>مسیرهای آموزشی</b><small>درس‌های مرحله‌ای تخصصی</small></button>
    <button class="quick-card blue" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">ϟ</span><b>برق خودرو و ECU</b><small>مدارها، کنترلرها و سیستم‌ها</small></button>
    <button class="quick-card green" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">⌁</span><b>سنسورها و عملگرها</b><small>شناخت و عملکرد قطعات</small></button>
    <button class="quick-card violet" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">▤</span><b>دستگاه‌های دیاگ</b><small>منوها و اصطلاحات تخصصی</small></button>
    <button class="quick-card blue" data-page="dictionary"><span class="quick-icon">Aa</span><b>واژه‌نامه فنی</b><small>جست‌وجوی فارسی و انگلیسی</small></button>
    <button class="quick-card green" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">⌗</span><b>نقشه‌خوانی برق</b><small>علائم و مسیرهای مدار</small></button>
    <button class="quick-card violet" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">⚠</span><b>کدهای خطا</b><small>شناخت و مفهوم DTC</small></button>
    <button class="quick-card blue" data-page="learn" data-scroll="technicalAcademy"><span class="quick-icon">◉</span><b>پارامترهای لایودیتا</b><small>خواندن داده‌های زنده</small></button>
    <button class="quick-card green" data-page="practice" data-scroll="learningLab"><span class="quick-icon">▷</span><b>سناریوهای عیب‌یابی</b><small>تمرین تحلیل مرحله‌ای</small></button>
    <button class="quick-card violet" data-page="practice"><span class="quick-icon">✓</span><b>آزمون و تمرین</b><small>سنجش آموخته‌ها</small></button>
    <button class="quick-card blue" data-page="practice" data-scroll="smartReview"><span class="quick-icon">↻</span><b>مرور هوشمند</b><small>مرور واژه‌های دشوار</small></button>
    <button class="quick-card green" data-page="progress"><span class="quick-icon">▥</span><b>گزارش پیشرفت</b><small>کارنامه و اشتباهات من</small></button>
   </div>`;
   pane.insertBefore(quick,pane.children[1]||null);
  }
  content.appendChild(pane);
 });
 const show=key=>{
  Object.keys(panes).forEach(name=>content.querySelector('[data-pane="'+name+'"]').classList.toggle('active',name===key));
  app.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===key));
  title.textContent=names[key];app.classList.remove('sidebar-open');
  content.scrollTop=0;window.scrollTo({top:0,behavior:'smooth'});
  history.replaceState(null,'','#'+key);
 };
 app.querySelectorAll('.side-link,.mobile-dock button').forEach(b=>b.addEventListener('click',()=>show(b.dataset.page)));
 app.querySelector('#sidebarToggle').addEventListener('click',()=>app.classList.toggle('sidebar-open'));
 app.querySelectorAll('.quick-card').forEach(card=>card.addEventListener('click',()=>{
  const page=card.dataset.page;show(page);
  const target=card.dataset.scroll&&document.getElementById(card.dataset.scroll);
  if(target)setTimeout(()=>target.scrollIntoView({behavior:'smooth',block:'start'}),100);
 }));
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]');if(!a)return;
  const href=a.getAttribute('href');
  if(href==='#paths'||href==='#placement'||href==='#technicalAcademy'){show('learn');}
  else if(href==='#dictionary'){show('dictionary')}
  else if(href==='#myProgress'){show('progress')}
  else if(href==='#guide'||href==='#homeLink'){show('home')}
 });
 document.getElementById('backPaths')?.addEventListener('click',()=>show('learn'));
 show('home');
})();