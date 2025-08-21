  <template>
    <nav class="modern-navbar" :class="{ 'navbar-scrolled': isScrolled }">
      <div class="nav-container">
        <!-- Logo Section -->
        <div class="logo-section">
          <router-link to="/" class="logo-link">
            <div class="logo-icon">
              <img src="../jameel-logo.png" alt="Logo" class="logo-image" />
            </div>
            <div class="logo-text">
              <span class="logo-title">نظام المعدات</span>
              <span class="logo-subtitle">إدارة وتأجير المعدات</span>
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="nav-links desktop-nav">
          <router-link 
            v-for="link in navigationLinks" 
            :key="link.path"
            :to="link.path" 
            class="nav-link"
            :class="{ 'active': $route.path === link.path }"
          >
            <span class="nav-text">{{ link.name }}</span>
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="user-menu">
          <!-- Notifications -->
          <div class="notifications-dropdown" v-if="isLoggedIn">
            <button class="notification-btn" @click="toggleNotifications">
              <svg class="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75a6 6 0 0012 0V9.75a6 6 0 00-6-6z"></path>
              </svg>
              <span v-if="notificationCount > 0" class="notification-badge">{{ notificationCount }}</span>
            </button>
            
            <!-- Notifications Dropdown -->
            <div v-if="showNotifications" class="notifications-panel">
              <div class="notifications-header">
                <h3>الإشعارات</h3>
                <button @click="markAllAsRead" class="mark-all-read">تحديد الكل كمقروء</button>
              </div>
              <div class="notifications-list">
                <div v-for="notification in notifications" :key="notification.id" class="notification-item">
                  <div class="notification-content">
                    <p class="notification-text">{{ notification.message }}</p>
                    <span class="notification-time">{{ notification.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- User Profile -->
          <div v-if="isLoggedIn" class="user-profile">
            <button class="profile-btn" @click="toggleUserMenu">
              <div class="profile-avatar">
                <div class="avatar-placeholder">
                  {{ displayUserName.charAt(0) }}
                </div>
              </div>
              <div class="profile-info">
                <span class="profile-name">{{ displayUserName }}</span>
                <span class="profile-role">{{ userRole }}</span>
              </div>
              <svg class="dropdown-arrow" :class="{ 'rotated': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <!-- User Menu Dropdown -->
            <div v-if="showUserMenu" class="user-menu-panel">
              <div class="menu-section">
                <router-link to="/vendor/dashboard" class="menu-item">
                  <span>لوحة التحكم</span>
                </router-link>
                <router-link to="/profile" class="menu-item">
                  <span>الملف الشخصي</span>
                </router-link>
                <router-link to="/settings" class="menu-item">
                  <span>الإعدادات</span>
                </router-link>
              </div>
              <div class="menu-divider"></div>
              <div class="menu-section">
                <button @click="logout" class="menu-item logout-item">
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Auth Buttons -->
          <div v-else class="auth-buttons">
            <router-link to="/login" class="btn btn-ghost">
              تسجيل الدخول
            </router-link>
            <router-link to="/register-vendor" class="btn btn-primary">
              تسجيل كمورد
            </router-link>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <svg class="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div v-if="showMobileMenu" class="mobile-nav">
        <div class="mobile-nav-links">
          <router-link 
            v-for="link in navigationLinks" 
            :key="link.path"
            :to="link.path" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path === link.path }"
            @click="closeMobileMenu"
          >
            <span>{{ link.name }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ModernNavbar',
  data() {
    return {
      isScrolled: false,
      showUserMenu: false,
      showNotifications: false,
      showMobileMenu: false,
      notificationCount: 3,
      notifications: [
        {
          id: 1,
          message: 'تم إضافة معدة جديدة بنجاح',
          time: 'منذ 5 دقائق'
        },
        {
          id: 2,
          message: 'طلب إيجار جديد من العميل أحمد',
          time: 'منذ ساعة'
        },
        {
          id: 3,
          message: 'تذكير: معدة بحاجة للصيانة',
          time: 'منذ 3 ساعات'
        }
      ],
      navigationLinks: [
        {
          name: 'الرئيسية',
          path: '/'
        },
        {
          name: 'المعدات',
          path: '/equipment'
        },
        {
          name: 'إضافة معدة',
          path: '/add-equipment'
        },
        {
          name: 'لوحة التحكم',
          path: '/vendor/dashboard'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'currentUser', 'currentVendor', 'currentFrappeData']),
    displayUserName() {
      if (this.currentFrappeData?.supplier_name) {
        return this.currentFrappeData.supplier_name
      }
      if (this.currentVendor?.name) {
        return this.currentVendor.name
      }
      if (this.currentUser?.displayName) {
        return this.currentUser.displayName
      }
      return 'المستخدم'
    },
    userRole() {
      return 'مورد'
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    ...mapActions(['logoutUser']),
    handleScroll() {
      this.isScrolled = window.scrollY > 20
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
      this.showNotifications = false
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      this.showUserMenu = false
    },
    toggleMobileMenu() {
      this.showMobileMenu = !this.showMobileMenu
    },
    closeMobileMenu() {
      this.showMobileMenu = false
    },
    markAllAsRead() {
      this.notificationCount = 0
      this.showNotifications = false
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showUserMenu = false
        this.showNotifications = false
      }
    },
    async logout() {
      try {
        await this.logoutUser()
        this.$router.push('/')
        this.showUserMenu = false
      } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error)
      }
    }
  }
}
</script>

