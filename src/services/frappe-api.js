import axios from 'axios';
import { getFrappeConfig } from '../config/frappe.js';

// إعدادات Frappe API
const { baseURL: FRAPPE_BASE_URL, apiKey: API_KEY, apiSecret: API_SECRET } = getFrappeConfig();

// إعداد Axios للربط مع Frappe
const frappeApi = axios.create({
  baseURL: FRAPPE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `token ${API_KEY}:${API_SECRET}`
  }
});

// ====================================
// 1. خدمات الموردين (Suppliers)
// ====================================

// إنشاء مورد جديد
export const createSupplier = async (supplierData) => {
  try {
    console.log('🔍 إنشاء مورد جديد:', supplierData);
    
    const data = {
      supplier_name: supplierData.name,
      supplier_type: supplierData.type || 'Individual',
      country: supplierData.country || 'Saudi Arabia',
      email_id: supplierData.email,
      mobile_no: supplierData.phone || '',
      supplier_group: 'All Supplier',
      company: 'Ejar Salasah',
      firebase_uid: supplierData.uid,
      status: 'Active'
    };

    const response = await frappeApi.post('/api/resource/Supplier', data);
    
    console.log('✅ تم إنشاء المورد بنجاح:', response.data);
    
    // حفظ في localStorage
    localStorage.setItem('supplier_data', JSON.stringify(response.data.data));
    
    return {
      success: true,
      data: response.data.data,
      message: 'تم إنشاء المورد بنجاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء المورد:', error);
    
    // إذا كان المورد موجود بالفعل
    if (error.response?.status === 409) {
      return await getSupplierByEmail(supplierData.email);
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// البحث عن مورد بالبريد الإلكتروني
export const getSupplierByEmail = async (email) => {
  try {
    console.log('🔍 البحث عن المورد:', email);
    
    const response = await frappeApi.get('/api/resource/Supplier', {
      params: {
        filters: JSON.stringify([["email_id", "=", email]])
      }
    });
    
    if (response.data.data && response.data.data.length > 0) {
      const supplier = response.data.data[0];
      console.log('✅ تم العثور على المورد:', supplier);
      
      // حفظ في localStorage
      localStorage.setItem('supplier_data', JSON.stringify(supplier));
      
      return {
        success: true,
        data: supplier,
        message: 'تم العثور على المورد'
      };
    } else {
      return {
        success: false,
        error: 'المورد غير موجود'
      };
    }
    
  } catch (error) {
    console.error('❌ خطأ في البحث عن المورد:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// ====================================
// 2. خدمات الأصناف (Items)
// ====================================

// إنشاء صنف جديد
export const createItem = async (itemData) => {
  try {
    console.log('🔍 إنشاء صنف جديد:', itemData);
    
    const data = {
      item_code: itemData.code,
      item_name: itemData.name,
      item_group: 'معدات',
      is_stock_item: 0,
      is_fixed_asset: 1,
      asset_category: itemData.category,
      description: itemData.description || ''
    };

    const response = await frappeApi.post('/api/resource/Item', data);
    
    console.log('✅ تم إنشاء الصنف بنجاح:', response.data);
    
    // حفظ في localStorage
    localStorage.setItem('item_data', JSON.stringify(response.data.data));
    
    return {
      success: true,
      data: response.data.data,
      message: 'تم إنشاء الصنف بنجاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء الصنف:', error);
    
    // إذا كان الصنف موجود بالفعل
    if (error.response?.status === 409) {
      return await getItemByCode(itemData.code);
    }
    
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// البحث عن صنف بالكود
export const getItemByCode = async (itemCode) => {
  try {
    console.log('🔍 البحث عن الصنف:', itemCode);
    
    const response = await frappeApi.get(`/api/resource/Item/${itemCode}`);
    
    console.log('✅ تم العثور على الصنف:', response.data.data);
    
    // حفظ في localStorage
    localStorage.setItem('item_data', JSON.stringify(response.data.data));
    
    return {
      success: true,
      data: response.data.data,
      message: 'تم العثور على الصنف'
    };
    
  } catch (error) {
    console.error('❌ خطأ في البحث عن الصنف:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// ====================================
// 3. خدمات المعدات (Assets)
// ====================================

// إنشاء معدة جديدة
export const createAsset = async (assetData) => {
  try {
    console.log('🔍 إنشاء معدة جديدة:', assetData);
    
    const data = {
      item_code: assetData.item_code,
      asset_name: assetData.name,
      item_name: assetData.name,
      asset_category: assetData.category,
      is_existing_asset: 1,
      asset_owner: 'Supplier',
      supplier: assetData.supplier,
      location: assetData.location,
      gross_purchase_amount: parseFloat(assetData.purchase_amount),
      available_for_use_date: assetData.use_date,
      asset_quantity: 1,
      description: assetData.description || ''
    };

    const response = await frappeApi.post('/api/resource/Asset', data);
    
    console.log('✅ تم إنشاء المعدة بنجاح:', response.data);
    
    // حفظ في localStorage
    localStorage.setItem('asset_data', JSON.stringify(response.data.data));
    
    return {
      success: true,
      data: response.data.data,
      message: 'تم إنشاء المعدة بنجاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء المعدة:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// ====================================
// 4. خدمات البيانات المرجعية
// ====================================

// جلب قائمة الدول
export const getCountries = async () => {
  try {
    console.log('🔍 جلب قائمة الدول...');
    
    const response = await frappeApi.get('/api/resource/Country');
    
    console.log('✅ تم جلب الدول بنجاح');
    
    return {
      success: true,
      data: response.data.data,
      message: 'تم جلب الدول بنجاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في جلب الدول:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// جلب قائمة فئات المعدات
export const getAssetCategories = async () => {
  try {
    console.log('🔍 جلب قائمة فئات المعدات...');
    
    const response = await frappeApi.get('/api/resource/Asset Category');
    
    console.log('✅ تم جلب فئات المعدات بنجاح');
    
    return {
      success: true,
      data: response.data.data,
      message: 'تم جلب فئات المعدات بنجاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في جلب فئات المعدات:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// جلب قائمة المواقع
export const getLocations = async () => {
  try {
    console.log('🔍 جلب قائمة المواقع...');
    
    const response = await frappeApi.get('/api/resource/Location');
    
    console.log('✅ تم جلب المواقع بنجاح');
    
    return {
      success: true,
      data: response.data.data,
      message: 'تم جلب المواقع بنجاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في جلب المواقع:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// ====================================
// 5. خدمات حفظ واسترجاع البيانات المحلية
// ====================================

// حفظ بيانات المورد محلياً
export const saveSupplierLocally = (supplierData) => {
  try {
    localStorage.setItem('supplier_data', JSON.stringify(supplierData));
    localStorage.setItem('supplier_name', supplierData.supplier_name);
    localStorage.setItem('supplier_email', supplierData.email_id);
    console.log('✅ تم حفظ بيانات المورد محلياً');
    return true;
  } catch (error) {
    console.error('❌ خطأ في حفظ بيانات المورد:', error);
    return false;
  }
};

// استرجاع بيانات المورد من التخزين المحلي
export const getSupplierFromLocal = () => {
  try {
    const data = localStorage.getItem('supplier_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ خطأ في استرجاع بيانات المورد:', error);
    return null;
  }
};

// حفظ بيانات المعدة محلياً
export const saveAssetLocally = (assetData) => {
  try {
    localStorage.setItem('asset_data', JSON.stringify(assetData));
    localStorage.setItem('asset_name', assetData.asset_name);
    localStorage.setItem('item_code', assetData.item_code);
    console.log('✅ تم حفظ بيانات المعدة محلياً');
    return true;
  } catch (error) {
    console.error('❌ خطأ في حفظ بيانات المعدة:', error);
    return false;
  }
};

// استرجاع بيانات المعدة من التخزين المحلي
export const getAssetFromLocal = () => {
  try {
    const data = localStorage.getItem('asset_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ خطأ في استرجاع بيانات المعدة:', error);
    return null;
  }
};

// ====================================
// 6. دالة اختبار الاتصال
// ====================================

export const testConnection = async () => {
  try {
    console.log('🔍 اختبار الاتصال بـ Frappe...');
    const response = await frappeApi.get('/api/method/frappe.auth.get_logged_user');
    
    console.log('✅ الاتصال يعمل بشكل صحيح');
    return {
      success: true,
      data: response.data,
      message: 'الاتصال يعمل بشكل صحيح'
    };
  } catch (error) {
    console.error('❌ فشل في الاتصال:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
};

// ====================================
// 7. دالة إنشاء مورد ومعدة كاملة
// ====================================

export const createCompleteVendorEquipment = async (vendorData, equipmentData) => {
  try {
    console.log('🚀 بدء إنشاء مورد ومعدة كاملة...');
    
    // 1. إنشاء أو البحث عن المورد
    console.log('📝 الخطوة 1: إنشاء/البحث عن المورد...');
    const supplierResult = await createSupplier(vendorData);
    
    if (!supplierResult.success) {
      return {
        success: false,
        error: 'فشل في إنشاء المورد: ' + supplierResult.error
      };
    }
    
    // 2. إنشاء الصنف
    console.log('📦 الخطوة 2: إنشاء الصنف...');
    const itemResult = await createItem({
      code: equipmentData.item_code,
      name: equipmentData.name,
      category: equipmentData.category,
      description: equipmentData.description
    });
    
    if (!itemResult.success) {
      return {
        success: false,
        error: 'فشل في إنشاء الصنف: ' + itemResult.error
      };
    }
    
    // 3. إنشاء المعدة
    console.log('🔧 الخطوة 3: إنشاء المعدة...');
    const assetResult = await createAsset({
      item_code: equipmentData.item_code,
      name: equipmentData.name,
      category: equipmentData.category,
      supplier: supplierResult.data.supplier_name,
      location: equipmentData.location,
      purchase_amount: equipmentData.purchase_amount,
      use_date: equipmentData.use_date,
      description: equipmentData.description
    });
    
    if (!assetResult.success) {
      return {
        success: false,
        error: 'فشل في إنشاء المعدة: ' + assetResult.error
      };
    }
    
    console.log('🎉 تم إنشاء المورد والمعدة بنجاح!');
    
    return {
      success: true,
      supplier: supplierResult.data,
      item: itemResult.data,
      asset: assetResult.data,
      message: 'تم إنشاء المورد والمعدة بنجاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء المورد والمعدة:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  // خدمات الموردين
  createSupplier,
  getSupplierByEmail,
  
  // خدمات الأصناف
  createItem,
  getItemByCode,
  
  // خدمات المعدات
  createAsset,
  
  // خدمات البيانات المرجعية
  getCountries,
  getAssetCategories,
  getLocations,
  
  // خدمات التخزين المحلي
  saveSupplierLocally,
  getSupplierFromLocal,
  saveAssetLocally,
  getAssetFromLocal,
  
  // خدمات أخرى
  testConnection,
  createCompleteVendorEquipment
}; 