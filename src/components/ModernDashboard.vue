<template>
  <div class="modern-dashboard">
    <!-- Header Section -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="welcome-section">
          <h1 class="welcome-title">مرحباً، {{ displayUserName }}</h1>
          <p class="welcome-subtitle">إليك نظرة عامة على نشاطك اليوم</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" @click="refreshData">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            تحديث البيانات
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
              <div class="stat-card" v-for="stat in stats" :key="stat.id">
          <div class="stat-icon">
            <!-- إجمالي المعدات -->
            <svg v-if="stat.id === 1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <!-- المعدات المتاحة -->
            <svg v-else-if="stat.id === 2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <!-- المعدات المؤجرة -->
            <svg v-else-if="stat.id === 3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <!-- الإيرادات الشهرية -->
            <svg v-else-if="stat.id === 4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-change" :class="stat.changeClass">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
              <span>{{ stat.change }}</span>
            </div>
          </div>
        </div>
    </div>

    <!-- Main Content Grid -->
    <div class="dashboard-grid">
      <!-- Equipment Overview -->
      <div class="dashboard-card equipment-overview">
        <div class="card-header">
          <h3 class="card-title">نظرة عامة على المعدات</h3>
          <router-link to="/equipment" class="card-action">
            عرض الكل
            <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </router-link>
        </div>
        
        <div class="equipment-stats">
          <div class="equipment-stat">
            <div class="stat-circle available">
              <span class="stat-number">{{ stats.availableEquipment }}</span>
              <span class="stat-text">متاح</span>
            </div>
          </div>
          <div class="equipment-stat">
            <div class="stat-circle rented">
              <span class="stat-number">{{ stats.rentedEquipment }}</span>
              <span class="stat-text">مؤجر</span>
            </div>
          </div>
          <div class="equipment-stat">
            <div class="stat-circle maintenance">
              <span class="stat-number">{{ stats.maintenanceEquipment }}</span>
              <span class="stat-text">صيانة</span>
            </div>
          </div>
        </div>

        <div class="equipment-list">
          <div v-for="item in recentEquipment" :key="item.id" class="equipment-item">
            <div class="equipment-info">
              <div class="equipment-name">{{ item.name }}</div>
              <div class="equipment-status" :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </div>
            </div>
            <div class="equipment-actions">
              <button class="action-btn" @click="viewEquipment(item)">
                <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="dashboard-card recent-activity">
        <div class="card-header">
          <h3 class="card-title">النشاط الأخير</h3>
          <button class="card-action" @click="loadMoreActivity">
            المزيد
          </button>
        </div>
        
        <div class="activity-timeline">
          <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
            <div class="activity-icon">
              <!-- إضافة معدة جديدة -->
              <svg v-if="activity.id === 1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <!-- طلب إيجار جديد -->
              <svg v-else-if="activity.id === 2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <!-- تذكير الصيانة -->
              <svg v-else-if="activity.id === 3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="activity-content">
              <div class="activity-title">{{ activity.title }}</div>
              <div class="activity-description">{{ activity.description }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="dashboard-card quick-actions">
        <div class="card-header">
          <h3 class="card-title">إجراءات سريعة</h3>
        </div>
        
        <div class="actions-grid">
          <router-link to="/add-equipment" class="action-card">
            <div class="action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </div>
            <div class="action-text">إضافة معدة</div>
          </router-link>
          
          <router-link to="/equipment" class="action-card">
            <div class="action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <div class="action-text">إدارة المعدات</div>
          </router-link>
          
          <router-link to="/reports" class="action-card">
            <div class="action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="action-text">التقارير</div>
          </router-link>
          
          <router-link to="/settings" class="action-card">
            <div class="action-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <div class="action-text">الإعدادات</div>
          </router-link>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="dashboard-card revenue-chart">
        <div class="card-header">
          <h3 class="card-title">الإيرادات الشهرية</h3>
          <div class="chart-period">
            <button class="period-btn active">شهري</button>
            <button class="period-btn">سنوي</button>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="chart-placeholder">
            <svg class="chart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
            </svg>
            <p class="chart-text">سيتم إضافة الرسم البياني قريباً</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ModernDashboard',
  data() {
    return {
      loading: false,
      stats: [
        {
          id: 1,
          label: 'إجمالي المعدات',
          value: '24',
          change: '+12%',
          changeClass: 'positive',
          icon: 'CubeIcon',
          iconClass: 'bg-blue-100 text-blue-600',
          changeIcon: 'TrendingUpIcon'
        },
        {
          id: 2,
          label: 'المعدات المتاحة',
          value: '18',
          change: '+8%',
          changeClass: 'positive',
          icon: 'CheckCircleIcon',
          iconClass: 'bg-green-100 text-green-600',
          changeIcon: 'TrendingUpIcon'
        },
        {
          id: 3,
          label: 'المعدات المؤجرة',
          value: '5',
          change: '+2',
          changeClass: 'positive',
          icon: 'ClockIcon',
          iconClass: 'bg-yellow-100 text-yellow-600',
          changeIcon: 'TrendingUpIcon'
        },
        {
          id: 4,
          label: 'الإيرادات الشهرية',
          value: '45,000 ريال',
          change: '+15%',
          changeClass: 'positive',
          icon: 'CurrencyDollarIcon',
          iconClass: 'bg-purple-100 text-purple-600',
          changeIcon: 'TrendingUpIcon'
        }
      ],
      recentEquipment: [
        {
          id: 1,
          name: 'حفار JCB',
          status: 'Available'
        },
        {
          id: 2,
          name: 'رافعة شوكية',
          status: 'Rented'
        },
        {
          id: 3,
          name: 'مولد كهربائي',
          status: 'Maintenance'
        }
      ],
      recentActivity: [
        {
          id: 1,
          title: 'تم إضافة معدة جديدة',
          description: 'تم إضافة حفار JCB إلى المخزون',
          time: 'منذ 2 ساعة',
          icon: 'PlusIcon',
          iconClass: 'bg-green-100 text-green-600'
        },
        {
          id: 2,
          title: 'طلب إيجار جديد',
          description: 'طلب العميل أحمد إيجار رافعة شوكية',
          time: 'منذ 4 ساعات',
          icon: 'UserIcon',
          iconClass: 'bg-blue-100 text-blue-600'
        },
        {
          id: 3,
          title: 'تذكير الصيانة',
          description: 'مولد كهربائي بحاجة للصيانة الدورية',
          time: 'منذ 6 ساعات',
          icon: 'ExclamationIcon',
          iconClass: 'bg-yellow-100 text-yellow-600'
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
    }
  },
  methods: {
    async refreshData() {
      this.loading = true
      try {
        // Simulate data refresh
        await new Promise(resolve => setTimeout(resolve, 1000))
        // Update stats here
      } catch (error) {
        console.error('خطأ في تحديث البيانات:', error)
      } finally {
        this.loading = false
      }
    },
    getStatusClass(status) {
      const classes = {
        'Available': 'status-available',
        'Rented': 'status-rented',
        'Maintenance': 'status-maintenance'
      }
      return classes[status] || 'status-unknown'
    },
    getStatusText(status) {
      const statusMap = {
        'Available': 'متاح',
        'Rented': 'مؤجر',
        'Maintenance': 'صيانة'
      }
      return statusMap[status] || status
    },
    viewEquipment(item) {
      console.log('عرض المعدة:', item)
    },
    loadMoreActivity() {
      console.log('تحميل المزيد من النشاطات')
    }
  }
}
</script>

<style scoped>
.modern-dashboard {
  padding: 2rem;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  min-height: 100vh;
}

/* Header Section */
.dashboard-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.welcome-section {
  flex: 1;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: var(--color-primary-dark);
  font-weight: 500;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: var(--color-secondary);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(17, 77, 70, 0.1);
  border: 2px solid var(--color-primary);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--gradient-primary);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(17, 77, 70, 0.2);
  border-color: var(--color-primary-dark);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: var(--gradient-primary);
  box-shadow: 0 8px 20px rgba(17, 77, 70, 0.3);
}

.stat-icon svg {
  width: 30px;
  height: 30px;
  color: var(--color-secondary);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 1rem;
  color: var(--color-primary-dark);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 700;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  width: fit-content;
}

.stat-change.positive {
  background: var(--color-secondary-light);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.stat-change.negative {
  background: var(--color-secondary-light);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.stat-change svg {
  width: 16px;
  height: 16px;
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.dashboard-card {
  background: var(--color-secondary);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(17, 77, 70, 0.1);
  border: 2px solid var(--color-primary);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--gradient-primary);
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(17, 77, 70, 0.2);
  border-color: var(--color-primary-dark);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-primary);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: var(--color-secondary-light);
  border: 1px solid var(--color-primary);
}

.card-action:hover {
  background: var(--color-primary);
  color: var(--color-secondary);
  transform: translateY(-2px);
}

.action-icon {
  width: 20px;
  height: 20px;
}

/* Equipment Overview */
.equipment-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-secondary-light);
  border-radius: 16px;
  border: 1px solid var(--color-primary);
}