<style scoped>
.modern-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--color-primary);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(247, 246, 225, 0.2);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.navbar-scrolled {
  background: var(--color-primary);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Logo Section */
.logo-section {
  flex-shrink: 0;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  overflow: hidden;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-secondary);
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.logo-subtitle {
  font-size: 0.75rem;
  color: rgba(247, 246, 225, 0.9);
  line-height: 1.2;
}

/* Desktop Navigation */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  color: rgba(247, 246, 225, 0.9);
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--color-secondary);
  background: rgba(247, 246, 225, 0.1);
  transform: translateY(-1px);
}

.nav-link.active {
  color: var(--color-secondary);
  background: rgba(247, 246, 225, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-text {
  font-size: 0.875rem;
}

/* User Menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Notifications */
.notifications-dropdown {
  position: relative;
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  color: rgba(247, 246, 225, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-btn:hover {
  background: rgba(247, 246, 225, 0.1);
  color: var(--color-secondary);
}

.notification-icon {
  width: 24px;
  height: 24px;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--color-primary);
  color: var(--color-secondary);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.notifications-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  min-width: 320px;
  background: var(--color-secondary);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-primary);
  margin-top: 0.5rem;
  z-index: 1000;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.notifications-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
}

.mark-all-read {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid var(--color-primary);
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: var(--color-secondary-light);
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-content {
  flex: 1;
}

.notification-text {
  font-size: 0.875rem;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--color-primary-dark);
}

/* User Profile */
.user-profile {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-btn:hover {
  background: rgba(247, 246, 225, 0.1);
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.125rem;
}

.profile-info {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.profile-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-secondary);
}

.profile-role {
  font-size: 0.75rem;
  color: rgba(247, 246, 225, 0.8);
}

.dropdown-arrow {
  width: 16px;
  height: 16px;
  color: rgba(247, 246, 225, 0.8);
  transition: transform 0.2s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.user-menu-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  min-width: 240px;
  background: var(--color-secondary);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--color-primary);
  margin-top: 0.5rem;
  z-index: 1000;
}

.menu-section {
  padding: 0.5rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-item:hover {
  background: var(--color-secondary-light);
  color: var(--color-primary);
}

.menu-divider {
  height: 1px;
  background: var(--color-primary);
  margin: 0.5rem 0;
}

.logout-item {
  color: var(--color-primary);
}

.logout-item:hover {
  background: var(--color-secondary-light);
  color: var(--color-primary-dark);
}

/* Auth Buttons */
.auth-buttons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-ghost {
  color: rgba(247, 246, 225, 0.9);
  background: none;
  border: 1px solid rgba(247, 246, 225, 0.3);
}

.btn-ghost:hover {
  background: rgba(247, 246, 225, 0.1);
  color: var(--color-secondary);
}

.btn-primary {
  background: rgba(247, 246, 225, 0.2);
  color: var(--color-secondary);
  border: 1px solid rgba(247, 246, 225, 0.3);
}

.btn-primary:hover {
  background: rgba(247, 246, 225, 0.3);
  transform: translateY(-1px);
}

/* Mobile Menu */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  color: rgba(247, 246, 225, 0.9);
  cursor: pointer;
}

.menu-icon {
  width: 24px;
  height: 24px;
}

.mobile-nav {
  display: none;
  background: var(--color-secondary);
  border-top: 1px solid var(--color-primary);
  padding: 1rem;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-primary);
  font-weight: 500;
  transition: all 0.2s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  background: var(--color-secondary-light);
  color: var(--color-primary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .desktop-nav,
  .user-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-nav {
    display: block;
  }

  .logo-subtitle {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 0.5rem;
  }

  .logo-title {
    font-size: 1rem;
  }
}
</style>
