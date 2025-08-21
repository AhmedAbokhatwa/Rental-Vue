<template>
  <div class="session-manager">
    <!-- Session Status Display -->
    <div v-if="showSessionInfo" class="fixed top-4 right-4 z-50">
      <div class="bg-white rounded-lg shadow-lg p-4 border-l-4" :class="sessionStatusClass">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-3 h-3 rounded-full mr-3" :class="sessionStatusDotClass"></div>
            <div>
              <h4 class="font-semibold text-sm">{{ sessionStatusTitle }}</h4>
              <p class="text-xs text-gray-600">{{ sessionStatusMessage }}</p>
            </div>
          </div>
          <button @click="showSessionInfo = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Session Debug Panel (Development Only) -->
    <div v-if="showDebugPanel" class="fixed bottom-4 left-4 z-50">
      <div class="bg-gray-900 text-white rounded-lg shadow-lg p-4 max-w-sm">
        <h4 class="font-semibold mb-2">معلومات الجلسة</h4>
        <div class="text-xs space-y-1">
          <div><strong>المصدر:</strong> {{ authSource || 'غير محدد' }}</div>
          <div><strong>الحالة:</strong> {{ isAuthenticated ? 'مسجل الدخول' : 'غير مسجل' }}</div>
          <div><strong>المستخدم:</strong> {{ currentUserName || 'غير محدد' }}</div>
          <div><strong>البريد:</strong> {{ currentUserEmail || 'غير محدد' }}</div>
          <div><strong>آخر تحديث:</strong> {{ lastUpdateTime }}</div>
        </div>
        <div class="mt-3 space-y-1">
          <button @click="refreshSession" class="w-full bg-blue-600 text-white px-2 py-1 rounded text-xs">
            تحديث الجلسة
          </button>
          <button @click="testFrappeConnection" class="w-full bg-green-600 text-white px-2 py-1 rounded text-xs">
            اختبار Frappe
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { checkFrappeSession } from '../services/auth.js'
import api from '../services/api.js'

export default {
  name: 'SessionManager',
  data() {
    return {
      showSessionInfo: false,
      showDebugPanel: process.env.NODE_ENV === 'development',
      sessionStatus: 'unknown', // 'active', 'expired', 'error'
      lastUpdateTime: new Date().toLocaleTimeString('ar-SA'),
      updateInterval: null
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'currentUser', 'currentVendor', 'currentFrappeData']),
    
    isAuthenticated() {
      return this.isLoggedIn || this.sessionStatus === 'active'
    },
    
    authSource() {
      if (this.currentFrappeData) return 'frappe'
      if (this.currentUser) return 'firebase'
      return null
    },
    
    currentUserName() {
      if (this.currentFrappeData) {
        return this.currentFrappeData.supplier_name || this.currentFrappeData.name
      }
      if (this.currentVendor) {
        return this.currentVendor.name || this.currentVendor.supplier_name
      }
      if (this.currentUser) {
        return this.currentUser.displayName
      }
      return null
    },
    
    currentUserEmail() {
      if (this.currentFrappeData) {
        return this.currentFrappeData.email_id
      }
      if (this.currentVendor) {
        return this.currentVendor.email
      }
      if (this.currentUser) {
        return this.currentUser.email
      }
      return null
    },
    
    sessionStatusClass() {
      switch (this.sessionStatus) {
        case 'active':
          return 'border-green-500'
        case 'expired':
          return 'border-red-500'
        case 'error':
          return 'border-yellow-500'
        default:
          return 'border-gray-500'
      }
    },
    
    sessionStatusDotClass() {
      switch (this.sessionStatus) {
        case 'active':
          return 'bg-green-500'
        case 'expired':
          return 'bg-red-500'
        case 'error':
          return 'bg-yellow-500'
        default:
          return 'bg-gray-500'
      }
    },
    
    sessionStatusTitle() {
      switch (this.sessionStatus) {
        case 'active':
          return 'الجلسة نشطة'
        case 'expired':
          return 'انتهت صلاحية الجلسة'
        case 'error':
          return 'خطأ في الجلسة'
        default:
          return 'حالة الجلسة غير معروفة'
      }
    },
    
    sessionStatusMessage() {
      switch (this.sessionStatus) {
        case 'active':
          return `مرحباً ${this.currentUserName || 'المستخدم'}`
        case 'expired':
          return 'يرجى تسجيل الدخول مرة أخرى'
        case 'error':
          return 'حدث خطأ في الاتصال'
        default:
          return 'جاري التحقق من الجلسة...'
      }
    }
  },
  
  async mounted() {
    // await this.checkSessionStatus()
    this.startSessionMonitoring()
  },
  
  beforeUnmount() {
    this.stopSessionMonitoring()
  },
  
  methods: {
    // async checkSessionStatus() {
    //   try {
    //     console.log('🔍 فحص حالة الجلسة...')
        
    //     // التحقق من جلسة Frappe
    //     const frappeSession = await checkFrappeSession()
    //     console.log('frappeSession',frappeSession)
    //     if (frappeSession) {
    //         console.log('✅ جلسة Frappe نشطة')
    //         this.sessionStatus = 'active'
    //         this.showSessionInfo = true
    //       setTimeout(() => {
    //         this.showSessionInfo = false
    //       }, 3000)
    //     } else if (this.isLoggedIn) {
    //       console.log('✅ جلسة Firebase نشطة')
    //       this.sessionStatus = 'active'
    //     } else {
    //       console.log('❌ لا توجد جلسة نشطة')
    //       this.sessionStatus = 'expired'
    //     }
        
    //     this.lastUpdateTime = new Date().toLocaleTimeString('ar-SA')
        
    //   } catch (error) {
    //     console.error('❌ خطأ في فحص حالة الجلسة:', error)
    //     this.sessionStatus = 'error'
    //   }
    // },
    
    startSessionMonitoring() {
      // فحص الجلسة كل 5 دقائق
      this.updateInterval = setInterval(() => {
        // this.checkSessionStatus()
      }, 5 * 60 * 1000)
    },
    
    stopSessionMonitoring() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval)
        this.updateInterval = null
      }
    },
    
    async refreshSession() {
      console.log('🔄 تحديث الجلسة...')
      // await this.checkSessionStatus()
    },
    
    async testFrappeConnection() {
      try {
        console.log('🧪 اختبار الاتصال بـ Frappe...')
        const result = await api.testConnection()
        
        if (result.success) {
          alert('✅ الاتصال بـ Frappe يعمل بشكل صحيح')
        } else {
          alert('❌ فشل في الاتصال بـ Frappe: ' + result.error)
        }
      } catch (error) {
        console.error('❌ خطأ في اختبار الاتصال:', error)
        alert('❌ خطأ في اختبار الاتصال: ' + error.message)
      }
    }
  },
  
  watch: {
    // مراقبة تغييرات حالة تسجيل الدخول
    isLoggedIn(newValue) {
      if (newValue) {
        this.sessionStatus = 'active'
      } else {
        this.sessionStatus = 'expired'
      }
    }
  }
}
</script>

<style scoped>
.session-manager {
  /* Component styles */
}
</style> 