.equipment-stat {
  text-align: center;
}

.stat-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  box-shadow: 0 8px 20px rgba(17, 77, 70, 0.2);
  border: 3px solid var(--color-secondary);
}

.stat-circle.available {
  background: var(--gradient-primary);
  color: var(--color-secondary);
}

.stat-circle.rented {
  background: var(--color-secondary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.stat-circle.maintenance {
  background: var(--color-secondary-light);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1;
}

.stat-text {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Equipment List */
.equipment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.equipment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--color-secondary-light);
  border-radius: 12px;
  border: 1px solid var(--color-primary);
  transition: all 0.3s ease;
}

.equipment-item:hover {
  transform: translateX(-5px);
  box-shadow: 0 8px 20px rgba(17, 77, 70, 0.15);
  border-color: var(--color-primary-dark);
}

.equipment-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.equipment-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
}

.equipment-status {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  width: fit-content;
}

.equipment-status.available {
  background: var(--gradient-primary);
  color: var(--color-secondary);
}

.equipment-status.rented {
  background: var(--color-secondary-light);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.equipment-status.maintenance {
  background: var(--color-secondary-light);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.equipment-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border-radius: 8px;
  background: var(--color-secondary);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: var(--color-primary);
  color: var(--color-secondary);
  transform: scale(1.1);
}

/* Recent Activity */
.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--color-secondary-light);
  border-radius: 12px;
  border: 1px solid var(--color-primary);
  transition: all 0.3s ease;
}

