# AI2-LESSON-B12-BEGINNER-REVIEW-CHECKPOINT-001

## نتیجه
بستهٔ مرور B12 تهیه شد و با blueprint و قالب آزمون موجود تطبیق داده شد.

- Lesson: B12 — Beginner Review and Checkpoint
- Level: LVL-1
- نوع: review_checkpoint (نه درس واژگان جدید)
- وضعیت: needs_review؛ بستهٔ authoring مستقل، نه verified/released
- زمان: 45 دقیقه
- آزمون: 16 سؤال؛ توزیع دقیق مطابق QZ-B12؛ حدنصاب پیشنهادی 70٪
- واژگان جدید: صفر؛ هیچ TERM ID یا رکورد canonical جدید ساخته نشد.

## تصمیم‌های انطباق با blueprint
- حفظ شد: skills، DLG-001، GAME-14/07/13/10، QZ-B12، زمان، حدنصاب و چرخه مرور 3/7/21/60 روز.
- هیچ featured_part_id یا dialogue_id جدیدی جعل نشد.
- 16 سؤال تألیفی در lesson.json قرار گرفتند؛ quiz_bank.json دست‌نخورده است.

## محدودیت پوشش مهم
این نسخه را نمی‌توان صادقانه «مرور جامع کل LVL-1» نامید: داده‌های قابل دسترس برای این مأموریت، بسته‌های مستقل و مستند B09 تا B11 و مکالمه DLG-001 را فراهم کردند، اما نگاشت قابل اتکای محتوای B01 تا B08 به واژگان/سؤال‌های سطح در دسترس نبود. بنابراین checkpoint فعلی یک نسخهٔ محدود و قابل بازبینی است. برای تکمیل واقعی، AI-1 باید نگاشت محتوا و اصطلاحات B01–B08 و سطح LVL-1 را ارائه کند.

## کنترل وابستگی‌ها
- QZ-B12: تعداد و توزیع 16 سؤال با template تطبیق داده شد؛ سؤال‌ها هنوز به quiz_bank.json ادغام نشده‌اند.
- Listening: دو transcript آماده است، اما audio asset وجود ندارد؛ هر دو pending_tts_generation هستند.
- DLG-001: مکالمه در فایل اصلی وجود دارد، اما audio_asset همه turnها null است.
- GAME-14: به main_term_database وابسته است.
- GAME-07: به parts_image_manifest و crosswalk نیاز دارد.
- GAME-13: به audio set نیاز دارد.
- GAME-10: به سناریوی شاخه‌ای و گزینه‌های امتیازدار نیاز دارد.
  شناسه بازی در blueprint به معنی آماده‌بودن/آزمایش‌شدن اجرای آن نیست.

## منابع و اعتبار
منابع در sources.json ثبت شده‌اند و همگی candidate/unverified باقی می‌مانند. منابع فنی فقط ادعاهای عمومی محدود را پشتیبانی می‌کنند؛ مشخصات، نوع سیال، مقادیر یا روش سرویس خودرو-خاص ارائه نشده است.

## تغییرات مخزن
فقط سه فایل مستقل در مسیر inbox شاخهٔ AI-2 ایجاد می‌شوند: REPORT.md، lesson.json و sources.json. هیچ فایل اصلی، blueprint، quiz bank، term database، dialogue، game، frontend، SQL، status یا canonical selection تغییر نمی‌کند.

## درخواست از AI-1
1. schema/loader سازگار با checkpoint و ساختار 16 سؤال را بررسی کند.
2. پوشش B01–B08 و نگاشت اصطلاحات LVL-1 را ارائه/تأیید کند تا مرور جامع تکمیل شود.
3. تکلیف تولید صوت و وابستگی بازی‌ها را مشخص کند.
4. هر mismatch را در Issue #1 اعلام کند.
