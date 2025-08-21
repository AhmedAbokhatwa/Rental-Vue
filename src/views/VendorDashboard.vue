<template>
  <div class="vendor-dashboard-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p class="loading-text">جاري تحميل بيانات المورد...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-card">
        <div class="error-icon">⚠️</div>
        <h3 class="error-title">حدث خطأ</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="loadData" class="btn btn-primary">
          إعادة المحاولة
        </button>
      </div>
    </div>

    <!-- Main Dashboard Content -->
    <div v-else>
      <!-- Use Modern Dashboard Component -->
      <ModernDashboard />
      
      <!-- Additional Vendor-Specific Content -->
      <div class="additional-content">
        <div class="container">
          <!-- User Information Card -->
          <div class="user-info-card">
            <div class="card-header">
              <h3 class="card-title">معلومات المورد</h3>
              <button @click="editUserInfo" class="btn btn-outline">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                تعديل المعلومات
              </button>
            </div>
            
            <div class="user-info-grid">
              <div class="info-item">
                <label class="info-label">اسم المورد</label>
                <p class="info-value">{{ currentUserInfo.name || 'غير محدد' }}</p>
              </div>
              <div class="info-item">
                <label class="info-label">البريد الإلكتروني</label>
                <p class="info-value">{{ currentUserInfo.email || 'غير محدد' }}</p>
              </div>
              <div class="info-item">
                <label class="info-label">رقم الهاتف</label>
                <p class="info-value">{{ currentUserInfo.phone || 'غير محدد' }}</p>
              </div>
              <div class="info-item">
                <label class="info-label">نوع المورد</label>
                <p class="info-value">{{ currentUserInfo.supplier_type || 'غير محدد' }}</p>
              </div>
              <div class="info-item">
                <label class="info-label">مجموعة الموردين</label>
                <p class="info-value">{{ currentUserInfo.supplier_group || 'غير محدد' }}</p>
              </div>
              <div class="info-item">
                <label class="info-label">الدولة</label>
                <p class="info-value">{{ currentUserInfo.country || 'غير محدد' }}</p>
              </div>
              <div class="info-item full-width">
                <label class="info-label">العنوان</label>
                <p class="info-value">{{ currentUserInfo.address || 'غير محدد' }}</p>
              </div>
              <div v-if="currentUserInfo.tax_number" class="info-item">
                <label class="info-label">الرقم الضريبي</label>
                <p class="info-value">{{ currentUserInfo.tax_number }}</p>
              </div>
              <div v-if="currentUserInfo.tax_id" class="info-item">
                <label class="info-label">الرقم الضريبي</label>
                <p class="info-value">{{ currentUserInfo.tax_id }}</p>
              </div>
            </div>
          </div>

          <!-- Equipment Management Section -->
          <div class="equipment-management-card">
            <div class="card-header">
              <h3 class="card-title">إدارة المعدات</h3>
              <router-link to="/add-equipment" class="btn btn-success">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                إضافة معدة جديدة
              </router-link>
            </div>
            
            <div class="equipment-content">
              <div v-if="equipmentLoading" class="loading-state">
                <div class="loading-spinner"></div>
                <p>جاري تحميل المعدات...</p>
              </div>
              
              <div v-else-if="equipment.length === 0" class="empty-state">
                <div class="empty-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h4 class="empty-title">لا توجد معدات مسجلة</h4>
                <p class="empty-description">ابدأ بإضافة أول معدة إلى مخزونك</p>
                <router-link to="/add-equipment" class="btn btn-primary">
                  إضافة أول معدة
                </router-link>
              </div>
              
              <div v-else class="equipment-grid">
                <div v-for="item in equipment" :key="item.name" class="equipment-card">
                  <div class="equipment-header">
                    <h4 class="equipment-name">{{ item.name || item.item_name || item.asset_name }}</h4>
                    <span :class="getStatusClass(item.status)" class="equipment-status">
                      {{ getStatusText(item.status) }}
                    </span>
                  </div>
                  
                  <div class="equipment-details">
                    <div class="detail-item">
                      <span class="detail-label">النوع:</span>
                      <span class="detail-value">{{ item.item_group || item.asset_category || 'غير محدد' }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-label">الموقع:</span>
                      <span class="detail-value">{{ item.location || 'غير محدد' }}</span>
                    </div>
                    <div v-if="item.standard_rate" class="detail-item">
                      <span class="detail-label">السعر:</span>
                      <span class="detail-value">{{ item.standard_rate }} ريال</span>
                    </div>
                    <div v-if="item.description" class="detail-item">
                      <span class="detail-label">الوصف:</span>
                      <span class="detail-value">{{ item.description }}</span>
                    </div>
                  </div>
                  
                  <div class="equipment-actions">
                    <button @click="viewEquipment(item)" class="btn btn-ghost">
                      <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getSupplierByEmail } from '@/services/api.js'
import ModernDashboard from '@/components/ModernDashboard.vue'