.activity-item:hover {
  transform: translateX(-5px);
  box-shadow: 0 8px 20px rgba(17, 77, 70, 0.15);
  border-color: var(--color-primary-dark);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  box-shadow: 0 4px 12px rgba(17, 77, 70, 0.3);
  flex-shrink: 0;
}

.activity-icon svg {
  width: 20px;
  height: 20px;
  color: var(--color-secondary);
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
}

.activity-description {
  font-size: 0.875rem;
  color: var(--color-primary-dark);
  line-height: 1.4;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--color-primary-dark);
  font-weight: 500;
}

/* Quick Actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1rem;
  background: var(--color-secondary-light);
  border-radius: 16px;
  border: 2px solid var(--color-primary);
  text-decoration: none;
  color: var(--color-primary);
  transition: all 0.3s ease;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(17, 77, 70, 0.2);
  border-color: var(--color-primary-dark);
  background: var(--color-primary);
  color: var(--color-secondary);
}

.action-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  box-shadow: 0 8px 20px rgba(17, 77, 70, 0.3);
}

.action-icon svg {
  width: 25px;
  height: 25px;
  color: var(--color-secondary);
}

.action-text {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Revenue Chart */
.chart-period {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: var(--color-secondary-light);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.period-btn.active,
.period-btn:hover {
  background: var(--color-primary);
  color: var(--color-secondary);
}

.chart-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  color: var(--color-primary-dark);
}

.chart-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.chart-text {
  font-size: 1rem;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modern-dashboard {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .equipment-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stat-card,
  .dashboard-card {
    padding: 1.5rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
