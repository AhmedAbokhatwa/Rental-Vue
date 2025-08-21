<template>
  <div class="equipment-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">المعدات</h1>
            <p class="page-subtitle">إدارة وعرض جميع المعدات المتاحة</p>
          </div>
          <div class="header-actions">
            <router-link to="/add-equipment" class="btn btn-primary">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              إضافة معدة جديدة
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Controls -->
    <div class="filters-section">
      <div class="container">
        <div class="filters-content">
          <div class="filters-left">
            <button 
              @click="loadEquipment"
              :disabled="loading"
              class="btn btn-outline"
            >
              <svg v-if="loading" class="btn-icon animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              تحديث
            </button>
            
            <button 
              @click="toggleFilter"
              :class="[
                'btn',
                filterBySupplier ? 'btn-primary' : 'btn-outline'
              ]"
            >
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"></path>
              </svg>
              {{ filterBySupplier ? 'عرض معداتي فقط' : 'عرض جميع المعدات'}}
            </button>
          </div>
          
          <div class="filters-right">
            <div class="search-box">
              <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                v-model="searchQuery"
                type="text"
                placeholder="البحث في المعدات..."
                class="search-input"
              >
            </div>
            
            <button 
              @click="showDebugInfo = !showDebugInfo"
              class="btn btn-ghost"
            >
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              معلومات التصحيح
            </button>
          </div>
        </div>

        <!-- Debug Information -->
        <div v-if="showDebugInfo" class="debug-panel">
          <h4 class="debug-title">معلومات التصحيح:</h4>
          <div class="debug-grid">
            <div class="debug-item">
              <span class="debug-label">اسم المورد:</span>
              <span class="debug-value">{{ currentSupplierName }}</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">البريد الإلكتروني:</span>
              <span class="debug-value">{{ getAuth().currentUser?.email || localStorage.getItem('vendor_email') }}</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">frappe_supplier_name:</span>
              <span class="debug-value">{{ localStorage.getItem('frappe_supplier_name') }}</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">عدد المعدات:</span>
              <span class="debug-value">{{ filteredEquipment.length }}</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">حالة التحميل:</span>
              <span class="debug-value">{{ loading ? 'جاري التحميل' : 'مكتمل' }}</span>
            </div>
            <div class="debug-item">
              <span class="debug-label">التصفية حسب المورد:</span>
              <span class="debug-value">{{ filterBySupplier ? 'مفعلة' : 'معطلة' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">جاري تحميل المعدات...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <div class="error-card">
            <div class="error-icon">⚠️</div>
            <h3 class="error-title">حدث خطأ</h3>
            <p class="error-message">{{ error }}</p>
            <button @click="loadEquipment" class="btn btn-primary">
              إعادة المحاولة
            </button>
          </div>
        </div>

        <!-- Equipment List -->
        <div v-else>
          <!-- Results Summary -->
          <div class="results-summary">
            <div class="summary-info">
              <h3 class="summary-title">قائمة المعدات</h3>
              <p class="summary-count">{{ filteredEquipment.length }} معدة</p>
            </div>
            <div class="summary-actions">
              <div class="view-toggle">
                <button 
                  @click="viewMode = 'grid'"
                  :class="['toggle-btn', viewMode === 'grid' ? 'active' : '']"
                >
                  <svg class="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                </button>
                <button 
                  @click="viewMode = 'list'"
                  :class="['toggle-btn', viewMode === 'list' ? 'active' : '']"
                >
                  <svg class="toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredEquipment.length === 0" class="empty-state">
            <div class="empty-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            <h3 class="empty-title">لا توجد معدات</h3>
            <p class="empty-description">لم يتم العثور على أي معدات. ابدأ بإضافة معدة جديدة.</p>
            <router-link to="/add-equipment" class="btn btn-primary">
              إضافة معدة جديدة
            </router-link>
          </div>

          <!-- Equipment Grid View -->
          <div v-else-if="viewMode === 'grid'" class="equipment-grid">
            <div v-for="item in filteredEquipment" :key="item.name" class="equipment-card">
              <div class="card-header">
                <h4 class="equipment-name">{{ item.asset_name || item.item_name || item.name }}</h4>
                <span :class="getStatusClass(item.status)" class="equipment-status">
                  {{ getStatusText(item.status) }}
                </span>
              </div>
              
              <div class="card-content">
                <div class="equipment-details">
                  <div class="detail-row">
                    <span class="detail-label">النوع:</span>
                    <span class="detail-value">{{ item.asset_category || item.item_group || 'غير محدد' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">الموقع:</span>
                    <span class="detail-value">{{ item.location || 'غير محدد' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">المعرف:</span>
                    <span class="detail-value">{{ item.name }}</span>
                  </div>
                  <div v-if="item.description" class="detail-row">
                    <span class="detail-label">الوصف:</span>
                    <span class="detail-value">{{ item.description }}</span>
                  </div>
                </div>
              </div>
              
              <div class="card-actions">
                <button @click="viewEquipment(item)" class="btn btn-primary btn-sm">
                  <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  عرض التفاصيل
                </button>
              </div>
            </div>
          </div>

          <!-- Equipment List View -->
          <div v-else class="equipment-list">
            <div class="list-header">
              <div class="header-cell">اسم المادة</div>
              <div class="header-cell">فئة الأصل</div>
              <div class="header-cell">الموقع</div>
              <div class="header-cell">المعرف</div>
              <div class="header-cell">الحالة</div>
              <div class="header-cell">الإجراءات</div>
            </div>
            
            <div class="list-body">
              <div v-for="item in filteredEquipment" :key="item.name" class="list-item">
                <div class="list-item-name">{{ item.asset_name || item.item_name || item.name }}</div>
                <div class="list-item-value">{{ item.asset_category || item.item_group || 'غير محدد' }}</div>
                <div class="list-item-value">{{ item.location || 'غير محدد' }}</div>
                <div class="list-item-value">{{ item.name }}</div>
                <div class="list-item-value">
                  <span :class="getStatusClass(item.status)" class="status-badge">
                    {{ getStatusText(item.status) }}
                  </span>
                </div>
                <div class="list-item-actions">
                  <button @click="viewEquipment(item)" class="action-btn">
                    <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    عرض
                  </button>
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
import { getAssetsFromFrappe, getEquipmentItems , getEquipmentBySupplier} from '../services/api.js';
import { gwGetAssets } from '@/services/gateway.js';
import { getAuth } from 'firebase/auth';

export default {
  name: 'EquipmentPage',
  data() {
    return {
      equipment: [],
      loading: true,
      error: null,
      showDebugInfo: false,
      filterBySupplier: false,
      searchQuery: '',
      viewMode: 'grid' // 'grid' or 'list'
    };
  },
  computed: {
    currentSupplierName() {
      try {
        // أولاً: من localStorage
        const fromLS = localStorage.getItem('frappe_supplier_name')
        if (fromLS && fromLS !== 'المورد الحالي' && fromLS !== 'Supplier') {
          return fromLS
        }
        
        // ثانياً: من store
        const fromStore = this.$store?.getters?.currentFrappeData?.supplier_name || this.$store?.getters?.currentVendor?.name
        if (fromStore) {
          return fromStore
        }
        
        // ثالثاً: من Firebase user
        const user = getAuth().currentUser
        if (user?.displayName) {
          return user.displayName
        }
        
        return fromLS || ''
      } catch (e) {
        return localStorage.getItem('frappe_supplier_name') || ''
      }
    },
    filteredEquipment() {
      let filtered = this.equipment;
      
      console.log('item filtered',filtered)
      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(item => {
          const name = (item.asset_name || item.item_name || item.name || '').toLowerCase();
          const description = (item.description || '').toLowerCase();
          const category = (item.asset_category || item.item_group || '').toLowerCase();
          const location = (item.location || '').toLowerCase();
          return name.includes(query) || 
                 description.includes(query) || 
                 category.includes(query) || 
                 location.includes(query);
        });
      }
      
      return filtered;
    }
  },
  async mounted() {
    await this.loadEquipment();
  },
  methods: {
    async loadEquipment() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🔧 بدء تحميل المعدات...');
        const user = getAuth().currentUser;
        const email = user?.email || localStorage.getItem('vendor_email');
        const supplierName = this.currentSupplierName;
        
        console.log('🔍 معلومات التصفية:', {
          email,
          supplierName,
          frappe_supplier_name: localStorage.getItem('frappe_supplier_name'),
          currentUser: user?.displayName
        });
        
        // // محاولة جلب الأصول عبر Gateway أولاً
        // try {
        //   const gwAssets = await gwGetAssets();
        //   let list = Array.isArray(gwAssets) ? gwAssets : [];
          
        //   console.log('📊 إجمالي الأصول من Gateway:', list.length);
        //   console.log('Asstets  Details from Gateway ', list);
        //   console.log('filtter is work or no', this.filterBySupplier);
        //   // تطبيق التصفية فقط إذا كانت مفعلة
        //   if (this.filterBySupplier && supplierName) {

        //     const filteredBySupplier = list.filter(a => a.supplier === supplierName);
        //     console.log('filttered List**', filteredBySupplier);

        //     console.log('filttered Counts', filteredBySupplier.length);

        //     list = filteredBySupplier;
        //   } else if (this.filterBySupplier && email) {
        //     const filteredByEmail = list.filter(a => (a.owner_email || a.email_id || '').includes(email));
        //     console.log('📊 الأصول المطابقة للبريد:', filteredByEmail.length);
        //     list = filteredByEmail;
        //   }
          
        //   // عرض جميع الأصول أولاً بدون تصفية
        //   if (list.length > 0) {
        //     console.log('✅ تم تحميل الأصول عبر Gateway:', list);
        //     this.equipment = list;
        //   }
        // } catch (e) {
        //   console.warn('⚠️ فشل تحميل الأصول عبر Gateway، سيتم استخدام اتصال مباشر:', e?.message);
        // }

        // 2) if Getway failed try to connect with frappe
           console.log('this.filterBySupplier 1 => Frappe',this.filterBySupplier)
          if(!this.filterBySupplier){
            try {
              console.log('🔄 محاولة الاتصال المباشر بـ Frappe...');
              const assetsResult = await getAssetsFromFrappe();
              
              if (assetsResult.success && assetsResult.data.length > 0) {
                let list = assetsResult.data;
                console.log('📊 Frappe Connect', list.length);
                console.log('📊 Asstets Dets Frappe:', list);
              
  
                console.log('supplierName => Frappe',supplierName)
                console.log('this.filterBySupplier 2 => Frappe',this.filterBySupplier)
                // تطبيق التصفية فقط إذا كانت مفعلة
                if (this.filterBySupplier && supplierName) {
  
                  const filteredBySupplier = list.filter(a => a.supplier === supplierName);
                  console.log('📊 filter L => Frappe ', filteredBySupplier);
                  console.log(' L Count  ', filteredBySupplier.length);
                  list = filteredBySupplier;
  
                } else if (this.filterBySupplier && email) {
  
                  const filteredByEmail = list.filter(a => (a.owner_email || a.email_id || '').includes(email));
  
                  console.log('📊 Asset Filted By owner email ', filteredByEmail.length);
  
                  list = filteredByEmail;
                }
                
                // عرض جميع الأصول أولاً بدون تصفية
                console.log('✅ تم تحميل الأصول مباشرة من Frappe:', list);
                this.equipment = list;
              }
            } catch (e) {
              console.error('❌ فشل الاتصال المباشر بـ Frappe:', e);
            }

          }else{
             this.equipment = [];
              console.log('supplier is ',supplierName)
              const result = await getEquipmentBySupplier(supplierName)
              console.log('resssssss',result.data.data)
              this.equipment = result.data.data

          } 


          //   // 3) إن لم توجد أصول، نجرب جلب الأصناف
          //   if (!this.equipment?.length) {
          //     console.log('⚠️ لم يتم العثور على أصول، محاولة جلب الأصناف...');
          //     const itemsResult = await getEquipmentItems();
          //     if (itemsResult.success && itemsResult.data.length > 0) {
          //       let list = itemsResult.data;
          //       // لا يوجد حقل supplier عادة في Item؛ نستخدم البريد كمرجع تقريبي فقط
          //       if (email) list = list.filter(i => (i.owner || i.owner_email || '').includes(email))
          //       console.log('✅ تم تحميل الأصناف:', list);
          //       this.equipment = list;
          //   } else {
          //       console.log('⚠️ لم يتم العثور على معدات');
          //       this.equipment = [];
          //     }

          //   }
          // } catch (error) {
          //   console.error('❌ خطأ في تحميل المعدات:', error);
          //   this.error = 'حدث خطأ في تحميل المعدات. يرجى المحاولة مرة أخرى.';
          //   this.equipment = [];
      } finally {
        this.loading = false;
      }
    },
    
    toggleFilter() {
      this.filterBySupplier = !this.filterBySupplier;
      this.loadEquipment(); // Reload equipment with the new filter
    },

    getStatusClass(status) {
      const statusMap = {
        'Submitted': 'status-submitted',
        'Draft': 'status-draft',
        'Cancelled': 'status-cancelled',
        'Sold': 'status-sold',
        'Available': 'status-available',
        'In Use': 'status-in-use',
        'Maintenance': 'status-maintenance'
      };
      return statusMap[status] || 'status-unknown';
    },
    
    getStatusText(status) {
      const statusMap = {
        'Submitted': 'مقدم',
        'Draft': 'مسودة',
        'Cancelled': 'ملغي',
        'Sold': 'مباع',
        'Available': 'متاح',
        'In Use': 'قيد الاستخدام',
        'Maintenance': 'صيانة'
      };
      return statusMap[status] || status || 'غير محدد';
    },
    
    viewEquipment(item) {
      console.log('عرض المادة:', item);
      // يمكن إضافة منطق لعرض تفاصيل المادة
      alert(`عرض تفاصيل: ${item.asset_name || item.item_name || item.name}`);
    }
  }
};
</script>

<style scoped>
.equipment-page {
  min-height: 100vh;
  background: var(--color-gray-50);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Page Header */
.page-header {
  background: var(--color-secondary);
  border-bottom: 2px solid var(--color-primary);
  padding: 2rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--color-primary-dark);
  font-weight: 500;
  line-height: 1.6;
}

.btn-icon {
  width: 20px;
  height: 20px;
  margin-left: 0.5rem;
}

/* Filters Section */
.filters-section {
  background: var(--color-secondary-light);
  border-bottom: 1px solid var(--color-primary);
  padding: 1.5rem 0;
}

.filters-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filters-left {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filters-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  right: 1rem;
  width: 20px;
  height: 20px;
  color: var(--color-primary-dark);
}

.search-input {
  padding: 0.75rem 1rem;
  padding-right: 3rem;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-secondary);
  color: var(--color-primary);
  transition: all 0.3s ease;
  min-width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary-dark);
  box-shadow: 0 0 0 3px rgba(17, 77, 70, 0.1);
}

.search-input::placeholder {
  color: var(--color-primary-dark);
}

/* Debug Panel */
.debug-panel {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--color-secondary);
  border-radius: 12px;
  border: 1px solid var(--color-primary);
}

