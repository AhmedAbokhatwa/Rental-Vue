# توثيق الكود - Code Documentation 📚

## 📁 هيكل الملفات والوظائف

### 🔧 الملفات الرئيسية

#### `main.js` - نقطة البداية
```javascript
// الملف الرئيسي لتشغيل التطبيق
// يقوم بـ:
// 1. إنشاء تطبيق Vue
// 2. ربط Router و Store
// 3. تهيئة AOS (Animate On Scroll)
// 4. تشغيل التطبيق
```

#### `App.vue` - المكون الرئيسي
```javascript
// المكون الجذر للتطبيق
// يحتوي على:
// 1. شريط التنقل (Navigation)
// 2. عرض الصفحات (Router View)
// 3. إدارة حالة تسجيل الدخول
// 4. زر تسجيل الخروج
```

### 🛣️ التوجيه (Router)

#### `src/router/index.js`
```javascript
// تعريف جميع مسارات التطبيق
const routes = [
  { path: '/', component: HomePage },           // الصفحة الرئيسية
  { path: '/login', component: LoginPage },     // تسجيل الدخول
  { path: '/register-vendor', component: RegisterVendor }, // تسجيل مورد
  { path: '/equipment', component: EquipmentPage },        // المعدات
  { path: '/add-equipment', component: AddEquipmentPage }, // إضافة معدة
  { path: '/vendor/dashboard', component: VendorDashboard }, // لوحة التحكم
  { path: '/complete-profile', component: CompleteProfile }  // إكمال الملف
]
```

### 📊 إدارة الحالة (Store)

#### `src/store/index.js`
```javascript
// إدارة الحالة العامة للتطبيق
state: {
  authStatus: '',        // حالة المصادقة
  user: null,           // بيانات المستخدم
  vendorData: null,     // بيانات المورد
  frappeData: null,     // بيانات Frappe
  loading: false,       // حالة التحميل
  error: null           // رسائل الخطأ
}

// العمليات الرئيسية:
// - loginVendor: تسجيل دخول المورد
// - registerVendor: تسجيل مورد جديد
// - logout: تسجيل الخروج
// - checkAuthOnPageLoad: التحقق من الجلسة
```

### 🔌 الخدمات (Services)

#### `src/services/api.js` - API الرئيسي
```javascript
// التواصل مع Frappe API
// الوظائف الرئيسية:
// - vendorLogin: تسجيل دخول المورد
// - createUserInFrappe: إنشاء مستخدم في Frappe
// - createItem: إنشاء صنف جديد
// - createAsset: إنشاء أصل جديد
// - getEquipmentItems: جلب المعدات
// - registerVendor: تسجيل مورد جديد
```

#### `src/services/frappe-api.js` - Frappe API
```javascript
// خدمات خاصة بـ Frappe
// الوظائف الرئيسية:
// - createSupplier: إنشاء مورد
// - getSupplierByEmail: البحث عن مورد
// - createItem: إنشاء صنف
// - createAsset: إنشاء أصل
// - getAssetCategories: جلب فئات الأصول
// - getLocations: جلب المواقع
```

#### `src/services/auth.js` - المصادقة
```javascript
// إدارة المصادقة والجلسات
// الوظائف الرئيسية:
// - checkFrappeSession: التحقق من جلسة Frappe
// - saveSession: حفظ الجلسة
// - clearSession: مسح الجلسة
// - getCurrentUser: جلب المستخدم الحالي
```

### 📱 الصفحات (Views)

#### `src/views/HomePage.vue` - الصفحة الرئيسية
```javascript
// صفحة الترحيب
// تحتوي على:
// 1. قسم Hero مع إحصائيات
// 2. الميزات الرئيسية
// 3. روابط سريعة
// 4. تصميم متجاوب
```

#### `src/views/LoginPage.vue` - تسجيل الدخول
```javascript
// صفحة تسجيل الدخول
// الميزات:
// 1. نموذج تسجيل دخول موحد
// 2. دعم Frappe و Firebase
// 3. رسائل خطأ واضحة
// 4. توجيه تلقائي بعد النجاح
```

#### `src/views/VendorDashboard.vue` - لوحة التحكم
```javascript
// لوحة تحكم المورد
// تحتوي على:
// 1. معلومات المورد
// 2. إحصائيات المعدات
// 3. روابط سريعة
// 4. إدارة الحساب
```

