<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">إكمال ملف المؤسسة</h1>
          <p class="text-gray-600">يرجى إكمال بيانات مؤسستك لتمكينك من إضافة المعدات</p>
        </div>

        <form @submit.prevent="saveCompanyData" class="space-y-6">
          <!-- بيانات المؤسسة الأساسية -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">البيانات الأساسية</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="companyName" class="block text-sm font-medium text-gray-700 mb-2">اسم المؤسسة *</label>
                <input 
                  type="text" 
                  id="companyName" 
                  v-model="companyData.company_name"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              
              <div>
                <label for="companyType" class="block text-sm font-medium text-gray-700 mb-2">نوع المؤسسة *</label>
                <select 
                  id="companyType" 
                  v-model="companyData.company_type"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">اختر نوع المؤسسة</option>
                  <option value="Private Limited">شركة محدودة المسؤولية</option>
                  <option value="Sole Proprietorship">مؤسسة فردية</option>
                  <option value="Partnership">شركة تضامن</option>
                  <option value="Corporation">شركة مساهمة</option>
                </select>
              </div>
              
              <div>
                <label for="registrationNumber" class="block text-sm font-medium text-gray-700 mb-2">رقم السجل التجاري *</label>
                <input 
                  type="text" 
                  id="registrationNumber" 
                  v-model="companyData.registration_number"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              
              <div>
                <label for="taxNumber" class="block text-sm font-medium text-gray-700 mb-2">الرقم الضريبي *</label>
                <input 
                  type="text" 
                  id="taxNumber" 
                  v-model="companyData.tax_number"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
            </div>
          </div>

          <!-- معلومات الاتصال -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">معلومات الاتصال</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="companyData.phone"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="companyData.email"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
              </div>
              
              <div>
                <label for="website" class="block text-sm font-medium text-gray-700 mb-2">الموقع الإلكتروني</label>
                <input 
                  type="url" 
                  id="website" 
                  v-model="companyData.website"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://example.com"
                >
              </div>
              
              <div>
                <label for="industry" class="block text-sm font-medium text-gray-700 mb-2">نوع النشاط</label>
                <select 
                  id="industry" 
                  v-model="companyData.industry"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">اختر نوع النشاط</option>
                  <option value="Equipment Rental">تأجير المعدات</option>
                  <option value="Construction">البناء والتشييد</option>
                  <option value="Agriculture">الزراعة</option>
                  <option value="Manufacturing">التصنيع</option>
                  <option value="Services">الخدمات</option>
                  <option value="Other">أخرى</option>
                </select>
              </div>
            </div>
          </div>

          <!-- العنوان -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">العنوان</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-2">المدينة *</label>
                <select 
                  id="city" 
                  v-model="companyData.city"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">اختر المدينة</option>
                  <option value="الرياض">الرياض</option>
                  <option value="جدة">جدة</option>
                  <option value="الدمام">الدمام</option>
                  <option value="مكة المكرمة">مكة المكرمة</option>
                  <option value="المدينة المنورة">المدينة المنورة</option>
                  <option value="الطائف">الطائف</option>
                  <option value="تبوك">تبوك</option>
                  <option value="أبها">أبها</option>
                  <option value="حائل">حائل</option>
                  <option value="بريدة">بريدة</option>
                  <option value="خميس مشيط">خميس مشيط</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
              
              <div>
                <label for="country" class="block text-sm font-medium text-gray-700 mb-2">البلد</label>
                <input 
                  type="text" 
                  id="country" 
                  v-model="companyData.country"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value="Saudi Arabia"
                  readonly
                >
              </div>
              
              <div class="md:col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-2">العنوان التفصيلي *</label>
                <textarea 
                  id="address" 
                  v-model="companyData.address"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="أدخل العنوان التفصيلي للمؤسسة"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <!-- المستندات المطلوبة -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">المستندات المطلوبة</h3>
            <div class="space-y-4">
              <div>
                <label for="commercialRegister" class="block text-sm font-medium text-gray-700 mb-2">السجل التجاري *</label>
                <input 
                  type="file" 
                  id="commercialRegister" 
                  @change="handleFileUpload($event, 'commercial_register')"
                  accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                <p class="text-sm text-gray-500 mt-1">يجب أن يكون الملف بصيغة PDF أو صورة</p>
              </div>
              
              <div>
                <label for="taxCertificate" class="block text-sm font-medium text-gray-700 mb-2">الشهادة الضريبية *</label>
                <input 
                  type="file" 
                  id="taxCertificate" 
                  @change="handleFileUpload($event, 'tax_certificate')"
                  accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                <p class="text-sm text-gray-500 mt-1">يجب أن يكون الملف بصيغة PDF أو صورة</p>
              </div>
              
              <div>
                <label for="idCard" class="block text-sm font-medium text-gray-700 mb-2">الهوية الوطنية / الإقامة *</label>
                <input 
                  type="file" 
                  id="idCard" 
                  @change="handleFileUpload($event, 'id_card')"
                  accept=".pdf,.jpg,.jpeg,.png"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                <p class="text-sm text-gray-500 mt-1">يجب أن يكون الملف بصيغة PDF أو صورة</p>
              </div>
            </div>
          </div>

          <!-- الموافقة على الشروط -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <div class="flex items-start">
              <input 
                type="checkbox" 
                id="agreeTerms" 
                v-model="agreeTerms"
                class="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                required
              >
              <label for="agreeTerms" class="mr-3 text-sm text-gray-700">
                أوافق على <a href="#" class="text-green-600 hover:text-green-700">الشروط والأحكام</a> 
                و <a href="#" class="text-green-600 hover:text-green-700">سياسة الخصوصية</a> 
                وأتعهد بصحة جميع البيانات المقدمة
              </label>
            </div>
          </div>

          <!-- أزرار الحفظ -->
          <div class="flex justify-end space-x-4 space-x-reverse">
            <button 
              type="button" 
              @click="skipForNow"
              class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              تخطي الآن
            </button>
            <button 
              type="submit" 
              :disabled="saving"
              class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <span v-if="saving" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الحفظ...
              </span>
              <span v-else>حفظ بيانات المؤسسة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import api from '@/services/api.js'