.debug-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.debug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.debug-label {
  font-size: 0.875rem;
  color: var(--color-primary-dark);
  font-weight: 500;
}

.debug-value {
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 600;
}

/* Main Content */
.main-content {
  padding: 2rem 0;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.loading-text {
  margin-top: 1rem;
  color: var(--color-gray-600);
  font-size: 1.125rem;
}

/* Error State */
.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.error-card {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  box-shadow: var(--shadow-lg);
  max-width: 500px;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.error-message {
  color: var(--color-gray-600);
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Results Summary */
.results-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-secondary);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-primary);
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
}

.summary-count {
  color: var(--color-primary-dark);
  font-size: 0.875rem;
  font-weight: 500;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  padding: 0.5rem;
  border: 1px solid var(--color-gray-200);
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.toggle-icon {
  width: 20px;
  height: 20px;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: var(--color-gray-400);
  margin-bottom: 1.5rem;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.empty-description {
  color: var(--color-gray-600);
  margin-bottom: 2rem;
  max-width: 400px;
}

/* Equipment Grid */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.equipment-card {
  background: var(--color-secondary);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid var(--color-primary);
}

.equipment-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-primary-dark);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-primary);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.equipment-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-primary);
  flex: 1;
  margin-left: 1rem;
}

.equipment-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-submitted {
  background: var(--color-primary-100);
  color: var(--color-primary-800);
}

