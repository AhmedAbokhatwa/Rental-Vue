<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <img src="/logo.png" alt="Logo" class="h-16 mx-auto mb-4">
        <h1 class="text-3xl font-bold text-gray-800">تسجيل مورد جديد</h1>
        <p class="text-gray-600 mt-2">أدخل بياناتك لتسجيل حساب مورد جديد</p>
      </div>

      <!-- Registration Form -->
      <div class="bg-white rounded-lg shadow-xl p-8">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">{{ loadingMessage }}</p>
        </div>

        <!-- Registration Form -->
        <form v-else @submit.prevent="handleRegistration" class="space-y-6">
          <!-- Personal Information -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 class="text-lg font-semibold text-blue-800 mb-3">البيانات الشخصية</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="أدخل اسمك الكامل"
                >
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="أدخل بريدك الإلكتروني"
                >
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                  رقم الجوال *
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="05xxxxxxxx"
                >
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور *
                </label>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="أدخل كلمة المرور"
                >
              </div>
            </div>
          </div>

          <!-- Company Information -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 class="text-lg font-semibold text-green-800 mb-3">بيانات المؤسسة</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="company_name" class="block text-sm font-medium text-gray-700 mb-2">
                  اسم المؤسسة
                </label>
                <input
                  id="company_name"
                  v-model="form.company_name"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="اسم المؤسسة (اختياري)"
                >
              </div>

              <div>
                <label for="company_type" class="block text-sm font-medium text-gray-700 mb-2">
                  نوع المؤسسة
                </label>
                <select
                  id="company_type"
                  v-model="form.company_type"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="">اختر نوع المؤسسة</option>
                  <option value="Individual">فرد</option>
                  <option value="Company">شركة</option>
                  <option value="Partnership">شراكة</option>
                </select>
              </div>

              <div>
                <label for="registration_number" class="block text-sm font-medium text-gray-700 mb-2">
                  رقم السجل التجاري
                </label>
                <input
                  id="registration_number"
                  v-model="form.registration_number"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="رقم السجل التجاري (اختياري)"
                >
              </div>

              <div>
                <label for="tax_number" class="block text-sm font-medium text-gray-700 mb-2">
                  الرقم الضريبي
                </label>
                <input
                  id="tax_number"
                  v-model="form.tax_number"
                  type="text"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="الرقم الضريبي (اختياري)"
                >
              </div>
            </div>

            <div class="mt-4">
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                العنوان
              </label>
              <textarea
                id="address"
                v-model="form.address"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                placeholder="العنوان الكامل (اختياري)"
              ></textarea>
            </div>
          </div>

          <!-- تم حذف قسم بيانات المعدة الأولى بناءً على طلبك -->

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>

          <!-- Success Message -->
          <div v-if="success" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <p class="text-green-600 text-sm">{{ success }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {{ loading ? 'جاري التسجيل...' : 'تسجيل المورد' }}
          </button>

          <!-- Links -->
          <div class="text-center space-y-2">
            <div class="text-gray-600 text-sm">
              لديك حساب بالفعل؟
              <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
                تسجيل الدخول
              </router-link>
            </div>
            <router-link
              to="/"
              class="text-gray-500 hover:text-gray-700 text-sm"
            >
              العودة للصفحة الرئيسية
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {registerVendorApi} from '@/services/api';

export default {
  name: 'RegisterVendor',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        password: '',
        company_name: '',
        company_type: '',
        registration_number: '',
        tax_number: '',
        address: '',
        
      },
      loading: false,
      loadingMessage: '',
      error: '',
      success: ''
    };
  },
  methods: {
    async handleRegistration() {
      try {
        this.loading = true;
        this.loadingMessage = 'جاري تسجيل المورد...';
        this.error = '';
        this.success = '';

        console.log('🚀 بدء تسجيل المورد:', this.form.email);

        // التحقق من البيانات المطلوبة
        if (!this.form.name || !this.form.email || !this.form.phone || !this.form.password) {
          this.error = 'يرجى ملء جميع الحقول المطلوبة';
          return;
        }

        // تسجيل المورد في Firebase
        const vendorData = {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          password: this.form.password,
          company_name: this.form.company_name || this.form.name,
          company_type: this.form.company_type || 'Individual',
          registration_number: this.form.registration_number || '',
          tax_number: this.form.tax_number || '',
          address: this.form.address || ''
        };

        const authResult = await registerVendorApi(vendorData);
        console.log('authResult',authResult)
        if (authResult.success) {
          console.log('✅ تم تسجيل المورد بنجاح');
          this.success = 'تم تسجيل المورد بنجاح!';

          // حفظ البيانات الأساسية فقط
          // localStorage.setItem('vendor_uid', authResult.user.uid);
          localStorage.setItem('vendor_name', this.form.name);
          localStorage.setItem('vendor_email', this.form.email);
          localStorage.setItem('vendor_phone', this.form.phone);
          localStorage.setItem('vendor_status', 'approved');

          // التوجيه إلى صفحة تسجيل الدخول
          setTimeout(() => {
            this.$router.push('/login');
          }, 1200);

        } else {
          console.log('❌ فشل في تسجيل المورد:', authResult.error);
          this.error = authResult.error;
        }

      } catch (error) {
        console.error('❌ خطأ في تسجيل المورد:', error);
        this.error = 'حدث خطأ في تسجيل المورد. يرجى المحاولة مرة أخرى.';
      } finally {
        this.loading = false;
        this.loadingMessage = '';
      }
    }
  },

  mounted() {
    // لا شيء
  }
};
</script>

<style scoped>
/* Custom styles for RTL */
.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(0.75rem * var(--tw-space-x-reverse));
  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
}
</style> 