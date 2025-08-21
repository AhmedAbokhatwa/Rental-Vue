# دليل الإعداد والتشغيل 📋

## 🚀 خطوات الإعداد السريع

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
أنشئ ملف `.env` في المجلد الرئيسي:

```env
# رابط خادم Frappe
VITE_FRAPPE_URL=https://ejar.salasah.sa

# مفتاح API للوصول إلى Frappe
VITE_API_KEY=your_api_key_here

# السر الخاص بـ API
VITE_API_SECRET=your_api_secret_here

# بيئة التشغيل
VITE_ENV=development
```

### 3. تشغيل التطبيق
```bash
npm run dev
```

## 🔧 الإعداد المفصل

### إعداد Frappe/ERPNext

#### 1. إنشاء API Key في Frappe
```bash
# في Frappe Bench
bench --site your-site.com set-config api_key "your-api-key"
bench --site your-site.com set-config api_secret "your-api-secret"
```

#### 2. إعداد CORS
```bash
# السماح بالوصول من localhost
bench --site your-site.com add-to-allowed-origins http://localhost:5173
```

#### 3. إنشاء DocTypes المطلوبة
- `Supplier` - بيانات الموردين
- `Item` - عناصر المعدات
- `Asset` - الأصول/المعدات
- `Asset Category` - فئات المعدات
- `Location` - المواقع

### إعداد Firebase (اختياري)

#### 1. إنشاء مشروع Firebase
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. أنشئ مشروع جديد
3. فعّل Authentication
4. أضف Google Sign-in

#### 2. إضافة إعدادات Firebase
```env
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📱 اختبار النظام

### 1. اختبار الاتصال بـ Frappe
```bash
# تشغيل التطبيق
npm run dev

# فتح المتصفح على
http://localhost:5173
```

### 2. اختبار تسجيل الدخول
1. اذهب إلى `/login`
2. أدخل بيانات مستخدم موجود في Frappe
3. تأكد من نجاح تسجيل الدخول

### 3. اختبار إضافة معدة
1. اذهب إلى `/add-equipment`
2. املأ بيانات المعدة
3. تأكد من حفظها في Frappe

## 🔍 استكشاف الأخطاء الشائعة

### مشكلة: لا يمكن الاتصال بـ Frappe
**الحل:**
1. تحقق من صحة `VITE_FRAPPE_URL`
2. تأكد من أن خادم Frappe يعمل
3. تحقق من إعدادات CORS

### مشكلة: خطأ في API Key
**الحل:**
1. تحقق من صحة `VITE_API_KEY` و `VITE_API_SECRET`
2. تأكد من إنشاء API Key في Frappe
3. راجع صلاحيات المستخدم

### مشكلة: لا تظهر المعدات
**الحل:**
1. تأكد من وجود فئات الأصول في Frappe
2. تحقق من وجود المواقع
3. راجع سجلات Frappe للأخطاء

## 📊 هيكل البيانات في Frappe

### Supplier (المورد)
```json
{
  "supplier_name": "اسم المورد",
  "email_id": "email@example.com",
  "mobile_no": "0500000000",
  "country": "Saudi Arabia",
  "supplier_type": "Individual",
  "supplier_group": "All Supplier"
}
```

### Item (الصنف)
```json
{
  "item_code": "EQ-001",
  "item_name": "حفارة صغيرة",
  "item_group": "Equipment",
  "stock_uom": "Nos",
  "is_stock_item": 0
}
```

### Asset (الأصل)
```json
{
  "asset_name": "حفارة صغيرة - 001",
  "item_code": "EQ-001",
  "asset_category": "Heavy Equipment",
  "location": "الرياض",
  "asset_owner": "المورد",
  "purchase_date": "2024-01-01"
}
```

## 🎯 أوامر مفيدة

### تشغيل التطبيق
```bash
# وضع التطوير
npm run dev

# بناء للإنتاج
npm run build

# معاينة الإنتاج
npm run preview
```

### تنظيف وإعادة تثبيت
```bash
# حذف node_modules
rm -rf node_modules

# حذف package-lock.json
rm package-lock.json

# إعادة تثبيت التبعيات
npm install
```

### فحص الأخطاء
```bash
# فحص الأخطاء في الكود
npm run lint

# فحص الأخطاء في TypeScript
npm run type-check
```

## 📞 الدعم والمساعدة

### في حالة وجود مشاكل:
1. راجع سجلات المتصفح (F12)
2. تحقق من سجلات Frappe
3. راجع ملفات التوثيق
4. تواصل مع فريق التطوير

### معلومات مفيدة:
- **رابط التطبيق**: http://localhost:5173
- **رابط Frappe**: https://ejar.salasah.sa
- **رابط Firebase**: https://console.firebase.google.com

## ✅ قائمة التحقق

- [ ] تم تثبيت التبعيات
- [ ] تم إنشاء ملف .env
- [ ] تم إعداد Frappe API
- [ ] تم إعداد CORS
- [ ] تم إنشاء DocTypes
- [ ] تم اختبار الاتصال
- [ ] تم اختبار تسجيل الدخول
- [ ] تم اختبار إضافة معدة
- [ ] تم اختبار جميع الصفحات

## 🎉 تم الإعداد بنجاح!

الآن يمكنك استخدام النظام بالكامل. تأكد من اختبار جميع الوظائف قبل تسليم المشروع.
