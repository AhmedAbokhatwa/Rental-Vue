<template>
  <div class="login-page">
    <!-- Background Pattern -->
    <div class="background-pattern"></div>
    
    <!-- Main Container -->
    <div class="login-container">
      <!-- Left Side - Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="logo-section">
            <img src="../jameel-logo.png" alt="Logo" class="welcome-logo" />
            <h1 class="welcome-title">نظام إدارة المعدات</h1>
            <p class="welcome-subtitle">منصة متكاملة لإدارة وتأجير المعدات</p>
          </div>
          
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="feature-text">
                <h3>تسجيل دخول آمن</h3>
                <p>حماية متقدمة لحسابك وبياناتك</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div class="feature-text">
                <h3>إدارة سريعة</h3>
                <p>واجهة سهلة الاستخدام لإدارة المعدات</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="feature-text">
                <h3>تقارير مفصلة</h3>
                <p>إحصائيات شاملة عن نشاطك</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Side - Login Form -->
      <div class="login-section">
        <div class="login-card">
          <div class="login-header">
            <h2 class="login-title">تسجيل الدخول</h2>
            <p class="login-subtitle">أدخل بياناتك للوصول إلى حسابك</p>
          </div>
          
          <form @submit.prevent="login" class="login-form">
            <div class="form-group">
              <label for="username" class="form-label">اسم المستخدم أو البريد الإلكتروني</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <input 
                  type="text" 
                  id="username" 
                  v-model="form.username"
                  class="form-input"
                  placeholder="أدخل اسم المستخدم أو البريد الإلكتروني"
                  required
                >
              </div>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">كلمة المرور</label>
              <div class="input-wrapper">
                <svg class="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                <input 
                  type="password" 
                  id="password" 
                  v-model="form.password"
                  class="form-input"
                  placeholder="أدخل كلمة المرور"
                  required
                >
              </div>
            </div>

            <div class="form-options">
              <label class="checkbox-wrapper">
                <input type="checkbox" v-model="rememberMe" class="checkbox-input">
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">تذكرني</span>
              </label>
              <button 
                type="button"
                @click="showForgotPassword = true"
                class="forgot-link"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
            
            <button 
              type="submit" 
              :disabled="isLoading"
              class="login-btn"
            >
              <span v-if="isLoading" class="btn-content">
                <svg class="loading-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري تسجيل الدخول...
              </span>
              <span v-else class="btn-content">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                تسجيل الدخول
              </span>
            </button>
            
            <div class="divider">
              <span class="divider-text">أو</span>
            </div>
            
            <button 
              type="button"
              @click="loginWithGoogle"
              :disabled="googleLoading"
              class="google-btn"
            >
              <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span v-if="googleLoading">جاري تسجيل الدخول...</span>
              <span v-else>تسجيل الدخول بـ Google</span>
            </button>
          </form>

          <div class="register-section">
            <p class="register-text">ليس لديك حساب؟</p>
            <div class="register-buttons">
              <router-link to="/register" class="register-btn primary">
                إنشاء حساب جديد
              </router-link>
              <button @click="showRegister = true" class="register-btn secondary">
                إنشاء حساب مورد سريع
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Modal -->
    <div v-if="showRegister" class="modal-overlay" @click="closeRegister">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">تسجيل مورد جديد</h3>
          <button @click="closeRegister" class="modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="register" class="modal-form">
          <!-- بيانات المورد الشخصية -->
          <div class="form-section">
            <h4 class="section-title">البيانات الشخصية</h4>
            <div class="form-grid">
              <div class="form-group">
                <label for="regName" class="form-label">الاسم الكامل</label>
                <input 
                  type="text" 
                  id="regName" 
                  v-model="registerForm.name"
                  class="form-input"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="regEmail" class="form-label">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  id="regEmail" 
                  v-model="registerForm.email"
                  class="form-input"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="regPhone" class="form-label">رقم الجوال</label>
                <input 
                  type="tel" 
                  id="regPhone" 
                  v-model="registerForm.phone"
                  class="form-input"
                  placeholder="05xxxxxxxx"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="regPassword" class="form-label">كلمة المرور</label>
                <input 
                  type="password" 
                  id="regPassword" 
                  v-model="registerForm.password"
                  class="form-input"
                  required
                >
              </div>
            </div>
          </div>

          <!-- بيانات المؤسسة -->
          <div class="form-section">
            <h4 class="section-title">بيانات المؤسسة</h4>
            <div class="form-grid">
              <div class="form-group">
                <label for="companyName" class="form-label">اسم المؤسسة</label>
                <input 
                  type="text" 
                  id="companyName" 
                  v-model="registerForm.company_name"
                  class="form-input"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="companyType" class="form-label">نوع المؤسسة</label>
                <select 
                  id="companyType" 
                  v-model="registerForm.company_type"
                  class="form-input"
                  required
                >
                  <option value="">اختر نوع المؤسسة</option>
                  <option value="Private Limited">شركة محدودة المسؤولية</option>
                  <option value="Sole Proprietorship">مؤسسة فردية</option>
                  <option value="Partnership">شركة تضامن</option>
                  <option value="Corporation">شركة مساهمة</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="registrationNumber" class="form-label">رقم السجل التجاري</label>
                <input 
                  type="text" 
                  id="registrationNumber" 
                  v-model="registerForm.registration_number"
                  class="form-input"
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="taxNumber" class="form-label">الرقم الضريبي</label>
                <input 
                  type="text" 
                  id="taxNumber" 
                  v-model="registerForm.tax_number"
                  class="form-input"
                  required
                >
              </div>
              
              <div class="form-group full-width">
                <label for="address" class="form-label">العنوان</label>
                <textarea 
                  id="address" 
                  v-model="registerForm.address"
                  rows="3"
                  class="form-input"
                  required
                ></textarea>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeRegister" class="btn-secondary">
              إلغاء
            </button>
            <button type="submit" :disabled="registerLoading" class="btn-primary">
              <span v-if="registerLoading">جاري التسجيل...</span>
              <span v-else>تسجيل المورد</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Forgot Password Modal -->
    <div v-if="showForgotPassword" class="modal-overlay" @click="showForgotPassword = false">
      <div class="modal-content small" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">استرداد كلمة المرور</h3>
          <button @click="showForgotPassword = false" class="modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="resetPassword" class="modal-form">
          <p class="modal-description">أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور</p>
          
          <div class="form-group">
            <label for="forgotEmail" class="form-label">البريد الإلكتروني</label>
            <input 
              v-model="forgotPasswordEmail"
              type="email" 
              id="forgotEmail"
              class="form-input"
              placeholder="أدخل بريدك الإلكتروني"
              required
            >
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showForgotPassword = false" class="btn-secondary">
              إلغاء
            </button>
            <button type="submit" :disabled="resetPasswordLoading" class="btn-primary">
              <span v-if="resetPasswordLoading">جاري الإرسال...</span>
              <span v-else>إرسال رابط الاسترداد</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { authAPI } from '@/services/auth'

