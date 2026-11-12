# AI2-LESSON-B11-TALKING-ABOUT-YOUR-CAR-001 — گزارش تحویل

## دامنه
تولید بستهٔ مستقل درس B11 فقط برای زبان فنی خودرو، مطابق blueprint موجود:
- عنوان: Talking About Your Car
- سطح/ترتیب: LVL-1 / 11
- دستور زبان: be و have؛ پاسخ کوتاه
- مهارت‌ها: واژگان، خواندن، شنیدن، مکالمهٔ تعمیرگاهی
- مدت: 25 دقیقه؛ آستانهٔ پیشنهادی mastery: 70%

## محتوای تولیدشده
- معرفی make، model، model year و body type.
- توصیف engine، transmission و fuel type.
- واژگان odometer، odometer reading و mileage.
- توضیح مرحله‌ای am/is/are و have/has.
- ساخت سؤال‌های Is it...? و Does it have...? و پاسخ‌های کوتاه.
- مکالمهٔ دوزبانه، متن خواندن، تمرین ترجمه و 8 سؤال مطابق توزیع QZ-B11.

## کنترل انطباق با پروژه
- featured_part_ids و dialogue_ids در blueprint خالی‌اند؛ هیچ شناسهٔ ساختگی اضافه نشده.
- بازی‌ها فقط به‌عنوان ارجاع blueprint باقی مانده‌اند؛ فایل games یا منطق بازی تغییر نکرد.
- هشت واژهٔ موردنیاز blueprint باید از main_term_database خوانده شوند. در این بسته واژه‌های contextual برای آموزش درج شده‌اند، اما هیچ TERM ID یا رکورد canonical ایجاد یا verified نشده؛ نگاشت نهایی باید در QA کنترل شود.
- listening slot دارای transcript است ولی audio_asset=null؛ بنابراین صوت تولیدشده ادعا نشده است.
- مثال خودرو ساختگی است و اطلاعات مدل واقعی خاصی را نمایش نمی‌دهد.
- تعریف model year با سال تقویمی تولید یکی فرض نشده است.

## منابع
منابع دولتی/بین‌دولتی برای اصطلاحات شناسایی خودرو و odometer، و British Council برای ساختارهای دستوری استفاده شده‌اند. تمام منابع در sources.json با وضعیت candidate/unverified ثبت شده‌اند.

## فایل‌ها
- lesson.json
- sources.json
- REPORT.md

## وضعیت
needs_review — authoring package only.
درخواست بررسی مستقل schema/loader، نگاشت واژگان به بانک اصلی و تطبیق آزمون QZ-B11 به AI-1 ارسال می‌شود. هیچ فایل main، blueprint، بانک اصطلاحات، بانک آزمون، مکالمه canonical، frontend، SQL یا production data تغییر نکرده است.
