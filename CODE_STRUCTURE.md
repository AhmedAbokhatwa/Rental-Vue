# هيكل الكود - Code Structure 📁

## 🎯 نظرة عامة على الهيكل

تم تنظيم الكود بشكل واضح ومنطقي لسهولة الفهم والصيانة. كل مجلد له وظيفة محددة وواضحة.

## 📁 هيكل المجلدات

```
rental-app/
├── 📄 README.md                    # نظرة عامة على المشروع
├── 📄 README_MAIN.md              # دليل سريع للمجلد الرئيسي
├── 📄 QUICK_START.md              # دليل البدء السريع
├── 📄 SETUP_GUIDE.md              # دليل الإعداد المفصل
├── 📄 CODE_DOCUMENTATION.md       # توثيق الكود
├── 📄 CODE_STRUCTURE.md           # هذا الملف - هيكل الكود
├── 📄 TASK_CHECKLIST.md           # قائمة المهام
├── 📄 PROJECT_SUMMARY.md          # ملخص المشروع
├── 📄 config.js                   # إعدادات Frappe
├── 📄 package.json                # تبعيات المشروع
├── 📄 .gitignore                  # ملفات Git المهملة
├── 📄 vite.config.js              # إعدادات Vite
├── 📄 tailwind.config.js          # إعدادات Tailwind
├── 📄 postcss.config.js           # إعدادات PostCSS
├── 📄 jsconfig.json               # إعدادات JavaScript
├── 📁 src/                        # الكود المصدري
│   ├── 📄 main.js                 # نقطة البداية
│   ├── 📄 App.vue                 # المكون الرئيسي
│   ├── 📄 index.css               # الأنماط العامة
│   ├── 📁 views/                  # صفحات التطبيق
│   │   ├── 📄 HomePage.vue        # الصفحة الرئيسية
│   │   ├── 📄 LoginPage.vue       # تسجيل الدخول
│   │   ├── 📄 RegisterVendor.vue  # تسجيل مورد
│   │   ├── 📄 EquipmentPage.vue   # عرض المعدات
│   │   ├── 📄 AddEquipmentPage.vue # إضافة معدة
│   │   ├── 📄 VendorDashboard.vue # لوحة التحكم
│   │   ├── 📄 CompleteProfile.vue # إكمال الملف
│   │   └── 📄 RegisterPage.vue    # تسجيل مستخدم
│   ├── 📁 components/             # المكونات القابلة لإعادة الاستخدام
│   │   └── 📄 SessionManager.vue  # مدير الجلسات
│   ├── 📁 services/               # خدمات API والاتصال
│   │   ├── 📄 api.js              # API الرئيسي
│   │   ├── 📄 frappe-api.js       # Frappe API
│   │   ├── 📄 auth.js             # المصادقة
│   │   └── 📄 gateway.js          # بوابة API
│   ├── 📁 store/                  # إدارة الحالة (Vuex)
│   │   └── 📄 index.js            # Store الرئيسي
│   ├── 📁 router/                 # توجيه الصفحات
│   │   └── 📄 index.js            # إعدادات Router
│   └── 📁 firebase/               # إعدادات Firebase
│       └── 📄 config.js           # تكوين Firebase
├── 📁 public/                     # الملفات العامة
│   ├── 📄 index.html              # ملف HTML الرئيسي
│   └── 📄 equipment-bg.jpg        # صورة الخلفية
├── 📁 server/                     # خادم Node.js (اختياري)
│   ├── 📄 package.json            # تبعيات الخادم
│   └── 📁 src/                    # كود الخادم
└── 📁 dist/                       # ملفات البناء (يتم إنشاؤها)
```

## 🔧 الملفات الرئيسية

### 📄 `main.js` - نقطة البداية
```javascript
// الملف الرئيسي لتشغيل التطبيق
// يقوم بـ:
// 1. إنشاء تطبيق Vue
// 2. ربط Router و Store
// 3. تهيئة AOS (Animate On Scroll)
// 4. تشغيل التطبيق
```

### 📄 `App.vue` - المكون الرئيسي
```javascript
// المكون الجذر للتطبيق
// يحتوي على:
// 1. شريط التنقل (Navigation)
// 2. عرض الصفحات (Router View)
// 3. إدارة حالة تسجيل الدخول
// 4. زر تسجيل الخروج
```

### 📄 `config.js` - إعدادات Frappe
```javascript
// إعدادات Frappe/ERPNext
export const config = {
  FRAPPE_URL: 'https://ejar.salasah.sa/',
  API_KEY: 'your_api_key',
  API_SECRET: 'your_api_secret',
  ENV: 'development'
}
```

## 📱 الصفحات (Views)

### 📁 `src/views/`
كل صفحة لها وظيفة محددة وواضحة:

