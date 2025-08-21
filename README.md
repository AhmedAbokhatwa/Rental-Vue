# نظام إدارة المعدات - Rental Equipment Management System 🚀

## 📋 نظرة عامة
نظام متكامل لإدارة المعدات والتأجير مبني على Vue.js مع Frappe/ERPNext كخادم خلفي. النظام مصمم خصيصاً للبيئة العربية مع واجهة عربية بالكامل ودعم RTL.

## 🚀 الميزات الرئيسية
- ✅ تسجيل دخول آمن عبر Frappe
- ✅ إدارة المعدات (إضافة، عرض، تعديل)
- ✅ لوحة تحكم للموردين
- ✅ واجهة عربية بالكامل مع دعم RTL
- ✅ تصميم متجاوب مع جميع الأجهزة

## ⚡ التشغيل السريع

### 1. تثبيت التبعيات
```bash
npm install
```

### 2. إعداد متغيرات البيئة
أنشئ ملف `.env` في المجلد الرئيسي:
```env
VITE_FRAPPE_URL=https://ejar.salasah.sa
VITE_API_KEY=your_api_key_here
VITE_API_SECRET=your_api_secret_here
VITE_ENV=development
```

### 3. تشغيل التطبيق
```bash
npm run dev
```

### 4. فتح المتصفح
```
http://localhost:5173
```

## 📱 الصفحات المتاحة

| الصفحة | المسار | الوصف |
|--------|--------|-------|
| الرئيسية | `/` | صفحة الترحيب |
| تسجيل الدخول | `/login` | تسجيل دخول الموردين |
| تسجيل كمورد | `/register-vendor` | تسجيل مورد جديد |
| المعدات | `/equipment` | عرض المعدات |
| إضافة معدة | `/add-equipment` | إضافة معدات جديدة |
| لوحة التحكم | `/vendor/dashboard` | إدارة الحساب |

## 🛠️ التقنيات المستخدمة

### Frontend
- **Vue.js 3** - إطار العمل الرئيسي
- **Vue Router** - توجيه الصفحات
- **Vuex** - إدارة الحالة
- **Tailwind CSS** - التصميم
- **Axios** - طلبات HTTP

### Backend
- **Frappe/ERPNext** - الخادم الرئيسي
- **Firebase** - خادم احتياطي للمصادقة

## 🔐 نظام المصادقة

### تسجيل الدخول عبر Frappe
1. المستخدم يدخل البريد الإلكتروني وكلمة المرور
2. النظام يرسل طلب إلى Frappe
3. في حالة النجاح، يتم حفظ الجلسة
4. جلب بيانات المورد من Frappe

### تسجيل الدخول عبر Firebase (احتياطي)
- يتم استخدام Firebase إذا فشل Frappe
- دعم تسجيل الدخول بـ Google

## 📊 إدارة البيانات

### إنشاء مورد جديد
```javascript
const supplierData = {
  supplier_name: "اسم المورد",
  email_id: "email@example.com",
  mobile_no: "0500000000",
  country: "Saudi Arabia"
}
```

### إضافة معدة جديدة
```javascript
// 1. إنشاء Item (صنف)
const itemData = {
  item_code: "EQ-001",
  item_name: "حفارة صغيرة",
  item_group: "Equipment"
}

// 2. إنشاء Asset (أصل)
const assetData = {
  asset_name: "حفارة صغيرة - 001",
  item_code: "EQ-001",
  asset_category: "Heavy Equipment",
  location: "الرياض"
}
```

## 🎨 التصميم

### الألوان الرئيسية
- **الأزرق الأساسي**: `#3B82F6`
- **الأزرق الداكن**: `#1D4ED8`
- **الرمادي الفاتح**: `#F9FAFB`
- **الرمادي الداكن**: `#374151`

### دعم RTL
- النص من اليمين لليسار
- الأيقونات والتصميم متوافق مع العربية
- استخدام `space-x-reverse` في Tailwind

## 🔍 استكشاف الأخطاء

### مشكلة الاتصال بـ Frappe
1. تحقق من إعدادات `config.js`
2. تأكد من صحة API Key
3. تحقق من اتصال الإنترنت

### مشكلة تسجيل الدخول
1. تأكد من وجود المستخدم في Frappe
2. تحقق من صحة كلمة المرور
3. راجع سجلات Frappe

### مشكلة إضافة المعدات
1. تأكد من وجود فئات الأصول في Frappe
2. تحقق من وجود المواقع
3. راجع بيانات النموذج

## 📚 التوثيق

### ملفات التوثيق المتاحة
- **`QUICK_START.md`** - دليل البدء السريع
- **`SETUP_GUIDE.md`** - دليل الإعداد المفصل
- **`CODE_DOCUMENTATION.md`** - توثيق الكود
- **`TASK_CHECKLIST.md`** - قائمة المهام
- **`PROJECT_SUMMARY.md`** - ملخص المشروع
- **`CODE_STRUCTURE.md`** - هيكل الكود

## 🚀 النشر

### بناء الإنتاج
```bash
npm run build
```

### معاينة الإنتاج
```bash
npm run preview
```

## 📝 ملاحظات مهمة

- النظام يدعم العربية بالكامل
- الجلسات محفوظة في localStorage
- تصميم متجاوب مع جميع الأجهزة
- معالجة الأخطاء شاملة
- بيانات احتياطية في حالة فشل الاتصال

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/new-feature`)
3. Commit التغييرات (`git commit -am 'Add new feature'`)
4. Push إلى Branch (`git push origin feature/new-feature`)
5. أنشئ Pull Request

## 📞 الدعم

للمساعدة أو الاستفسارات:
- راجع ملفات التوثيق
- تحقق من سجلات الأخطاء
- تواصل مع فريق التطوير

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

---

**تم تطوير هذا المشروع بـ ❤️ للبيئة العربية**

npm install ts-interface-checker --save-dev
npm install vuex@4