export default {
  name: 'VendorDashboard',
  components: {
    ModernDashboard
  },
  data() {
    return {
      loading: true,
      equipmentLoading: false,
      error: null,
      currentUserInfo: {},
      equipment: [],
      stats: {
        totalEquipment: 0,
        availableEquipment: 0,
        rentedEquipment: 0,
        totalRevenue: 0,
        maintenanceEquipment: 0
      }
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'currentUser', 'currentVendor', 'currentFrappeData'])
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    ...mapActions(['logoutUser']),
    
    async loadData() {
      this.loading = true;
      this.error = null;
      
      try {
        // تحميل معلومات المستخدم الحالي
        await this.loadCurrentUserInfo();

        // تحميل المعدات
        await this.loadEquipment();
        
        // حساب الإحصائيات
        this.calculateStats();
        
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        this.error = 'حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.';
      } finally {
        this.loading = false;
      }
    },

    async loadCurrentUserInfo() {
      try {
        // محاولة جلب معلومات المستخدم من Frappe
        if (this.currentFrappeData?.email) {
          const supplierData = await getSupplierByEmail(this.currentFrappeData.email);
          if (supplierData && supplierData.length > 0) {
            this.currentUserInfo = supplierData[0];
            return;
          }
        }

        // إذا لم نجد في Frappe، نستخدم البيانات المحفوظة
        if (this.currentFrappeData) {
          this.currentUserInfo = {
            name: this.currentFrappeData.supplier_name || this.currentFrappeData.name,
            email: this.currentFrappeData.email,
            phone: this.currentFrappeData.phone,
            supplier_type: this.currentFrappeData.supplier_type,
            supplier_group: this.currentFrappeData.supplier_group,
            country: this.currentFrappeData.country,
            address: this.currentFrappeData.address,
            tax_number: this.currentFrappeData.tax_number,
            tax_id: this.currentFrappeData.tax_id
          };
        } else if (this.currentVendor) {
          this.currentUserInfo = {
            name: this.currentVendor.name || this.currentVendor.supplier_name,
            email: this.currentVendor.email,
            phone: this.currentVendor.phone,
            supplier_type: this.currentVendor.supplier_type,
            supplier_group: this.currentVendor.supplier_group,
            country: this.currentVendor.country,
            address: this.currentVendor.address,
            tax_number: this.currentVendor.tax_number,
            tax_id: this.currentVendor.tax_id
          };
        } else {
          // بيانات افتراضية
          this.currentUserInfo = {
            name: 'المستخدم',
            email: 'غير محدد',
            phone: 'غير محدد',
            supplier_type: 'غير محدد',
            supplier_group: 'غير محدد',
            country: 'غير محدد',
            address: 'غير محدد'
          };
        }
      } catch (error) {
        console.error('خطأ في تحميل معلومات المستخدم:', error);
        // استخدام البيانات المحفوظة كبديل
        if (this.currentFrappeData) {
          this.currentUserInfo = {
            name: this.currentFrappeData.supplier_name || this.currentFrappeData.name,
            email: this.currentFrappeData.email,
            phone: this.currentFrappeData.phone,
            supplier_type: this.currentFrappeData.supplier_type,
            supplier_group: this.currentFrappeData.supplier_group,
            country: this.currentFrappeData.country,
            address: this.currentFrappeData.address,
            tax_number: this.currentFrappeData.tax_number,
            tax_id: this.currentFrappeData.tax_id
          };
        }
      }
    },

    async loadEquipment() {
      this.equipmentLoading = true;
      try {
        // محاولة جلب المعدات من Frappe
        const { getAssetsFromFrappe, getEquipmentItems } = await import('@/services/api.js');
        
        // جلب الأصول أولاً
        let assets = await getAssetsFromFrappe();
        if (assets && assets.length > 0) {
          this.equipment = assets;
          return;
        }

        // إذا لم نجد أصول، نجلب العناصر
        let items = await getEquipmentItems();
        if (items && items.length > 0) {
          this.equipment = items;
          return;
        }

        // إذا لم نجد أي شيء، نستخدم بيانات افتراضية
        this.equipment = [];
        
      } catch (error) {
        console.error('خطأ في تحميل المعدات:', error);
        this.equipment = [];
      } finally {
        this.equipmentLoading = false;
      }
    },

    calculateStats() {
      this.stats.totalEquipment = this.equipment.length;
      this.stats.availableEquipment = this.equipment.filter(item => 
        item.status === 'Available' || item.status === 'متاح' || item.status === 'Draft'
      ).length;
      this.stats.rentedEquipment = this.equipment.filter(item => 
        item.status === 'Rented' || item.status === 'قيد الإيجار'
      ).length;
      this.stats.maintenanceEquipment = this.equipment.filter(item => 
        item.status === 'Maintenance' || item.status === 'صيانة'
      ).length;
      
      // حساب الإيرادات (إذا كان متوفر)
      this.stats.totalRevenue = this.equipment.reduce((sum, item) => {
        const rate = parseFloat(item.standard_rate) || parseFloat(item.daily_rate) || 0;
        return sum + rate;
      }, 0);
    },

    getStatusClass(status) {
      const classes = {
        'Available': 'status-available',
        'متاح': 'status-available',
        'Draft': 'status-draft',
        'Rented': 'status-rented',
        'قيد الإيجار': 'status-rented',
        'Maintenance': 'status-maintenance',
        'صيانة': 'status-maintenance',
        'Unavailable': 'status-unavailable',
        'غير متاح': 'status-unavailable'
      };
      return classes[status] || 'status-unknown';
    },

    getStatusText(status) {
      const statusMap = {
        'Available': 'متاح',
        'Draft': 'مسودة',
        'Rented': 'مؤجر',
        'Maintenance': 'صيانة',
        'Unavailable': 'غير متاح'
      };
      return statusMap[status] || status || 'غير محدد';
    },

    viewEquipment(item) {
      console.log('عرض تفاصيل المعدة:', item);
      // يمكن إضافة صفحة لعرض تفاصيل المعدة
      alert(`عرض تفاصيل المعدة: ${item.name || item.item_name || item.asset_name}`);
    },

    editUserInfo() {
      console.log('تعديل معلومات المستخدم');
      // يمكن إضافة صفحة لتعديل معلومات المستخدم
      alert('سيتم إضافة صفحة تعديل المعلومات قريباً');
    }
  }
}
</script>