export default {
  name: 'LoginPage',
  setup() {
    const store = useStore()
    const router = useRouter()

    // بيانات النماذج
    const form = reactive({ username: '', password: '' })
    const registerForm = reactive({
      name: '',
      email: '',
      phone: '',
      password: '',
      company_name: '',
      company_type: '',
      registration_number: '',
      tax_number: '',
      address: '',
      agreeTerms: false
    })
    const uploadedFiles = reactive({
      commercial_register: null,
      tax_certificate: null,
      id_card: null
    })
    const forgotPasswordEmail = ref('')

    // حالات التحميل والواجهات
    const loading = ref(false)
    const googleLoading = ref(false)
    const registerLoading = ref(false)
    const resetPasswordLoading = ref(false)
    const showRegister = ref(false)
    const showForgotPassword = ref(false)
    const rememberMe = ref(false)
    const successMessage = ref('')
    const errorMessage = ref('')

    // getters
    const isLoggedIn = computed(() => store.getters.isLoggedIn)

    // دوال
    const login = async () => {
      loading.value = true
      successMessage.value = ''
      errorMessage.value = ''
      try {
        const requestLogin = await authAPI.login(form.username, form.password)
        if (requestLogin) {
          successMessage.value = 'تم تسجيل الدخول بنجاح'
          store.commit('SET_LOGGED_IN', true)
          router.push('/add-equipment')
        } else {
          errorMessage.value = 'فشل تسجيل الدخول، تحقق من بياناتك'
        }
      } catch (err) {
        errorMessage.value = 'حدث خطأ: ' + err.message
      } finally {
        loading.value = false
      }
    }

    const loginWithGoogle = async () => {
      googleLoading.value = true
      try {
        const result = await store.dispatch('loginWithGoogle')
        if (result.success) {
          if (rememberMe.value) localStorage.setItem('remember_me', 'true')
          router.push('/vendor/dashboard')
        } else {
          alert('فشل تسجيل الدخول بـ Google: ' + result.error)
        }
      } catch (err) {
        alert('حدث خطأ في تسجيل الدخول بـ Google: ' + err.message)
      } finally {
        googleLoading.value = false
      }
    }

    const register = async () => {
      registerLoading.value = true
      try {
        const vendorData = { ...registerForm }
        const result = await store.dispatch('registerVendor', vendorData)
        if (result.success) {
          alert('تم تسجيل المورد بنجاح!')
          closeRegister()
          router.push('/vendor/dashboard')
        } else {
          alert('فشل في تسجيل المورد: ' + result.error)
        }
      } catch (err) {
        alert('حدث خطأ في التسجيل: ' + err.message)
      } finally {
        registerLoading.value = false
      }
    }

    const closeRegister = () => {
      showRegister.value = false
      Object.keys(registerForm).forEach(key => registerForm[key] = '')
      Object.keys(uploadedFiles).forEach(key => uploadedFiles[key] = null)
    }

    const resetPassword = async () => {
      resetPasswordLoading.value = true
      try {
        const result = await store.dispatch('resetPassword', { email: forgotPasswordEmail.value })
        if (result.success) {
          alert('تم إرسال رابط استرداد كلمة المرور')
          showForgotPassword.value = false
          forgotPasswordEmail.value = ''
        } else {
          alert('فشل في إرسال رابط استرداد كلمة المرور: ' + result.error)
        }
      } catch (err) {
        alert('حدث خطأ في إرسال رابط استرداد كلمة المرور: ' + err.message)
      } finally {
        resetPasswordLoading.value = false
      }
    }

    return {
      form,
      registerForm,
      uploadedFiles,
      forgotPasswordEmail,
      loading,
      googleLoading,
      registerLoading,
      resetPasswordLoading,
      showRegister,
      showForgotPassword,
      rememberMe,
      successMessage,
      errorMessage,
      isLoggedIn,
      login,
      loginWithGoogle,
      register,
      closeRegister,
      resetPassword
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(17, 77, 70, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(17, 77, 70, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1200px;
  width: 100%;
  background: var(--color-secondary);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(17, 77, 70, 0.2);
  overflow: hidden;
  border: 3px solid var(--color-primary);
  position: relative;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: var(--gradient-primary);
  z-index: 1;
}

/* Welcome Section */
.welcome-section {
  background: var(--gradient-primary);
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.welcome-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(247, 246, 225, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(247, 246, 225, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.welcome-content {
  text-align: center;
  color: var(--color-secondary);
  z-index: 1;
  position: relative;
}

.logo-section {
  margin-bottom: 3rem;
}

.welcome-logo {
  width: 120px;
  height: 120px;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1.25rem;
  font-weight: 500;
  opacity: 0.9;
  line-height: 1.6;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(247, 246, 225, 0.1);
  border-radius: 16px;
  border: 1px solid rgba(247, 246, 225, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-2px);
  background: rgba(247, 246, 225, 0.15);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: rgba(247, 246, 225, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
  color: var(--color-secondary);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.feature-text h3 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-secondary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.feature-text p {
  font-size: 0.875rem;
  color: var(--color-secondary);
  opacity: 0.8;
  line-height: 1.4;
}

/* Login Section */
.login-section {
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-secondary);
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.login-subtitle {
  font-size: 1rem;
  color: var(--color-primary-dark);
  font-weight: 500;
  line-height: 1.6;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  width: 20px;
  height: 20px;
  color: var(--color-primary-dark);
  z-index: 1;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--color-secondary);
  color: var(--color-primary);
  transition: all 0.3s ease;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-dark);
  box-shadow: 0 0 0 3px rgba(17, 77, 70, 0.1);
  transform: translateY(-1px);
}

.form-input::placeholder {
  color: var(--color-primary-dark);
  opacity: 0.7;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-primary);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  background: var(--color-secondary);
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-secondary);
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 500;
}

.forgot-link {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  transition: all 0.3s ease;
}

.forgot-link:hover {
  color: var(--color-primary-dark);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: var(--gradient-primary);
  color: var(--color-secondary);
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(17, 77, 70, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(17, 77, 70, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.loading-icon {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-primary);
  opacity: 0.3;
}

.divider-text {
  padding: 0 1rem;
  font-size: 0.875rem;
  color: var(--color-primary-dark);
  font-weight: 500;
  background: var(--color-secondary);
}

.google-btn {
  width: 100%;
  padding: 1rem;
  background: var(--color-secondary);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(17, 77, 70, 0.1);
}

.google-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(17, 77, 70, 0.2);
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.google-icon {
  width: 24px;
  height: 24px;
}

.register-section {
  margin-top: 2rem;
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--color-primary);
  opacity: 0.7;
}

.register-text {
  font-size: 0.875rem;
  color: var(--color-primary-dark);
  margin-bottom: 1rem;
  font-weight: 500;
}

.register-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.register-btn {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.register-btn.primary {
  background: var(--gradient-primary);
  color: var(--color-secondary);
  box-shadow: 0 2px 8px rgba(17, 77, 70, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.register-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(17, 77, 70, 0.3);
}

.register-btn.secondary {
  background: var(--color-secondary);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.register-btn.secondary:hover {
  background: var(--color-primary);
  color: var(--color-secondary);
  transform: translateY(-1px);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 77, 70, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.modal-content {
  background: var(--color-secondary);
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(17, 77, 70, 0.3);
  border: 3px solid var(--color-primary);
  position: relative;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--gradient-primary);
  border-radius: 20px 20px 0 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-primary);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--color-secondary-light);
  color: var(--color-primary-dark);
}

.modal-close svg {
  width: 24px;
  height: 24px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: #114d46;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: hsl(173, 64%, 18%);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    margin: 1rem;
    border-radius: 16px;
  }

  .welcome-section {
    padding: 2rem;
    order: 2;
  }

  .login-section {
    padding: 2rem;
    order: 1;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .feature-item {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .login-container {
    margin: 0.5rem;
    border-radius: 12px;
  }

  .welcome-section,
  .login-section {
    padding: 1.5rem;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style> 