#### `src/views/EquipmentPage.vue` - المعدات
```javascript
// صفحة عرض المعدات
// الميزات:
// 1. قائمة المعدات من Frappe
// 2. تصفية حسب الفئة والموقع
// 3. بحث في المعدات
// 4. بيانات احتياطية
```

#### `src/views/AddEquipmentPage.vue` - إضافة معدة
```javascript
// صفحة إضافة معدة جديدة
// العملية:
// 1. إنشاء Item (صنف)
// 2. إنشاء Asset (أصل)
// 3. ربط المورد بالمعدة
// 4. رفع الصور والملفات
```

### 🧩 المكونات (Components)

#### `src/components/SessionManager.vue`
```javascript
// مدير الجلسات (للتنمية فقط)
// الوظائف:
// 1. عرض معلومات الجلسة
// 2. اختبار الاتصال
// 3. إدارة البيانات المحلية
// 4. تنظيف البيانات
```

### 🔥 Firebase

#### `src/firebase/config.js`
```javascript
// إعدادات Firebase
// يحتوي على:
// 1. تهيئة Firebase
// 2. إعدادات Authentication
// 3. إعدادات Firestore
// 4. تصدير الخدمات
```

### 🎨 التصميم

#### `src/index.css`
```css
/* الأنماط العامة */
/* يحتوي على:
1. إعدادات Tailwind CSS
2. الألوان المخصصة
3. دعم RTL
4. الأنماط العامة
*/
```

## 🔄 تدفق البيانات

### 1. تسجيل الدخول
```
المستخدم → LoginPage → Store → API → Frappe → حفظ الجلسة → توجيه للوحة التحكم
```

### 2. إضافة معدة
```
المستخدم → AddEquipmentPage → API → Frappe (Item) → Frappe (Asset) → تحديث القائمة
```

### 3. عرض المعدات
```
EquipmentPage → API → Frappe → Store → عرض البيانات
```

## 🛡️ الأمان

### 1. المصادقة
- استخدام tokens آمنة
- التحقق من الصلاحيات
- حفظ الجلسات بشكل آمن

### 2. حماية البيانات
- تشفير البيانات الحساسة
- التحقق من المدخلات
- معالجة الأخطاء بشكل آمن

## 🔧 الإعدادات

### `config.js`
```javascript
// إعدادات Frappe
export const config = {
  FRAPPE_URL: 'https://ejar.salasah.sa/',
  API_KEY: 'your_api_key',
  API_SECRET: 'your_api_secret',
  ENV: 'development'
}
```

### `vite.config.js`
```javascript
// إعدادات Vite
// يحتوي على:
// 1. إعدادات Vue
// 2. إعدادات PostCSS
// 3. إعدادات التطوير
```

## 📝 ملاحظات مهمة

### 1. دعم RTL
- استخدام `space-x-reverse` في Tailwind
- النص من اليمين لليسار
- الأيقونات متوافقة مع العربية

### 2. معالجة الأخطاء
- رسائل خطأ واضحة بالعربية
- معالجة فشل الاتصال
- بيانات احتياطية

### 3. الأداء
- تحميل كسول للصفحات
- تحسين الصور
- ضغط الملفات

## 🚀 النشر

### 1. بناء الإنتاج
```bash
npm run build
```

### 2. معاينة الإنتاج
```bash
npm run preview
```

### 3. النشر
- رفع مجلد `dist` إلى الخادم
- إعداد متغيرات البيئة
- اختبار جميع الوظائف

## 🔍 استكشاف الأخطاء

### 1. مشاكل الاتصال
- تحقق من إعدادات API
- راجع سجلات Frappe
- اختبر الاتصال

### 2. مشاكل المصادقة
- تحقق من الجلسة
- راجع tokens
- اختبر تسجيل الدخول

### 3. مشاكل البيانات
- تحقق من DocTypes
- راجع الصلاحيات
- اختبر API endpoints

## 📞 الدعم

للمساعدة في الكود:
1. راجع هذا التوثيق
2. تحقق من التعليقات في الكود
3. راجع سجلات الأخطاء
4. تواصل مع المطور
