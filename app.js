const terms = [
 {en:"Engine",fa:"موتور",pron:"/ˈen.dʒɪn/",cat:"موتور",desc:"مجموعه‌ای که انرژی حاصل از احتراق سوخت را به نیروی مکانیکی تبدیل می‌کند.",example:"The engine is overheating."},
 {en:"Piston",fa:"پیستون",pron:"/ˈpɪs.tən/",cat:"موتور",desc:"قطعه‌ای متحرک درون سیلندر که فشار احتراق را دریافت می‌کند.",example:"The piston moves inside the cylinder."},
 {en:"Cylinder",fa:"سیلندر",pron:"/ˈsɪl.ɪn.dər/",cat:"موتور",desc:"محفظه‌ای که پیستون درون آن حرکت رفت‌وبرگشتی دارد.",example:"Check the cylinder compression."},
 {en:"Fuel Injector",fa:"انژکتور سوخت",pron:"/ˈfjuː.əl ɪnˈdʒek.tər/",cat:"سوخت‌رسانی",desc:"سوخت را با الگوی پاشش مشخص وارد مسیر ورودی یا محفظه احتراق می‌کند.",example:"The fuel injector may be clogged."},
 {en:"Fuel Pump",fa:"پمپ بنزین",pron:"/ˈfjuː.əl pʌmp/",cat:"سوخت‌رسانی",desc:"سوخت را با فشار و دبی موردنیاز به سیستم سوخت‌رسانی می‌رساند.",example:"Test the fuel pump pressure."},
 {en:"Oxygen Sensor",fa:"سنسور اکسیژن",pron:"/ˈɒk.sɪ.dʒən ˈsen.sər/",cat:"برق و سنسورها",desc:"میزان اکسیژن گازهای خروجی را اندازه‌گیری می‌کند تا ECU بتواند مخلوط سوخت و هوا را تنظیم کند.",example:"A faulty oxygen sensor can affect fuel economy."},
 {en:"Crankshaft Position Sensor",fa:"سنسور موقعیت میل‌لنگ",pron:"/ˈkræŋk.ʃɑːft pəˈzɪʃ.ən ˈsen.sər/",cat:"برق و سنسورها",desc:"موقعیت و سرعت چرخش میل‌لنگ را به واحد کنترل گزارش می‌دهد.",example:"The ECU needs the crankshaft position signal."},
 {en:"ECU",fa:"واحد کنترل الکترونیکی",pron:"/ˌiː.siːˈjuː/",cat:"دیاگ و ECU",desc:"واحد الکترونیکی که داده سنسورها را پردازش و عملگرها را کنترل می‌کند.",example:"The ECU stores diagnostic trouble codes."},
 {en:"Diagnostic Trouble Code",fa:"کد خطای عیب‌یابی",pron:"/ˌdaɪ.əɡˈnɒs.tɪk ˈtrʌb.əl kəʊd/",cat:"دیاگ و ECU",desc:"کدی که سیستم عیب‌یابی برای ثبت یک ایراد یا وضعیت غیرعادی ذخیره می‌کند.",example:"Read the diagnostic trouble code with a scan tool."},
 {en:"Wiring Diagram",fa:"نقشه سیم‌کشی",pron:"/ˈwaɪə.rɪŋ ˈdaɪ.ə.ɡræm/",cat:"برق و سنسورها",desc:"نمایش گرافیکی اتصالات الکتریکی، سیم‌ها، سوکت‌ها و اجزای مدار.",example:"Use the wiring diagram to trace the circuit."},
 {en:"Brake Pad",fa:"لنت ترمز",pron:"/breɪk pæd/",cat:"ترمز",desc:"با ایجاد اصطکاک روی دیسک یا کاسه، به کاهش سرعت خودرو کمک می‌کند.",example:"The brake pads need replacement."},
 {en:"Shock Absorber",fa:"کمک‌فنر",pron:"/ˈʃɒk əbˌzɔː.bər/",cat:"تعلیق",desc:"نوسان فنر و حرکت بدنه خودرو را کنترل می‌کند.",example:"A worn shock absorber can reduce stability."},
 {en:"Thermostat",fa:"ترموستات",pron:"/ˈθɜː.mə.stæt/",cat:"خنک‌کاری",desc:"جریان مایع خنک‌کننده به رادیاتور را بر اساس دما تنظیم می‌کند.",example:"The thermostat controls coolant flow."},
 {en:"Radiator",fa:"رادیاتور",pron:"/ˈreɪ.di.eɪ.tər/",cat:"خنک‌کاری",desc:"گرمای مایع خنک‌کننده را به هوای محیط منتقل می‌کند.",example:"Check the radiator for leaks."},
 {en:"Transmission",fa:"گیربکس",pron:"/trænzˈmɪʃ.ən/",cat:"گیربکس",desc:"نسبت انتقال نیرو و گشتاور موتور به چرخ‌ها را تغییر می‌دهد.",example:"The transmission shifts smoothly."}
];
const systems=[["🔧","موتور و احتراق","قطعات داخلی، تایمینگ، روغن‌کاری و تراکم"],["⛽","سوخت‌رسانی","پمپ، انژکتور، فشار سوخت و دریچه گاز"],["⚡","برق و سنسورها","مدارها، سنسورها، عملگرها و نقشه‌خوانی"],["🧠","ECU و دیاگ","کد خطا، داده زنده، پارامترها و عیب‌یابی"],["⚙️","گیربکس و انتقال قدرت","کلاچ، دنده‌ها، روغن و سیستم انتقال نیرو"],["🛑","ترمز و ABS","لنت، دیسک، پمپ ترمز و سیستم ضدقفل"],["🚘","تعلیق و فرمان","کمک‌فنر، فنر، سیبک و جلوبندی"],["❄️","تهویه مطبوع","کمپرسور، گاز مبرد و کنترل دما"],["🌡️","خنک‌کاری","رادیاتور، واترپمپ، ترموستات و فن"]];
const categories=["همه","موتور","سوخت‌رسانی","برق و سنسورها","دیاگ و ECU","ترمز","تعلیق","خنک‌کاری","گیربکس"];
let activeCategory="همه";
const faNum=n=>String(n).replace(/[0-9]/g,d=>"۰۱۲۳۴۵۶۷۸۹"[d]);
function renderTerms(){
 const q=document.getElementById("searchInput").value.trim().toLowerCase();
 const list=terms.filter(t=>(activeCategory==="همه"||t.cat===activeCategory)&&[t.en,t.fa,t.desc,t.cat].some(v=>v.toLowerCase().includes(q)));
 document.getElementById("termGrid").innerHTML=list.map(t=>`<article class="term-card"><span class="category">${t.cat}</span><div class="en">${t.en}</div><div class="pron">${t.pron}</div><h3>${t.fa}</h3><p>${t.desc}</p><div class="example">${t.example}</div></article>`).join("");
 document.getElementById("emptyState").classList.toggle("hidden",list.length>0);
}
function renderFilters(){document.getElementById("filters").innerHTML=categories.map(c=>`<button class="filter ${c===activeCategory?"active":""}" data-cat="${c}">${c}</button>`).join("");document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{activeCategory=b.dataset.cat;renderFilters();renderTerms()}))}
document.getElementById("searchInput").addEventListener("input",renderTerms);
document.getElementById("termCount").textContent=faNum(terms.length);
document.getElementById("systemGrid").innerHTML=systems.map(s=>`<article class="system-card"><span class="icon">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p></article>`).join("");
renderFilters();renderTerms();
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));
const questions=[{q:"معنی کلمه Engine چیست؟",a:["گیربکس","موتور","رادیاتور","ترمز"],correct:1,why:"Engine یعنی موتور؛ مجموعه تولیدکننده نیروی مکانیکی خودرو."},{q:"Oxygen Sensor چه چیزی را اندازه‌گیری می‌کند؟",a:["فشار روغن","سرعت چرخ","اکسیژن گازهای خروجی","دمای کابین"],correct:2,why:"سنسور اکسیژن میزان اکسیژن موجود در گازهای اگزوز را اندازه‌گیری می‌کند."},{q:"معنی Wiring Diagram چیست؟",a:["نقشه سیم‌کشی","کد خطا","فشار سوخت","نسبت تراکم"],correct:0,why:"Wiring Diagram یعنی نقشه سیم‌کشی مدار الکتریکی."}];
let qi=0,answered=false;
function showQuestion(){const q=questions[qi];answered=false;document.getElementById("question").textContent=q.q;document.getElementById("quizProgress").textContent=`سؤال ${faNum(qi+1)} از ${faNum(questions.length)}`;document.getElementById("quizFeedback").textContent="";document.getElementById("nextQuestion").classList.add("hidden");document.getElementById("options").innerHTML=q.a.map((a,i)=>`<button class="option" data-i="${i}">${a}</button>`).join("");document.querySelectorAll(".option").forEach(b=>b.addEventListener("click",()=>{if(answered)return;answered=true;const i=Number(b.dataset.i);document.querySelectorAll(".option").forEach((o,j)=>{o.disabled=true;if(j===q.correct)o.classList.add("correct")});if(i!==q.correct)b.classList.add("wrong");document.getElementById("quizFeedback").textContent=(i===q.correct?"آفرین! پاسخ درست است. ":"پاسخ درست نبود. ")+q.why;document.getElementById("nextQuestion").classList.remove("hidden");document.getElementById("nextQuestion").textContent=qi===questions.length-1?"شروع دوباره ↻":"سؤال بعدی ←"}))}
document.getElementById("nextQuestion").addEventListener("click",()=>{qi=(qi+1)%questions.length;showQuestion()});showQuestion();
