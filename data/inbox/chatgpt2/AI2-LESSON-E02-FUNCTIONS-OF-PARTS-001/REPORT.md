# AI2-LESSON-E02-FUNCTIONS-OF-PARTS-001 — Research & Authoring Report

## نتیجه
بستهٔ محتوایی E02 با عنوان **What Does It Do? Functions of Parts — این قطعه چه کاری می‌کند؟** در شاخهٔ مستقل تهیه شد.

- Lesson ID: `E02`
- Level: `LVL-2`
- Blueprint order: `2` (چهاردهمین مورد در ترتیب آرایهٔ canonical مخزن)
- Status: `needs_review`
- Branch: `ai2-lesson-e02-functions-of-parts-001`

## انطباق با blueprint
- تمرکز زبانی: Present simple for functions (3rd person -s)
- مهارت‌ها: vocabulary, reading, translation_fa_to_en, sentence_writing, part_recognition
- featured_part_ids: هر شش شناسه عیناً حفظ شده‌اند.
- game_ids: GAME-14, GAME-07, GAME-04, GAME-06
- quiz: ده سؤال با توزیع QZ-E02
- مدت: 27 دقیقه؛ mastery threshold: 70%

## یافته‌های بانک داده و شناسه‌ها
1. ترتیب آرایهٔ `lesson_blueprints.json` نشان می‌دهد مورد سیزدهم E01 و مورد چهاردهم E02 است؛ E02 در LVL-2 دارای order=2 است. شناسه حدس زده نشده است.
2. چهار تطبیق دقیق در crosswalk فعلی وجود دارد، اما همه needs_review هستند:
   - PRT-COL-001 → PART-000014 (Radiator)
   - PRT-COL-002 → PART-000015 (Water Pump)
   - PRT-LUB-002 → PART-000017 (Oil Pump)
   - PRT-FUE-002 → PART-000004 (Fuel Pump)
3. برای PRT-ELE-002 (Alternator) و PRT-ELE-003 (Starter motor)، crosswalk مقدار canonical_part_id=null دارد. شناسهٔ PART جدید ساخته نشده است.
4. `terms_batch_01.json` فقط 41 اصطلاح دارد و هیچ اصطلاحی برای دسته‌های query شدهٔ cooling/electrical/fuel/lubrication یا lesson_id=E02 در دسترس نیست. خود رکوردهای اصطلاح نیز فیلدهای level_id و lesson_id ندارند. بنابراین شرط target_new_terms=10 از بانک اصلی قابل تأمین/اثبات نیست. ده واژهٔ عملکردی در lesson صرفاً candidate آموزشی با term_id=null هستند و نباید canonical تلقی شوند.

## محتوا و ارزیابی
- توضیح عملکرد شش قطعه، Reading دوزبانه، قواعد حال ساده و سوم‌شخص مفرد، مثال‌ها و تمرین‌های هدایت‌شده اضافه شده‌اند.
- ده سؤال مطابق QZ-E02 نوشته شده است.
- سؤال listening متن پیشنهادی دارد ولی audio_asset=null و audio_status=pending_recording است.
- سؤال image_part_id تصویر ندارد؛ image_asset=null و تا تهیه و تأیید مجوز قابل انتشار نیست.
- هیچ تصویر یا صدای تولیدشده با AI ارائه نشده است.

## منابع
هشت منبع candidate در `sources.json` ثبت شده‌اند: HELLA، Astemo، ISO، Bosch Mobility، MAHLE، DENSO و British Council. هر ادعای فنی/دستوری به source ID متصل شده است. هیچ منبعی verified اعلام نشده است.

## محدودیت‌ها و درخواست QA از AI-1
- لطفاً loader/schema را با ساختار lesson.json بررسی کنید.
- crosswalk دو قطعهٔ Alternator و Starter motor را بررسی و در صورت لزوم mapping canonical را در مسیر مستقل تأیید کنید.
- برای query واژگان E02، بانک اصلی باید اصطلاحات مناسب و رابطهٔ lesson/category را فراهم کند؛ در حال حاضر 10 اصطلاح هدف قابل بازیابی نیست.
- برای تکمیل QZ-E02، فایل صوتی واقعی و تصویر واقعی با مجوز روشن لازم است.
- وابستگی‌های GAME-14/07/04/06 باید از نظر اجرایی بررسی شوند.

## مرز تغییرات
فقط سه فایل در مسیر inbox شاخهٔ مستقل AI-2 ایجاد شده‌اند. هیچ فایل اصلی، blueprint، term database، parts database، crosswalk، quiz_bank، frontend، SQL، migration، دادهٔ production، canonical ID، verification status یا release state تغییر نکرده است.
