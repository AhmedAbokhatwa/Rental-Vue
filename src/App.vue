<template>
  <div id="app" class="modern-app">
    <!-- Modern Navigation -->
    <ModernNavbar />
    
    <!-- Main Content with Top Padding for Fixed Navbar -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Session Manager (Development Only) -->
    <SessionManager v-if="isDevelopment" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SessionManager from './components/SessionManager.vue'
import ModernNavbar from './components/ModernNavbar.vue'

export default {
  name: 'App',
  components: {
    SessionManager,
    ModernNavbar
  },
  data() {
    return {
      authSource: null,
      isDevelopment: process.env.NODE_ENV === 'development'
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'currentUser', 'currentVendor', 'currentFrappeData'])
  },
  methods: {
    ...mapActions(['logoutUser', 'checkAuthOnPageLoad']),
    async checkAuthStatus() {
      try {
        // أولاً، تحقق من جلسة Frappe
        const frappeSession = await this.$auth?.checkFrappeSession()
        if (frappeSession) {
          this.authSource = 'frappe'
          return
        }

        // ثانياً، تحقق من حالة Vuex
        if (this.isLoggedIn) {
          this.authSource = 'vuex'
          return
        }

        // ثالثاً، تحقق من الجلسة المحفوظة
        await this.checkAuthOnPageLoad()
        this.authSource = 'stored'
      } catch (error) {
        console.error('خطأ في فحص حالة المصادقة:', error)
      }
    },
    updateAuthStatus() {
      this.checkAuthStatus()
    },
    clearAuthStatus() {
      this.authSource = null
    }
  },
  async mounted() {
    await this.checkAuthStatus()
  },
  watch: {
    isLoggedIn(newVal) {
      if (newVal) {
        this.updateAuthStatus()
      } else {
        this.clearAuthStatus()
      }
    }
  }
}
</script> 

<style>
/* Global Styles */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

        /* Modern App Layout */
        .modern-app {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
        }

.main-content {
  padding-top: 70px; /* Height of fixed navbar */
  min-height: calc(100vh - 70px);
}

/* RTL Support */
body {
  direction: rtl;
  text-align: right;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: var(--color-primary);
  background-color: var(--color-secondary);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-secondary);
  border-radius: var(--radius-md);
}

::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary-dark);
}

/* Focus Styles */
.focus-ring:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Animation Classes */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Loading States */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-secondary);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 10000;
  max-width: 400px;
}

.toast {
  background: var(--color-secondary);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-right: 4px solid;
  animation: slideInRight 0.3s ease;
}

.toast.success {
  border-color: var(--color-success);
}

.toast.error {
  border-color: var(--color-error);
}

.toast.warning {
  border-color: var(--color-warning);
}

.toast.info {
  border-color: var(--color-primary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding-top: 60px;
  }
  
  .toast-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .modern-app {
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  }
  
  body {
    background-color: var(--color-primary);
    color: var(--color-secondary);
  }
  
  .loading-overlay {
    background: rgba(17, 77, 70, 0.9);
  }
}

/* Print Styles */
@media print {
  .modern-navbar,
  .mobile-menu-btn,
  .btn,
  .action-btn {
    display: none !important;
  }
  
  .main-content {
    padding-top: 0;
  }
  
  .dashboard-card,
  .stat-card {
    box-shadow: none;
    border: 1px solid #e2e8f0;
  }
}
</style> 