export default {
  name: 'CompleteProfile',
  data() {
    return {
      saving: false,
      agreeTerms: false,
      companyData: {
        company_name: '',
        company_type: '',
        registration_number: '',
        tax_number: '',
        phone: '',
        email: '',
        website: '',
        industry: '',
        city: '',
        country: 'Saudi Arabia',
        address: ''
      },
      uploadedFiles: {
        commercial_register: null,
        tax_certificate: null,
        id_card: null
      }
    }
  },
  methods: {
    // async saveCompanyData() {
    //   if (!this.agreeTerms) {
    //     alert('يجب الموافقة على الشروط والأحكام');
    //     return;
    //   }

    //   this.saving = true;
    //   try {
    //     // حفظ بيانات المؤسسة
    //     const companyResult = await api.saveCompanyData(this.companyData);
        
    //     if (companyResult.success) {
    //       // حفظ اسم المؤسسة في localStorage
    //       localStorage.setItem('company_name', this.companyData.company_name);
          
    //       // رفع المستندات
    //       const files = Object.values(this.uploadedFiles).filter(file => file);
    //       if (files.length > 0) {
    //         await api.uploadCompanyDocuments(files, this.companyData.company_name);
    //       }

    //       alert('تم حفظ بيانات المؤسسة بنجاح!');
    //       this.$router.push('/vendor/dashboard');
    //     } else {
    //       alert('فشل في حفظ بيانات المؤسسة: ' + companyResult.error);
    //     }
    //   } catch (error) {
    //     console.error('خطأ في حفظ بيانات المؤسسة:', error);
    //     alert('حدث خطأ في حفظ بيانات المؤسسة');
    //   } finally {
    //     this.saving = false;
    //   }
    // },

    handleFileUpload(event, fileType) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFiles[fileType] = file;
      }
    },

    skipForNow() {
      if (confirm('هل أنت متأكد من تخطي إكمال الملف الشخصي؟ يمكنك إكماله لاحقاً من لوحة التحكم.')) {
        this.$router.push('/vendor/dashboard');
      }
    }
  }
}
</script> 