# ابزارهای کنترل کیفیت AUTONEX

## پایلوت فعال Autel v0.3

برای اعتبارسنجی بانک متصل به آکادمی، از ریشه مخزن اجرا کنید:

```bash
python3 tools/validate_autel_v03.py
```

یا از مسیر سازگاری ریشه:

```bash
python3 validate_pilot.py
```

این ابزار مسیر canonical زیر را بررسی می‌کند:

- data/technical_reference/autel_ms906pro_v03/entries.json
- data/technical_reference/autel_ms906pro_v03/device.json
- data/technical_reference/autel_ms906pro_v03/sources.json
- سه Schema همان پوشه

ویژگی‌های اعتبارسنج v0.3:
- پشتیبانی صحیح از type union مانند string | null در Schema؛
- بررسی Schema، شناسه‌های تکراری، source_id و document_edition؛
- بررسی target_id، target_context، رابطه‌های معکوس و parent؛
- بررسی وضعیت ترجمه و تألیفی‌بودن سناریوها؛
- تطبیق صفحات ارجاع‌شده با manifest منبع؛
- تولید گزارش JSON و Markdown در پوشه QA.

گزارش‌های تولیدی:
- QA/AUTEL_V03_VALIDATION.json
- QA/AUTEL_V03_VALIDATION.md

برای شکست دادن اجرا در صورت وجود هشدار نیز از گزینه زیر استفاده کنید:

```bash
python3 tools/validate_autel_v03.py --strict-warnings
```

## اعتبارسنجی بانک قدیمی Autel v0.2

اسکریپت tools/validate_pilot.py فقط برای قالب قدیمی v0.2 و داده‌های legacy نگه داشته شده است. آن را برای بانک v0.3 اجرا نکنید. Workflow قدیمی نیز مستقل از پایلوت v0.3 است.

## تاریخچه فایل validator ارسالی AI-3

نسخه اولیه AI-3 که در ریشه مخزن بارگذاری شده بود، به‌دلیل فرض‌گرفتن مسیرهای ناموجود و ناسازگاری fallback با type union قابل اتکا نبود. متن آن برای traceability در data/technical_reference/autel_ms906pro_v03/AI3_original_validate_pilot_v0.3.txt نگهداری شده است. فایل validate_pilot.py در ریشه اکنون فقط یک wrapper سازگاری است و validator فعال v0.3 را اجرا می‌کند.

## محدودیت QA

اعتبارسنجی ساختاری و رابطه‌ای به معنی تأیید مستقل صحت فنی، ترجمه، تلفظ یا تطبیق منوها با سخت‌افزار واقعی نیست. ترجمه‌ها باید تا بازبینی انسانی draft_unreviewed بمانند.