<style scoped>
.vendor-dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  padding: 2rem 0;
}

/* Loading States */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 77, 70, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid var(--color-secondary-light);
  border-top: 4px solid var(--color-secondary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin-top: 1.5rem;
  color: var(--color-secondary);
  font-size: 1.25rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--color-primary);
  background: var(--color-secondary-light);
  border-radius: 12px;
  border: 1px solid var(--color-primary);
}

/* Error States */
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.error-card {
  background: var(--color-secondary);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 20px 40px rgba(17, 77, 70, 0.2);
  max-width: 500px;
  border: 3px solid var(--color-primary);
  position: relative;
  overflow: hidden;
}

.error-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--gradient-primary);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.error-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: var(--color-primary-dark);
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1.125rem;
}

/* Additional Content */
.additional-content {
  margin-top: 2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Cards */
.user-info-card,
.equipment-management-card {
  background: var(--color-secondary);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(17, 77, 70, 0.1);
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  border: 2px solid var(--color-primary);
  position: relative;
  overflow: hidden;
}

.user-info-card::before,
.equipment-management-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: var(--gradient-primary);
}

.user-info-card:hover,
.equipment-management-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(17, 77, 70, 0.2);
  border-color: var(--color-primary-dark);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-primary);
}

.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  width: 20px;
  height: 20px;
  margin-left: 0.5rem;
}

/* User Info Grid */
.user-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: var(--color-secondary-light);
  border-radius: 12px;
  border: 1px solid var(--color-primary);
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(17, 77, 70, 0.15);
  border-color: var(--color-primary-dark);
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-dark);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.4;
}

/* Equipment Content */
.equipment-content {
  min-height: 200px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: var(--color-secondary-light);
  border-radius: 16px;
  border: 2px dashed var(--color-primary);
}

.empty-icon {
  width: 100px;
  height: 100px;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.empty-description {
  color: var(--color-primary-dark);
  margin-bottom: 2rem;
  font-size: 1.125rem;
  line-height: 1.6;
}

/* Equipment Grid */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.equipment-card {
  background: var(--color-secondary);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
  border: 2px solid var(--color-primary);
  position: relative;
  overflow: hidden;
}

.equipment-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.equipment-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(17, 77, 70, 0.2);
  border-color: var(--color-primary-dark);
}

.equipment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.equipment-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  flex: 1;
  margin-left: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.equipment-status {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-available {
  background: var(--gradient-primary);
  color: var(--color-secondary);
}

.status-draft {
  background: var(--color-secondary-light);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.status-rented {
  background: var(--gradient-primary);
  color: var(--color-secondary);
}

.status-maintenance {
  background: var(--color-secondary-light);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.status-unavailable {
  background: var(--color-secondary-light);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.status-unknown {
  background: var(--color-secondary-light);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.equipment-details {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-secondary-light);
  border-radius: 12px;
  border: 1px solid var(--color-primary);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(17, 77, 70, 0.1);
}

.detail-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.detail-label {
  font-size: 0.875rem;
  color: var(--color-primary-dark);
  font-weight: 600;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 700;
  text-align: left;
}

.equipment-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid var(--color-primary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .vendor-dashboard-page {
    padding: 1rem 0;
  }

  .user-info-card,
  .equipment-management-card {
    padding: 1.5rem;
  }

  .card-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .user-info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .equipment-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .equipment-header {
    flex-direction: column;
    gap: 0.75rem;
  }

  .equipment-name {
    margin-left: 0;
  }

  .detail-item {
    flex-direction: column;
    gap: 0.25rem;
  }

  .detail-value {
    text-align: right;
  }

  .info-item {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .user-info-card,
  .equipment-management-card {
    padding: 1rem;
  }

  .equipment-card {
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .equipment-name {
    font-size: 1.125rem;
  }
}
</style> 