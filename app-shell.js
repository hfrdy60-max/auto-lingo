(() => {
 const main=document.querySelector('main');
 const header=document.querySelector('.topbar');
 const footer=document.querySelector('footer');
 const hero=document.querySelector('.hero');
 const sections={
  guide:document.getElementById('guide'),
  placement:document.getElementById('placement'),
  paths:document.getElementById('paths'),
  detail:document.getElementById('pathDetail'),
  progress:document.getElementById('myProgress'),
  academy:document.getElementById('technicalAcademy'),
  curriculum:document.getElementById('structuredLessons'),
  lab:document.getElementById('learningLab'),
  review:document.getElementById('smartReview'),
  dictionary:document.getElementById('dictionary'),
  how:document.getElementById('how')
 };
 const panes={
  home:[hero,sections.guide],
  learn:[sections.placement,sections.paths,sections.detail,sections.curriculum,sections.academy],
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
  <button class="side-link" data-page="dictionary"><i>⌕</i><span>واژه‌نامه</span></button>
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
 const names={home:'خانه',learn:'دوره‌های آموزشی',dictionary:'واژه‌نامه',practice:'تمرین و آزمون',progress:'کارنامه من'};
 Object.entries(panes).forEach(([key,nodes])=>{
  const pane=document.createElement('div');pane.className='app-page';pane.dataset.pane=key;
  nodes.forEach(node=>{if(node) pane.appendChild(node)});
  content.appendChild(pane);
 });
 if(footer)footer.remove();
 const show=key=>{
  Object.entries(panes).forEach(([name])=>content.querySelector('[data-pane="'+name+'"]').classList.toggle('active',name===key));
  app.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===key));
  title.textContent=names[key];app.classList.remove('sidebar-open');
  content.scrollTop=0;window.scrollTo({top:0,behavior:'smooth'});
  history.replaceState(null,'','#'+key);
 };
 app.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.page)));
 app.querySelector('#sidebarToggle').addEventListener('click',()=>app.classList.toggle('sidebar-open'));
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