- **`HomePage.vue`** - صفحة الترحيب والإحصائيات
- **`LoginPage.vue`** - تسجيل دخول الموردين
- **`RegisterVendor.vue`** - تسجيل مورد جديد
- **`EquipmentPage.vue`** - عرض وإدارة المعدات
- **`AddEquipmentPage.vue`** - إضافة معدات جديدة
- **`VendorDashboard.vue`** - لوحة تحكم المورد
- **`CompleteProfile.vue`** - إكمال بيانات المورد
- **`RegisterPage.vue`** - تسجيل مستخدم عادي

## 🔌 الخدمات (Services)

### 📁 `src/services/`
خدمات منفصلة وواضحة:

- **`api.js`** - API الرئيسي للتواصل مع Frappe
- **`frappe-api.js`** - خدمات خاصة بـ Frappe
- **`auth.js`** - إدارة المصادقة والجلسات
- **`gateway.js`** - بوابة API للطلبات

## 📊 إدارة الحالة (Store)

### 📁 `src/store/`
- **`index.js`** - Store الرئيسي مع Vuex
- إدارة حالة المصادقة
- إدارة بيانات المستخدم
- إدارة بيانات المورد
- إدارة بيانات Frappe

## 🛣️ التوجيه (Router)

### 📁 `src/router/`
- **`index.js`** - تعريف جميع مسارات التطبيق
- توجيه واضح ومنطقي
- حماية المسارات
- توجيه تلقائي

## 🧩 المكونات (Components)

### 📁 `src/components/`
- **`SessionManager.vue`** - مدير الجلسات (للتنمية)
- مكونات قابلة لإعادة الاستخدام
- منطق منفصل وواضح

## 🔥 Firebase

### 📁 `src/firebase/`
- **`config.js`** - إعدادات Firebase
- تهيئة Authentication
- إعدادات Firestore
- تصدير الخدمات

## 🎨 التصميم

### 📄 `src/index.css`
- إعدادات Tailwind CSS
- الألوان المخصصة
- دعم RTL
- الأنماط العامة

## 📦 ملفات الإعداد

### ملفات التكوين
- **`package.json`** - تبعيات المشروع
- **`vite.config.js`** - إعدادات Vite
- **`tailwind.config.js`** - إعدادات Tailwind
- **`postcss.config.js`** - إعدادات PostCSS
- **`jsconfig.json`** - إعدادات JavaScript

## 🔒 الأمان

### ملفات الأمان
- **`.gitignore`** - ملفات Git المهملة
- **`config.js`** - إعدادات آمنة
- **متغيرات البيئة** - حماية البيانات الحساسة

## 📚 التوثيق

### ملفات التوثيق
- **`README.md`** - نظرة عامة
- **`QUICK_START.md`** - بدء سريع
- **`SETUP_GUIDE.md`** - إعداد مفصل
- **`CODE_DOCUMENTATION.md`** - توثيق الكود
- **`TASK_CHECKLIST.md`** - قائمة المهام
- **`PROJECT_SUMMARY.md`** - ملخص المشروع
- **`CODE_STRUCTURE.md`** - هذا الملف

## 🎯 مبادئ التنظيم

### 1. فصل المسؤوليات
- كل ملف له وظيفة محددة
- فصل المنطق عن العرض
- خدمات منفصلة وواضحة

### 2. قابلية الصيانة
- كود نظيف ومنظم
- تعليقات واضحة
- أسماء ملفات ومتغيرات منطقية

### 3. قابلية التوسع
- هيكل مرن
- مكونات قابلة لإعادة الاستخدام
- خدمات قابلة للتوسع

### 4. الأمان
- حماية البيانات الحساسة
- معالجة آمنة للأخطاء
- التحقق من المدخلات

## 🔍 كيفية التنقل في الكود

### للعثور على وظيفة معينة:
1. **المصادقة**: `src/services/auth.js` + `src/store/index.js`
2. **API**: `src/services/api.js` + `src/services/frappe-api.js`
3. **الصفحات**: `src/views/`
4. **المكونات**: `src/components/`
5. **التوجيه**: `src/router/index.js`
6. **إدارة الحالة**: `src/store/index.js`

### للعثور على إعدادات معينة:
1. **Frappe**: `config.js`
2. **Firebase**: `src/firebase/config.js`
3. **Vite**: `vite.config.js`
4. **Tailwind**: `tailwind.config.js`

## 📝 ملاحظات مهمة

### 1. التعليقات
- جميع الملفات تحتوي على تعليقات واضحة
- شرح الوظائف والمتغيرات
- أمثلة للاستخدام

### 2. الأسماء
- أسماء ملفات ومجلدات واضحة
- أسماء متغيرات ودوال منطقية
- استخدام اللغة العربية في التعليقات

### 3. التنظيم
- ترتيب منطقي للملفات
- فصل واضح للمسؤوليات
- سهولة العثور على الملفات

## 🚀 الخلاصة

هذا الهيكل مصمم ليكون:
- ✅ **واضح ومفهوم** للجميع
- ✅ **سهل الصيانة** والتطوير
- ✅ **قابل للتوسع** والتحديث
- ✅ **آمن ومحمي** من الأخطاء
- ✅ **منظم ومنطقي** في الترتيب

**الكود جاهز للتسليم والفهم السريع! 🎉**