.status-draft {
  background: var(--color-primary-100);
  color: var(--color-primary-800);
}

.status-cancelled {
  background: var(--color-primary-100);
  color: var(--color-primary-800);
}

.status-sold {
  background: var(--color-primary-100);
  color: var(--color-primary-800);
}

.status-available {
  background: var(--color-primary-100);
  color: var(--color-primary-800);
}

.status-in-use {
  background: var(--color-primary-100);
  color: var(--color-primary-800);
}

.status-maintenance {
  background: var(--color-primary-100);
  color: var(--color-primary-800);
}

.status-unknown {
  background: var(--color-primary-100);
  color: var(--color-primary-800);
}

.card-content {
  padding: 1.5rem;
}

.equipment-details {
  space-y: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.detail-label {
  font-size: 0.875rem;
  color: var(--color-primary-dark);
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 600;
  text-align: left;
}

.card-actions {
  padding: 1.5rem;
  border-top: 1px solid var(--color-primary);
  display: flex;
  justify-content: flex-end;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Equipment List */
.equipment-list {
  background: var(--color-secondary);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--color-primary);
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--color-secondary-light);
  border-bottom: 1px solid var(--color-primary);
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.875rem;
}

.list-body {
  space-y: 0;
}

.list-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-primary);
  transition: background 0.2s ease;
}

.list-item:hover {
  background: var(--color-secondary-light);
}

.list-item:last-child {
  border-bottom: none;
}

.list-item-name {
  font-weight: 600;
  color: var(--color-primary);
}

.list-item-value {
  color: var(--color-primary-dark);
  font-weight: 500;
}

.list-item-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--color-primary-dark);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--color-secondary-light);
  color: var(--color-primary);
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .filters-content {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left,
  .filters-right {
    justify-content: center;
  }

  .search-input {
    width: 100%;
  }

  .results-summary {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .equipment-grid {
    grid-template-columns: 1fr;
  }

  .list-header,
  .list-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .list-header {
    display: none;
  }

  .list-item {
    padding: 0.5rem 0;
  }

  .debug-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
  }

  .equipment-card {
    margin: 0 1rem;
  }

  .card-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .equipment-name {
    margin-left: 0;
  }
}
</style>