<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">إنشاء حساب جديد</h2>
        <p class="text-gray-600">اختر نوع الحساب الذي تريد إنشاءه</p>
      </div>

      <!-- Account Type Selection -->
      <div class="bg-white rounded-lg shadow-xl p-8">
        <div class="mb-8">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">نوع الحساب</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              @click="selectAccountType('user')"
              :class="[
                'border-2 rounded-lg p-4 cursor-pointer transition-all duration-200',
                accountType === 'user' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center space-x-3 space-x-reverse">
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                  <div v-if="accountType === 'user'" class="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800">حساب مستخدم عادي</h4>
                  <p class="text-sm text-gray-600">للاستخدام العام والتصفح</p>
                </div>
              </div>
            </div>
            
            <div 
              @click="selectAccountType('vendor')"
              :class="[
                'border-2 rounded-lg p-4 cursor-pointer transition-all duration-200',
                accountType === 'vendor' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
            >
              <div class="flex items-center space-x-3 space-x-reverse">
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                  <div v-if="accountType === 'vendor'" class="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-800">حساب مورد</h4>
                  <p class="text-sm text-gray-600">لإضافة وإدارة المعدات</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Registration Form -->
        <form @submit.prevent="register" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
              <input 
                v-model="form.name"
                type="text" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل اسمك الكامل"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input 
                v-model="form.email"
                type="email" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل بريدك الإلكتروني"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input 
                v-model="form.phone"
                type="tel" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل رقم هاتفك"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
              <input 
                v-model="form.password"
                type="password" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>
          </div>

          <!-- Vendor Specific Information -->
          <div v-if="accountType === 'vendor'" class="border-t pt-6">
            <h4 class="text-lg font-semibold text-gray-800 mb-4">معلومات المورد</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">اسم الشركة</label>
                <input 
                  v-model="form.company_name"
                  type="text" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="اسم الشركة أو المؤسسة"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">نوع الشركة</label>
                <select 
                  v-model="form.company_type"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر نوع الشركة</option>
                  <option value="Company">شركة</option>
                  <option value="Individual">فرد</option>
                  <option value="Partnership">شراكة</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">الرقم الضريبي</label>
                <input 
                  v-model="form.tax_number"
                  type="text" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="الرقم الضريبي"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                <input 
                  v-model="form.address"
                  type="text" 
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="عنوان الشركة"
                />
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start space-x-3 space-x-reverse">
            <input 
              v-model="acceptTerms"
              type="checkbox" 
              class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              required
            />
            <div class="text-sm text-gray-600">
              <p>أوافق على <a href="#" class="text-blue-600 hover:text-blue-700 underline">الشروط والأحكام</a> و <a href="#" class="text-blue-600 hover:text-blue-700 underline">سياسة الخصوصية</a></p>
            </div>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="loading || !acceptTerms"
            class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              جاري إنشاء الحساب...
            </span>
            <span v-else>
              {{ accountType === 'vendor' ? 'إنشاء حساب مورد' : 'إنشاء حساب مستخدم' }}
            </span>
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-gray-600">
            لديك حساب بالفعل؟ 
            <router-link to="/login" class="text-blue-600 hover:text-blue-700 font-medium">
              تسجيل الدخول
            </router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-gray-800 mb-2">تم إنشاء الحساب بنجاح!</h3>
          <p class="text-gray-600 mb-6">{{ successMessage }}</p>
          <div class="space-y-3">
            <button 
              @click="goToDashboard"
              class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              الذهاب إلى لوحة التحكم
            </button>
            <button 
              @click="closeSuccessModal"
              class="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { registerVendorApi } from '@/services/api'
export default {
  name: 'RegisterPage',
  data() {
    return {
      accountType: 'user', // 'user' or 'vendor'
      form: {
        name: '',
        email: '',
        phone: '',
        password: '',
        company_name: '',
        company_type: '',
        tax_number: '',
        address: ''
      },
      acceptTerms: false,
      loading: false,
      showSuccessModal: false,
      successMessage: '',
      sessionData: null
    }
  },
  methods: {
    selectAccountType(type) {
      this.accountType = type
    },

    async register() {
      if (!this.acceptTerms) {
        alert('يجب الموافقة على الشروط والأحكام')
        return
      }

      this.loading = true

      try {
        if (this.accountType === 'vendor') {
          // إنشاء حساب مورد
          const vendorData = {
            ...this.form,
            password: this.form.password
          }

          const result = await registerVendorApi(vendorData)
          
          if (result.success) {
            this.successMessage = 'تم إنشاء حساب المورد بنجاح! سيتم إنشاء معدة افتراضية تلقائياً.'
            this.sessionData = {
              type: 'vendor',
              user: result.user,
              frappeData: result.frappeData
            }
            this.showSuccessModal = true
          } else {
            alert(`فشل في إنشاء حساب المورد: ${result.error}`)
          }
        } else {
          // إنشاء حساب مستخدم عادي
          const userData = {
            name: this.form.name,
            email: this.form.email,
            phone: this.form.phone,
            password: this.form.password
          }

          // هنا يمكن إضافة منطق إنشاء حساب مستخدم عادي
          // حالياً سنستخدم نفس دالة المورد ولكن مع بيانات محدودة
          const result = await registerVendorApi({
            ...userData,
            company_name: '',
            company_type: 'Individual',
            tax_number: '',
            address: ''
          })

          if (result.success) {
            this.successMessage = 'تم إنشاء الحساب بنجاح!'
            this.sessionData = {
              type: 'user',
              user: result.user,
              frappeData: result.frappeData
            }
            this.showSuccessModal = true
          } else {
            alert(`فشل في إنشاء الحساب: ${result.error}`)
          }
        }
      } catch (error) {
        console.error('خطأ في التسجيل:', error)
        alert(`حدث خطأ في التسجيل: ${error.message}`)
      } finally {
        this.loading = false
      }
    },

    // goToDashboard() {
    //   if (this.sessionData) {
    //     // حفظ بيانات الجلسة باستخدام الدالة الجديدة
    //     const saved = saveSessionData(this.sessionData)
        
    //     if (saved) {
    //       // التوجيه إلى لوحة التحكم المناسبة
    //       if (this.sessionData.type === 'vendor') {
    //         this.$router.push('/vendor-dashboard')
    //       } else {
    //         this.$router.push('/dashboard')
    //       }
    //     } else {
    //       alert('حدث خطأ في حفظ بيانات الجلسة')
    //     }
    //   }
    // },

    // closeSuccessModal() {
    //   this.showSuccessModal = false
    //   this.$router.push('/login')
    // }
  }
}
</script>

<style scoped>
/* Custom styles for better UX */
.border-2 {
  border-width: 2px;
}

.space-x-reverse > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 1;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}
</style> 