<template>
  <div class="add-equipment-page">
    <div class="container">
      <div class="content-wrapper">
        <h2 class="page-title">إضافة معدة جديدة</h2>
        
        <!-- Progress Steps -->
        <div class="progress-section">
          <div class="progress-steps">
            <div class="step-item">
              <div class="step-number" :class="{ 'active': currentStep >= 1 }">
                1
              </div>
              <span class="step-label" :class="{ 'active': currentStep >= 1 }">
                إنشاء العنصر (Item)
              </span>
            </div>
            <div class="step-connector"></div>
            <div class="step-item">
              <div class="step-number" :class="{ 'active': currentStep >= 2 }">
                2
              </div>
              <span class="step-label" :class="{ 'active': currentStep >= 2 }">
                إنشاء الأصل (Asset)
              </span>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="error" class="error-message">
          <div class="error-content">
            <svg class="error-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="error-label">خطأ:</span>
            <span class="error-text">{{ error }}</span>
          </div>
        </div>

        <!-- Success Display -->
        <div v-if="successMessage" class="success-message">
          <div class="success-content">
            <svg class="success-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="success-label">نجح:</span>
            <span class="success-text">{{ successMessage }}</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">جاري تحميل البيانات من Frappe...</p>
        </div>

        <!-- Step 1: Create Item -->
        <div v-else-if="currentStep === 1" class="form-card">
          <h3 class="form-title">الخطوة الأولى: إنشاء عنصر المعدة (Item)</h3>
          
          <form @submit.prevent="createItem" class="form-content">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">رمز العنصر (Item Code) *</label>
                <input 
                  v-model="itemForm.item_code"
                  type="text" 
                  class="form-input"
                  placeholder="مثال: CAT320D-SN-001"
                  required
                >
                <p class="form-hint">رمز فريد للعنصر - لا يمكن تكراره</p>
              </div>
              
              <div class="form-group">
                <label class="form-label">اسم المعدة (Item Name) *</label>
                <input 
                  v-model="itemForm.item_name"
                  type="text" 
                  class="form-input"
                  placeholder="مثال: CAT320D-SN-001 حفار"
                  required
                >
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">فئة الأصل (Asset Category) *</label>
                <div class="select-wrapper">
                  <select 
                    v-model="itemForm.asset_category"
                    class="form-select"
                    required
                    :disabled="loadingCategories"
                  >
                    <option value="">اختر فئة الأصل</option>
                    <option v-for="category in assetCategories" :key="category.name" :value="category.name">
                      {{ category.asset_category_name || category.name }}
                    </option>
                  </select>
                  <button 
                    v-if="!loadingCategories"
                    @click="loadAssetCategories" 
                    type="button"
                    class="refresh-btn"
                  >
                    <svg class="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                  <div v-if="loadingCategories" class="loading-indicator">
                    <div class="spinner"></div>
                  </div>
                </div>
                <p class="form-hint">يتم جلب الفئات من Frappe</p>
              </div>

              <div class="form-group">
                <label class="form-label">مجموعة العنصر (Item Group) *</label>
                <div class="select-wrapper">
                  <select 
                    v-model="itemForm.item_group"
                    class="form-select"
                    required
                    :disabled="loadingItemGroups"
                  >
                    <option value="">اختر مجموعة العنصر</option>
                    <option v-for="group in itemGroups" :key="group.name" :value="group.name">
                      {{ group.item_group_name || group.name }}
                    </option>
                  </select>
                  <button 
                    v-if="!loadingItemGroups"
                    @click="loadItemGroups" 
                    type="button"
                    class="refresh-btn"
                  >
                    <svg class="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                  <div v-if="loadingItemGroups" class="loading-indicator">
                    <div class="spinner"></div>
                  </div>
                </div>
                <p class="form-hint">يتم جلب المجموعات من Frappe</p>
              </div>
            </div>

            <!-- معلومات إضافية للمعدة -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">الموقع (Location) *</label>
                <div class="select-wrapper">
                  <select 
                    v-model="itemForm.location"
                    class="form-select"
                    required
                    :disabled="loadingLocations"
                  >
                    <option value="">اختر الموقع</option>
                    <option v-for="location in locations" :key="location.name" :value="location.name">
                      {{ location.location_name || location.name }}
                    </option>
                  </select>
                  <button 
                    v-if="!loadingLocations"
                    @click="loadLocations" 
                    type="button"
                    class="refresh-btn"
                  >
                    <svg class="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                  <div v-if="loadingLocations" class="loading-indicator">
                    <div class="spinner"></div>
                  </div>
                </div>
                <p class="form-hint">يتم جلب المواقع من Frappe</p>
              </div>

              <div class="form-group">
                <label class="form-label">مالك الأصل (Asset Owner) *</label>
                <div class="select-wrapper">
                  <select 
                    v-model="itemForm.asset_owner"
                    class="form-select"
                    required
                    :disabled="loadingAssetOwners"
                  >
                    <option value="">اختر مالك الأصل</option>
                    <option v-for="owner in assetOwners" :key="owner.name" :value="owner.name">
                      {{ owner.asset_owner_name || owner.name }}
                    </option>
                  </select>
                  <button 
                    v-if="!loadingAssetOwners"
                    @click="loadAssetOwners" 
                    type="button"
                    class="refresh-btn"
                  >
                    <svg class="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                  <div v-if="loadingAssetOwners" class="loading-indicator">
                    <div class="spinner"></div>
                  </div>
                </div>
                <p class="form-hint">يتم جلب مالكي الأصول من Frappe</p>
              </div>
            </div>

            <!-- معلومات مالية -->
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">تاريخ الشراء (Purchase Date) *</label>
                <input 
                  v-model="itemForm.purchase_date"
                  type="date" 
                  class="form-input"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">تاريخ الاستخدام (Available for Use Date) *</label>
                <input 
                  v-model="itemForm.available_for_use_date"
                  type="date" 
                  class="form-input"
                  required
                >
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">المبلغ الإجمالي (Gross Purchase Amount) *</label>
                <input 
                  v-model="itemForm.gross_purchase_amount"
                  type="number" 
                  step="0.01"
                  class="form-input"
                  placeholder="0.00"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">المبلغ الصافي (Net Purchase Amount)</label>
                <input 
                  v-model="itemForm.net_purchase_amount"
                  type="number" 
                  step="0.01"
                  class="form-input"
                  placeholder="0.00"
                >
              </div>
            </div>

            <!-- خيارات إضافية -->
            <div class="form-options">
              <div class="option-group">
                <label class="checkbox-label">
                  <input 
                    v-model="itemForm.is_stock_item"
                    type="checkbox" 
                    class="checkbox-input"
                    :value="1"
                  >
                  <span class="checkbox-custom"></span>
                  عنصر مخزون (Stock Item)
                </label>
              </div>
              
              <div class="option-group">
                <label class="checkbox-label">
                  <input 
                    v-model="itemForm.is_fixed_asset"
                    type="checkbox" 
                    class="checkbox-input"
                    :value="1"
                    checked
                  >
                  <span class="checkbox-custom"></span>
                  أصل ثابت (Fixed Asset)
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="creatingItem"
              >
                <span v-if="creatingItem" class="btn-loading"></span>
                {{ creatingItem ? 'جاري الإنشاء...' : 'إنشاء العنصر' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 2: Create Asset -->
        <div v-else-if="currentStep === 2" class="form-card">
          <h3 class="form-title">الخطوة الثانية: إنشاء الأصل (Asset)</h3>
          
          <div class="step-info">
            <div class="info-card">
              <h4 class="info-title">معلومات العنصر المُنشأ</h4>
              <div class="info-content">
                <div class="info-row">
                  <span class="info-label">رمز العنصر:</span>
                  <span class="info-value">{{ createdItem.name || createdItem.item_code }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">اسم العنصر:</span>
                  <span class="info-value">{{ createdItem.item_name }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">فئة الأصل:</span>
                  <span class="info-value">{{ createdItem.asset_category }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <form @submit.prevent="createAsset" class="form-content">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">اسم الأصل (Asset Name) *</label>
                <input 
                  v-model="assetForm.asset_name"
                  type="text" 
                  class="form-input"
                  :placeholder="createdItem.item_name || 'اسم الأصل'"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">المورد (Supplier) *</label>
                <input 
                  v-model="assetForm.supplier"
                  type="text" 
                  class="form-input"
                  :placeholder="currentSupplierName"
                  required
                >
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">الموقع (Location) *</label>
                <div class="select-wrapper">
                  <select 
                    v-model="assetForm.location"
                    class="form-select"
                    required
                    :disabled="loadingLocations"
                  >
                    <option value="">اختر الموقع</option>
                    <option v-for="location in locations" :key="location.name" :value="location.name">
                      {{ location.location_name || location.name }}
                    </option>
                  </select>
                  <button 
                    v-if="!loadingLocations"
                    @click="loadLocations" 
                    type="button"
                    class="refresh-btn"
                  >
                    <svg class="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">مالك الأصل (Asset Owner) *</label>
                <div class="select-wrapper">
                  <select 
                    v-model="assetForm.asset_owner"
                    class="form-select"
                    required
                    :disabled="loadingAssetOwners"
                  >
                    <option value="">اختر مالك الأصل</option>
                    <option v-for="owner in assetOwners" :key="owner.name" :value="owner.name">
                      {{ owner.asset_owner_name || owner.name }}
                    </option>
                  </select>
                  <button 
                    v-if="!loadingAssetOwners"
                    @click="loadAssetOwners" 
                    type="button"
                    class="refresh-btn"
                  >
                    <svg class="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">تاريخ الشراء (Purchase Date) *</label>
                <input 
                  v-model="assetForm.purchase_date"
                  type="date" 
                  class="form-input"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">تاريخ الاستخدام (Available for Use Date) *</label>
                <input 
                  v-model="assetForm.available_for_use_date"
                  type="date" 
                  class="form-input"
                  required
                >
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">المبلغ الإجمالي (Gross Purchase Amount) *</label>
                <input 
                  v-model="assetForm.gross_purchase_amount"
                  type="number" 
                  step="0.01"
                  class="form-input"
                  placeholder="0.00"
                  required
                >
              </div>
              
              <div class="form-group">
                <label class="form-label">المبلغ الصافي (Net Purchase Amount)</label>
                <input 
                  v-model="assetForm.net_purchase_amount"
                  type="number" 
                  step="0.01"
                  class="form-input"
                  placeholder="0.00"
                >
              </div>
            </div>

            <div class="form-options">
              <div class="option-group">
                <label class="checkbox-label">
                  <input 
                    v-model="assetForm.is_existing_asset"
                    type="checkbox" 
                    class="checkbox-input"
                    value="1"
                    checked
                  >
                  <span class="checkbox-custom"></span>
                  أصل موجود (Existing Asset)
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="button" 
                @click="currentStep = 1"
                class="btn btn-secondary"
              >
                رجوع
              </button>
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="creatingAsset"
              >
                <span v-if="creatingAsset" class="btn-loading"></span>
                {{ creatingAsset ? 'جاري الإنشاء...' : 'إنشاء الأصل' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Step 3: Success -->
        <div v-else-if="currentStep === 3" class="success-card">
          <div class="success-content">
            <div class="success-icon">
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h3 class="success-title">تم إنشاء المعدة بنجاح!</h3>
            <p class="success-description">
              تم إنشاء العنصر والأصل بنجاح في Frappe. يمكنك الآن إدارة المعدة من لوحة التحكم.
            </p>
            
            <div class="success-details">
              <div class="detail-section">
                <h4 class="detail-title">معلومات العنصر:</h4>
                <div class="detail-content">
                  <div class="detail-row">
                    <span class="detail-label">رمز العنصر:</span>
                    <span class="detail-value">{{ createdItem.name || createdItem.item_code }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">اسم العنصر:</span>
                    <span class="detail-value">{{ createdItem.item_name }}</span>
                  </div>
                </div>
              </div>
              
              <div class="detail-section">
                <h4 class="detail-title">معلومات الأصل:</h4>
                <div class="detail-content">
                  <div class="detail-row">
                    <span class="detail-label">اسم الأصل:</span>
                    <span class="detail-value">{{ createdAsset.asset_name || createdAsset.name }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">المبلغ الإجمالي:</span>
                    <span class="detail-value">{{ createdAsset.gross_purchase_amount || assetForm.gross_purchase_amount }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="success-actions">
              <router-link to="/equipment" class="btn btn-primary">
                عرض جميع المعدات
              </router-link>
              <button @click="resetForm" class="btn btn-secondary">
                إضافة معدة أخرى
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAssetCategories, getLocations, getAssetOwners, getItemGroups, createEquipmentInFrappe, createItemInFrappe } from '@/services/api.js'
import { gwGetAssetCategories, gwGetLocations, gwGetAssetOwners, gwGetItemGroups, gwCreateEquipment } from '@/services/gateway.js'
import { getAuth } from 'firebase/auth'

export default {
  name: 'AddEquipmentPage',
  data() {
    return {
      currentStep: 1,
      loading: false,
      loadingCategories: false,
      loadingLocations: false,
      loadingAssetOwners: false,
      loadingItemGroups: false,
      creatingItem: false,
      creatingAsset: false,
      error: null,
      successMessage: null,
      stockFixedAssetError: null,
      assetCategories: [],
      locations: [],
      assetOwners: [
        { name: 'Company', asset_owner_name: 'شركة' },
        { name: 'Supplier', asset_owner_name: 'مورد' },
        { name: 'Customer', asset_owner_name: 'عميل' },
        { name: 'Lessor', asset_owner_name: 'مؤجر' },
        { name: 'Lessee', asset_owner_name: 'مستأجر' }
      ],
      itemGroups: [],
      createdItem: {},
      createdAsset: {},
      
      // Item Form
      itemForm: {
        item_code: '',
        item_name: '',
        asset_category: '',
        item_group: 'معدات',
        is_stock_item: 0,  // تم تغييرها من '0' إلى 0
        is_fixed_asset: 1,  // تم تغييرها من '1' إلى 1
        location: '',
        asset_owner: 'Supplier',
        purchase_date: new Date().toISOString().split('T')[0],
        available_for_use_date: new Date().toISOString().split('T')[0],
        gross_purchase_amount: 10000,
        net_purchase_amount: 10000
      },
      
      // Asset Form
      assetForm: {
        item_code: '',
        asset_name: '',
        asset_category: '',
        is_existing_asset: '1',
        asset_owner: 'Supplier',
        supplier: '',
        location: '',
        purchase_date: '',
        available_for_use_date: '',
        gross_purchase_amount: 10000,
        net_purchase_amount: 10000
      }
    }
  },
  computed: {
    ...mapGetters(['currentFrappeData', 'currentVendor']),
    
    currentSupplierName() {
      // أولاً: جرب من localStorage
      const fromLS = localStorage.getItem('frappe_supplier_name')
      console.log('form ls',fromLS)
      if (fromLS && fromLS !== 'المورد الحالي' && fromLS !== 'Supplier') {
        return fromLS
      }
      
      // ثانياً: من Frappe data
      if (this.currentFrappeData?.supplier_name) {
        return this.currentFrappeData.supplier_name
      }
      
      // ثالثاً: من vendor data
      if (this.currentVendor?.name) {
        return this.currentVendor.name
      }
      
      // رابعاً: من Frappe name
      if (this.currentFrappeData?.name) {
        return this.currentFrappeData.name
      }
      
      // خامساً: من Firebase user
      const user = getAuth().currentUser
      if (user?.displayName) {
        return user.displayName
      }
      
      console.warn('⚠️ لم يتم العثور على اسم المورد، سيتم استخدام اسم افتراضي')
      return 'Supplier' // قيمة افتراضية آمنة
    }
  },
  
  async mounted() {
    this.loading = true
    try {
      await Promise.all([
        this.loadAssetCategories(),
        this.loadLocations(),
        this.loadAssetOwners(),
        this.loadItemGroups()
      ])
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error)
      this.error = 'فشل في تحميل البيانات من Frappe'
    } finally {
      this.loading = false
    }
    
    // ضبط قيم النموذج الأولية
    this.assetForm.supplier = this.currentSupplierName
    
    // تحديث التواريخ تلقائياً
    this.updateDates()
  },
  
  watch: {
    currentSupplierName: {
      handler(newValue) {
        this.assetForm.supplier = newValue
      },
      immediate: true
    }
  },
  
  methods: {
    updateDates() {
      const today = new Date().toISOString().split('T')[0];
      this.itemForm.purchase_date = today;
      this.itemForm.available_for_use_date = today;
    },
    
    validateStockFixedAsset() {
      // إعادة تعيين رسالة الخطأ
      this.stockFixedAssetError = null;
      
      // تحقق من أن الأصول الثابتة غير مخزونة
      if (this.itemForm.is_fixed_asset === 1 && this.itemForm.is_stock_item === 1) {
        this.stockFixedAssetError = 'الأصول الثابتة يجب أن تكون غير مخزونة. سيتم تغيير "عنصر مخزون؟" إلى "لا" تلقائياً.';
        // تغيير تلقائي
        this.itemForm.is_stock_item = 0;
      }
    },
    
    async loadAssetCategories() {
      this.loadingCategories = true
      try {
        let categories = []
        try { categories = await gwGetAssetCategories() } catch {}
        if (!categories?.length) categories = await getAssetCategories()
        this.assetCategories = categories || []
        console.log('✅ تم تحميل فئات الأصول:', this.assetCategories)
      } catch (error) {
        console.error('خطأ في تحميل فئات الأصول:', error)
        this.error = 'فشل في تحميل فئات الأصول من Frappe'
      } finally {
        this.loadingCategories = false
      }
    },

    async loadLocations() {
      this.loadingLocations = true
      try {
        let locations = []
        try { locations = await gwGetLocations() } catch {}
        if (!locations?.length) locations = await getLocations()
        this.locations = locations || []
        console.log('✅ تم تحميل المواقع:', this.locations)
      } catch (error) {
        console.error('خطأ في تحميل المواقع:', error)
        this.error = 'فشل في تحميل المواقع من Frappe'
      } finally {
        this.loadingLocations = false
      }
    },

    async loadAssetOwners() {
      this.loadingAssetOwners = true
      try {
        // استخدام القيم الثابتة بدلاً من جلبها من Frappe
        console.log('✅ تم تحميل خيارات مالك الأصل:', this.assetOwners)
      } catch (error) {
        console.error('خطأ في تحميل خيارات مالك الأصل:', error)
        this.error = 'فشل في تحميل خيارات مالك الأصل'
      } finally {
        this.loadingAssetOwners = false
      }
    },

    async loadItemGroups() {
      this.loadingItemGroups = true
      try {
        let groups = []
        try { groups = await gwGetItemGroups() } catch {}
        if (!groups?.length) groups = await getItemGroups()
        this.itemGroups = groups || []
        console.log('✅ تم تحميل مجموعات العناصر:', this.itemGroups)
      } catch (error) {
        console.error('خطأ في تحميل مجموعات العناصر:', error)
        this.error = 'فشل في تحميل مجموعات العناصر من Frappe'
      } finally {
        this.loadingItemGroups = false
      }
    },

    // async createItem() {
    //   alert('create')
    //   this.creatingItem = true
    //   this.error = null
      
    //   try {
    //     // تحقق من صحة البيانات
    //     if (!this.itemForm.item_code || !this.itemForm.item_name || !this.itemForm.asset_category) {
    //       throw new Error('يرجى ملء جميع الحقول المطلوبة');
    //     }
        
    //     // تحقق من أن الأصول الثابتة غير مخزونة
    //     if (this.itemForm.is_fixed_asset === 1 && this.itemForm.is_stock_item === 1) {
    //       throw new Error('الأصول الثابتة يجب أن تكون غير مخزونة. يرجى اختيار "لا" في حقل "عنصر مخزون؟"');
    //     }
        
    //     // تحقق من اسم المورد
    //     const supplierName = this.currentSupplierName
    //     console.log('🔍 اسم المورد الحالي:', supplierName)
    //     console.log('🔍 localStorage frappe_supplier_name:', localStorage.getItem('frappe_supplier_name'))
    //     console.log('🔍 currentFrappeData:', this.currentFrappeData)
    //     console.log('🔍 currentVendor:', this.currentVendor)
        
    //     if (!supplierName || supplierName === 'المورد الحالي' || supplierName === 'Supplier') {
    //       throw new Error('لم يتم العثور على اسم المورد. يرجى تسجيل الدخول مرة أخرى.')
    //     }
        
    //     // حفظ اسم المورد في localStorage للتأكد من استخدامه لاحقاً
    //     localStorage.setItem('frappe_supplier_name', supplierName)
        
    //     // إنشاء العنصر في Frappe
    //     const itemData = {
    //       item_code: this.itemForm.item_code,
    //       item_name: this.itemForm.item_name,
    //       asset_category: this.itemForm.asset_category,
    //       item_group: this.itemForm.item_group,
    //       is_stock_item: this.itemForm.is_stock_item, // الآن رقم مباشرة
    //       is_fixed_asset: this.itemForm.is_fixed_asset, // الآن رقم مباشرة
    //       location: this.itemForm.location,
    //       asset_owner: this.itemForm.asset_owner,
    //       purchase_date: this.itemForm.purchase_date,
    //       available_for_use_date: this.itemForm.available_for_use_date,
    //       gross_purchase_amount: this.itemForm.gross_purchase_amount,
    //       net_purchase_amount: this.itemForm.net_purchase_amount
    //     }

    //     console.log('إنشاء العنصر:', itemData)
        
    //     // جرب Gateway أولاً، ثم fallback إلى اتصال Frappe المباشر
    //     let result
    //     try {
    //       const gw = await gwCreateEquipment({
    //         item_name: this.itemForm.item_name,
    //         item_code: this.itemForm.item_code,
    //         item_group: this.itemForm.item_group,
    //         asset_category: this.itemForm.asset_category,
    //         is_stock_item: this.itemForm.is_stock_item,
    //         is_fixed_asset: this.itemForm.is_fixed_asset,
    //         asset_owner: this.itemForm.asset_owner,
    //         supplier: this.currentSupplierName,
    //         location: this.itemForm.location,
    //         purchase_date: this.assetForm.purchase_date,
    //         available_for_use_date: this.assetForm.available_for_use_date,
    //         net_purchase_amount: this.assetForm.net_purchase_amount,
    //         gross_purchase_amount: this.itemForm.gross_purchase_amount
    //       })
    //       result = { success: gw?.ok, item: gw?.data?.item, asset: gw?.data?.asset }
    //     } catch (e) {
    //       console.warn('Gateway create failed, fallback to direct API', e?.message)
    //     }

    //     if (!result || !result.success) {
    //       result = await createEquipmentInFrappe({
    //       // بيانات العنصر
    //       item_code: itemData.item_code,
    //       item_name: itemData.item_name,
    //       asset_category: itemData.asset_category,
    //       item_group: itemData.item_group,
    //       is_stock_item: itemData.is_stock_item,
    //       is_fixed_asset: itemData.is_fixed_asset,
          
    //       // بيانات الأصل
    //       asset_name: this.itemForm.item_name, // نفس اسم العنصر
    //       is_existing_asset: 1,
    //       asset_owner: this.itemForm.asset_owner,
    //       supplier: this.currentSupplierName,
    //       location: this.itemForm.location,
    //       purchase_date: this.assetForm.purchase_date,
    //       available_for_use_date: this.assetForm.available_for_use_date,
    //       net_purchase_amount: this.assetForm.net_purchase_amount
    //       })
    //     }

    //     if (result.success) {
    //       this.createdItem = result.item
    //       this.createdAsset = result.asset
          
    //       // تحديث قيم النموذج للخطوة الثانية
    //       this.assetForm.item_code = this.createdItem.name || this.createdItem.item_code
    //       this.assetForm.asset_category = this.createdItem.asset_category
    //       this.assetForm.supplier = this.currentSupplierName
          
    //       this.successMessage = 'تم إنشاء المعدة بنجاح!'
    //       this.currentStep = 3
    //     } else {
    //       this.error = result.error || 'فشل في إنشاء المعدة'
    //     }
        
    //   } catch (error) {
    //     console.error('خطأ في إنشاء العنصر:', error)
    //     this.error = error.message || 'حدث خطأ في إنشاء العنصر'
    //   } finally {
    //     this.creatingItem = false
    //   }
    // },
    async createItem(){
        try{
            console.log("this.itemForm.item_code:", this.itemForm.item_code);
            console.log("this.itemForm.item_name:", this.itemForm.item_name);
            console.log("this.itemForm.item_group:", this.itemForm.item_group);
            console.log("this.itemForm.asset_category:", this.itemForm.asset_category);
           const formData = {
              item_code: this.itemForm.item_code,
              item_name: this.itemForm.item_name,
              item_group: this.itemForm.item_group,
              stock_uom: "Nos", // ثابت دلوقتي
              asset_category: this.itemForm.asset_category
            };
             const result = await createItemInFrappe(formData);
             if(result){
               console.log("result", result);
               this.createdItem = result.data.message
               this.currentStep = 2
             }
        }catch(error){
                  console.error("❌ Failed to create item:", error);
        }
    },
    async createAsset() {
      alert('hiiiiiiiiiiiii')
      this.creatingAsset = true
      this.error = null
      
      try {
        // تحديث بيانات الأصل
        this.assetForm.item_code = this.createdItem.item_code
        this.assetForm.asset_category = this.createdItem.asset_category
        this.assetForm.supplier = this.currentSupplierName
        
        // تحقق من وجود المبلغ الإجمالي
        if (!this.assetForm.gross_purchase_amount) {
          throw new Error('المبلغ الإجمالي مطلوب')
        }
        
        console.log('إنشاء الأصل:', this.assetForm)
        
        // إنشاء الأصل في Frappe
        const assetData = {
          item_code: this.assetForm.item_code || this.createdItem.item_code,
          item_name: this.createdItem.item_name,
          asset_name: this.assetForm.asset_name,
          asset_category: this.assetForm.asset_category,
          is_existing_asset: this.assetForm.is_existing_asset,
          asset_owner: this.assetForm.asset_owner,
          supplier: this.assetForm.supplier,
          location: this.assetForm.location,
          purchase_date: this.assetForm.purchase_date || new Date().toISOString().split('T')[0],
          available_for_use_date: this.assetForm.available_for_use_date || new Date().toISOString().split('T')[0],
          gross_purchase_amount: this.assetForm.gross_purchase_amount,
          net_purchase_amount: this.assetForm.net_purchase_amount || this.assetForm.gross_purchase_amount,
          asset_quantity: 1
        }
        
        // استخدام دالة createEquipmentInFrappe لإنشاء الأصل فقط
        const result = await createEquipmentInFrappe(assetData)
        console.log('result',result)
        if (result.success) {
          this.createdAsset = result.data.message.asset
          this.currentStep = 3
        } else {
          this.error = result.error || 'فشل في إنشاء الأصل'
        }
        
      } catch (error) {
        console.error('خطأ في إنشاء الأصل:', error)
        this.error = error.message || 'حدث خطأ في إنشاء الأصل'
      } finally {
        this.creatingAsset = false
      }
    },

    resetForm() {
      this.currentStep = 3
      this.error = null
      this.successMessage = null
      this.stockFixedAssetError = null
      this.createdItem = {}
      this.createdAsset = {}
      
      this.itemForm = {
        item_code: '',
        item_name: '',
        asset_category: '',
        item_group: 'معدات',
        is_stock_item: 0,  // رقم بدلاً من نص
        is_fixed_asset: 1,  // رقم بدلاً من نص
        location: '',
        asset_owner: 'Supplier',
        purchase_date: new Date().toISOString().split('T')[0],
        available_for_use_date: new Date().toISOString().split('T')[0],
        gross_purchase_amount: 10000,
        net_purchase_amount: 10000
      }
      
      // تحديث التواريخ
      this.updateDates()
      
      this.assetForm = {
        item_code: '',
        asset_name: '',
        asset_category: '',
        is_existing_asset: '1',
        asset_owner: 'Supplier',
        supplier: '',
        location: '',
        purchase_date: '',
        available_for_use_date: '',
        gross_purchase_amount: 10000,
        net_purchase_amount: 10000
      }
    }
  }
}
</script> 

<style scoped>
.add-equipment-page {
  min-height: 100vh;
  background: var(--color-secondary);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Progress Steps */
.progress-section {
  margin-bottom: 2rem;
}

.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  background: var(--color-secondary-light);
  color: var(--color-primary-dark);
  border: 2px solid var(--color-primary);
  transition: all 0.3s ease;
}

.step-number.active {
  background: var(--color-primary);
  color: var(--color-secondary);
  box-shadow: 0 4px 12px rgba(17, 77, 70, 0.3);
}

.step-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary-dark);
  transition: all 0.3s ease;
}

.step-label.active {
  color: var(--color-primary);
  font-weight: 600;
}

.step-connector {
  width: 4rem;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
}

/* Messages */
.error-message {
  background: var(--color-secondary);
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-primary);
}

.error-label {
  font-weight: 600;
  color: var(--color-primary);
}

.error-text {
  color: var(--color-primary-dark);
}

.success-message {
  background: var(--color-secondary);
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.success-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-primary);
}

.success-label {
  font-weight: 600;
  color: var(--color-primary);
}

.success-text {
  color: var(--color-primary-dark);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 2rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid var(--color-secondary);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-text {
  color: var(--color-primary-dark);
  font-size: 1.125rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Form Cards */
.form-card {
  background: var(--color-secondary);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(17, 77, 70, 0.1);
  border: 2px solid var(--color-primary);
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-secondary);
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary-dark);
  box-shadow: 0 0 0 3px rgba(17, 77, 70, 0.1);
}

.form-input::placeholder {
  color: var(--color-primary-dark);
}

.form-hint {
  font-size: 0.75rem;
  color: var(--color-primary-dark);
  font-weight: 500;
}

/* Select Wrapper */
.select-wrapper {
  position: relative;
}

.refresh-btn {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: var(--color-secondary-light);
  color: var(--color-primary-dark);
}

.refresh-icon {
  width: 1rem;
  height: 1rem;
}

.loading-indicator {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--color-secondary);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Form Options */
.form-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-secondary-light);
  border-radius: 8px;
  border: 1px solid var(--color-primary);
}

.option-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--color-primary);
  font-weight: 500;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 1.125rem;
  height: 1.125rem;
  border: 2px solid var(--color-primary);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
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
  font-size: 0.75rem;
  font-weight: bold;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding-top: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  outline: none;
  gap: 0.5rem;
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--color-secondary);
  box-shadow: 0 4px 12px rgba(17, 77, 70, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(17, 77, 70, 0.4);
}

.btn-secondary {
  background: var(--color-secondary);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-secondary:hover {
  background: var(--color-secondary-light);
  transform: translateY(-2px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Step Info */
.step-info {
  margin-bottom: 2rem;
}

.info-card {
  background: var(--color-secondary-light);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-primary);
}

.info-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 0.875rem;
  color: var(--color-primary-dark);
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: var(--color-primary);
  font-weight: 600;
}

/* Success Card */
.success-card {
  background: var(--color-secondary);
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 10px 30px rgba(17, 77, 70, 0.1);
  border: 2px solid var(--color-primary);
  text-align: center;
}

.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.success-icon {
  width: 4rem;
  height: 4rem;
  color: var(--color-primary);
}

.success-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.success-description {
  color: var(--color-primary-dark);
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 500px;
}

.success-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 600px;
}

.detail-section {
  text-align: right;
}

.detail-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .progress-steps {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step-connector {
    width: 2px;
    height: 2rem;
  }
  
  .success-details {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .success-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style> 