import { getFrappeConfig, generateCredential } from '../config/frappe.js';
import router from '@/router/index.js';
import { apiClient } from './auth.js';
import axios from 'axios';

export const getAssetsFromFrappe = async () => {
  try {
    console.log('🏗️ Assets Frappe load...');
    const client = await apiClient();
    
    // ✅ التأكد من وجود apiClient قبل الاستخدام
    
    if (!client || typeof client.get !== 'function') {
      throw new Error('❌ apiClient is not properly initialized');
    }
    
    const response = await client.get('/api/resource/Asset');
    console.log('✅ Assets  All Response:', response);
    
    // فحص البيانات المُستلمة
    if (response.data && response.data.data && response.data.data.length > 0) {
      return {
        success: true,
        data: response.data.data,
        message: 'تم جلب الأصول بنجاح من Frappe'
      };
    } else {
      console.log('⚠️ لم يتم العثور على أصول في Frappe، استخدام البيانات الافتراضية');
      return getDefaultAssets('لم يتم العثور على أصول في Frappe');
    }
    
  } catch (error) {
    console.error('❌ خطأ في جلب الأصول من Frappe:', error);
    
    // تفصيل أكثر للأخطاء
    if (error.code === 'NETWORK_ERROR') {
      console.error('❌ خطأ في الشبكة');
    } else if (error.response?.status === 401) {
      console.error('❌ خطأ في المصادقة - قم بتسجيل الدخول مرة أخرى');
      localStorage.clear();
      router.push('/login');
    } else if (error.response?.status === 403) {
      console.error('❌ ليس لديك صلاحية للوصول إلى هذا المورد');
    }
    
    return getDefaultAssets(`خطأ في الاتصال: ${error.message}`);
  }
};


// API Get Equipmnet py Supplier
export const getEquipmentBySupplier = async (supplierName)=>{
    const client = await apiClient();
    try{

       const result = client.get('/api/resource/Asset',{
        params:{
          fields: JSON.stringify(['name', 'supplier', 'location', 'asset_category', 'status']),
          filters: JSON.stringify([['supplier', '=', supplierName]]) // correct filter
        }
       })
       console.log('result API Get Equipmnet py Supplier',result)
       return result

    }catch(e){
      console.log('error API Get Equipmnet py Supplier')
    }





}



// API Assets
const getDefaultAssets = (reason) => {
  const defaultAssets = [
    {
      name: 'ACC-ASS-2025-00001',
      asset_name: 'CAT320D-SN-001 حفار',
      asset_category: 'معدات البناء',
      location: 'حي الرياض',
      status: 'Submitted'
    },
    {
      name: 'ACC-ASS-2025-00002',
      asset_name: 'test',
      asset_category: 'معدات الزراعة',
      location: 'الرياض',
      status: 'Draft'
    }
  ];
  
  return {
    success: true,
    data: defaultAssets,
    message: `تم استخدام الأصول الافتراضية - ${reason}`,
    isDefault: true
  };
};

// API Equipment
export const getEquipmentItems = async () => {
    try {
      
    console.log('🔧 API Equipment');
        const client = await apiClient();
    // إزالة التصفية القديمة على "Equipment" لأنها غير موجودة في النظام
    const response = await client.get('/api/resource/Item');
    console.log('✅ تم جلب المعدات بنجاح:', response.data);
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      return {
        success: true,
        data: response.data.data,
        message: 'تم جلب المعدات بنجاح'
      };
    } else {
      console.log('⚠️ لم يتم العثور على معدات في Frappe، استخدام البيانات الافتراضية');
      const defaultEquipment = [
        { 
          name: 'CAT320D-SN-001',
          item_name: 'حفار',
          item_group: 'معدات',
          description: 'حفار كاتربيلر 320D'
        },
        { 
          name: 'EQ-Muaadh-MASHAAL-1754432922694',
          item_name: 'معدة افتراضية',
          item_group: 'معدات',
          description: 'معدة افتراضية للاختبار'
        },
        { 
          name: 'AAAAAAAAAAAAA',
          item_name: 'معدات',
          item_group: 'معدات',
          description: 'معدات عامة'
        }
      ];
      
      return {
        success: true,
        data: defaultEquipment,
        message: 'تم استخدام المعدات الافتراضية'
      };
    }
    } catch (error) {
    console.error('❌ خطأ في جلب المعدات من Frappe:', error);
    
    const defaultEquipment = [
      { 
        name: 'CAT320D-SN-001',
        item_name: 'حفار',
        item_group: 'معدات',
        description: 'حفار كاتربيلر 320D'
      },
      { 
        name: 'EQ-Muaadh-MASHAAL-1754432922694',
        item_name: 'معدة افتراضية',
        item_group: 'معدات',
        description: 'معدة افتراضية للاختبار'
      },
      { 
        name: 'AAAAAAAAAAAAA',
        item_name: 'معدات',
        item_group: 'معدات',
        description: 'معدات عامة'
      }
    ];
      
      return {
        success: true,
      data: defaultEquipment,
      message: 'تم استخدام المعدات الافتراضية بسبب خطأ في الاتصال'
    };
  }
};


// API getLocations
export const getLocations = async () => {
  try {
      
    console.log('📍 جلب المواقع من Frappe...');
     const client = await apiClient();
    const response = await client.get('/api/resource/Location');
    console.log('✅ تم جلب المواقع بنجاح:', response.data);
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      return response.data.data;
            } else {
      console.log('⚠️ لم يتم العثور على مواقع في Frappe، استخدام البيانات الافتراضية');
      const defaultLocations = [
        { name: 'الرياض', location_name: 'الرياض' },
        { name: 'جدة', location_name: 'جدة' },
        { name: 'الدمام', location_name: 'الدمام' },
        { name: 'مكة', location_name: 'مكة' },
        { name: 'المدينة', location_name: 'المدينة' },
        { name: 'تبوك', location_name: 'تبوك' },
        { name: 'أبها', location_name: 'أبها' },
        { name: 'حائل', location_name: 'حائل' }
      ];
      
      return defaultLocations;
    }
    } catch (error) {
    console.error('❌ خطأ في جلب المواقع من Frappe:', error);
    
    const defaultLocations = [
      { name: 'الرياض', location_name: 'الرياض' },
      { name: 'جدة', location_name: 'جدة' },
      { name: 'الدمام', location_name: 'الدمام' },
      { name: 'مكة', location_name: 'مكة' },
      { name: 'المدينة', location_name: 'المدينة' },
      { name: 'تبوك', location_name: 'تبوك' },
      { name: 'أبها', location_name: 'أبها' },
      { name: 'حائل', location_name: 'حائل' }
    ];
    
    return defaultLocations;
  }
};


// API getAssetCategories 
export const getAssetCategories = async () => {
  try {
   
    console.log('📂 API getAssetCategories ');    
    const client = await apiClient();
    const response = await client.get('/api/resource/Asset Category');
    console.log('📂 API getAssetCategories ',response);  
      if (response.data && response.data.data && response.data.data.length > 0) {

        return response.data.data;

      } else {
        console.log('⚠️ Virsual Data');
        const defaultCategories = [
          { name: 'معدات البناء', asset_category_name: 'معدات البناء' },
          { name: 'معدات النقل', asset_category_name: 'معدات النقل' },
          { name: 'معدات الكهرباء', asset_category_name: 'معدات الكهرباء' },
          { name: 'معدات السباكة', asset_category_name: 'معدات السباكة' },
          { name: 'معدات الزراعة', asset_category_name: 'معدات الزراعة' },
          { name: 'معدات التبريد', asset_category_name: 'معدات التبريد' },
          { name: 'معدات الأمن', asset_category_name: 'معدات الأمن' },
          { name: 'معدات المطبخ', asset_category_name: 'معدات المطبخ' }
        ];
      
         return defaultCategories;
        }
      } catch (error) {
        console.error('❌ خطأ في جلب فئات الأصول من Frappe:', error);
    
        const defaultCategories = [
          { name: 'معدات البناء', asset_category_name: 'معدات البناء' },
          { name: 'معدات النقل', asset_category_name: 'معدات النقل' },
          { name: 'معدات الكهرباء', asset_category_name: 'معدات الكهرباء' },
          { name: 'معدات السباكة', asset_category_name: 'معدات السباكة' },
          { name: 'معدات الزراعة', asset_category_name: 'معدات الزراعة' },
          { name: 'معدات التبريد', asset_category_name: 'معدات التبريد' },
          { name: 'معدات الأمن', asset_category_name: 'معدات الأمن' },
          { name: 'معدات المطبخ', asset_category_name: 'معدات المطبخ' }
        ];
    
      return defaultCategories;
  }
};


// API getItemGroups
export const getItemGroups = async () => {
  try {

    console.log('📦 جلب مجموعات العناصر من Frappe...');
    const client = await apiClient();
    // محاولة جلب Item Groups من Frappe
    const response = await client.get('/api/resource/Item Group');
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      console.log('✅ تم جلب مجموعات العناصر من Frappe:', response.data.data);
      return response.data.data;
    } else {
      console.log('⚠️ لم يتم العثور على مجموعات عناصر في Frappe، استخدام القيم الافتراضية');
      const defaultItemGroups = [
        { name: 'معدات', item_group_name: 'معدات' },
        { name: 'Products', item_group_name: 'منتجات' },
        { name: 'Services', item_group_name: 'خدمات' },
        { name: 'Raw Materials', item_group_name: 'مواد خام' },
        { name: 'Consumables', item_group_name: 'مستهلكات' }
      ];
      
      return defaultItemGroups;
    }
    
  } catch (error) {
    console.error('❌ خطأ في جلب مجموعات العناصر من Frappe:', error);
    // إرجاع قيم افتراضية في حالة الخطأ
    const defaultItemGroups = [
      { name: 'معدات', item_group_name: 'معدات' },
      { name: 'Products', item_group_name: 'منتجات' },
      { name: 'Services', item_group_name: 'خدمات' },
      { name: 'Raw Materials', item_group_name: 'مواد خام' },
      { name: 'Consumables', item_group_name: 'مستهلكات' }
    ];
    
    return defaultItemGroups;
  }
};

// ==============================================================
// ==============================================================
// إنشاء معدة جديدة
// ✅ Create Item
export const createItemInFrappe = async (formData) => {
  try {
    // التحقق من وجود البيانات المطلوبة
    if (!formData) {
      throw new Error('Form data is required');
    }
    // التحقق من وجود الحقول الأساسية
    const requiredFields = ['item_code', 'item_name', 'item_group', 'stock_uom'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const client = await apiClient();


    const requestData = {
      item_code: formData.item_code.trim(),
      item_name: formData.item_name.trim(),
      item_group: formData.item_group,
      stock_uom: formData.stock_uom,
      ...(formData.asset_category && { asset_category: formData.asset_category })
    };

    const response = await client.post(
      '/api/method/equipment.api.equipment.create_item_if_not_exists',
      requestData
    );

    // التحقق من نجاح الاستجابة
    if (response.status >= 200 && response.status < 300) {
      console.log('✅ Item created successfully:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Item created successfully'
      };
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

  } catch (error) {
    console.error("❌ API error:", error);
    
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.response) {
      // خطأ من الخادم
      errorMessage = error.response.data?.message || 
                    error.response.data?.error || 
                    `Server error: ${error.response.status}`;
      errorCode = `HTTP_${error.response.status}`;
    } else if (error.request) {
      // خطأ في الشبكة
      errorMessage = 'Network error. Please check your connection.';
      errorCode = 'NETWORK_ERROR';
    } else if (error.message) {
      // خطأ في الإعدادات
      errorMessage = error.message;
      errorCode = 'CONFIG_ERROR';
    }

    // إرجاع خطأ منظم
    const formattedError = new Error(errorMessage);
    formattedError.code = errorCode;
    formattedError.originalError = error;
    
    throw formattedError;
  }
};
// ------------------------------------------
export const createEquipmentInFrappe = async (equipmentData) =>{
      const client = await apiClient(); 
      try{
        console.log('equipmentData',equipmentData)
        const response = await client.post('/api/method/equipment.api.equipment.create_asset_with_item',equipmentData);

        if (response.status >= 200 && response.status < 300) {
          console.log('✅ Equipment created successfully:', response.data);
          return {
            success: true,
            data: response.data,
            message: 'Equipment is created successfully'
          };
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

      }  
      catch (error) {
        console.error("❌ خطأ في إنشاء المعدة في Frappe:", error);
        let errorMessage = 'حدث خطأ في إنشاء المعدة';
        return {
          success: false,
          error: errorMessage,
          item: null,
          asset: null
        };
  }
}
// ✅ إنشاء Equipment (Item + Asset)
// export const createEquipmentInFrappe = async (equipmentData) => {
//   const client = await apiClient(); 

//   try {
   
//     let check = await checkItemExists(equipmentData.item_code);
//     let createdItem = check.item;

//     // 2️⃣ لو مش موجود → إنشاء Item جديد
//     if (!check.exists) {
//       const itemData = {
//         item_code: equipmentData.item_code,
//         item_name: equipmentData.item_name,
//         item_group: equipmentData.item_group || 'معدات',
//         is_stock_item: Number(equipmentData.is_stock_item) || 0,
//         is_fixed_asset: Number(equipmentData.is_fixed_asset) || 1,
//         asset_category: equipmentData.asset_category
//       };

//       if (itemData.is_fixed_asset === 1 && itemData.is_stock_item === 1) {
//         throw new Error('الأصول الثابتة يجب أن تكون غير مخزونة (is_stock_item = 0)');
//       }

//       console.log("📦 إنشاء عنصر جديد:", itemData);
//       const itemResponse = await client.post('/api/resource/Item', itemData);

//       if (!itemResponse.data?.data) {
//         throw new Error('فشل في إنشاء العنصر في Frappe');
//       }

//       createdItem = itemResponse.data.data;
//       console.log("✅ تم إنشاء العنصر بنجاح:", createdItem);
//     }

//     // 3️⃣ إنشاء Asset باستخدام الـ Item
//     const today = new Date().toISOString().split('T')[0];
//     const assetData = {
//       item_code: createdItem.name,
//       asset_name: equipmentData.asset_name || createdItem.item_name,
//       asset_category: equipmentData.asset_category,
//       is_existing_asset: Number(equipmentData.is_existing_asset) || 1,
//       asset_owner: equipmentData.asset_owner || 'Supplier',
//       supplier: equipmentData.supplier,
//       location: equipmentData.location,
//       purchase_date: equipmentData.purchase_date || today,
//       available_for_use_date: equipmentData.available_for_use_date || today,
//       net_purchase_amount: equipmentData.net_purchase_amount || 10000,
//       gross_purchase_amount: equipmentData.gross_purchase_amount || equipmentData.net_purchase_amount || 10000,
//       asset_quantity: 1
//     };

//     if (!assetData.supplier || assetData.supplier === 'المورد الحالي') {
//       throw new Error('اسم المورد غير صحيح. يرجى التحقق من بيانات تسجيل الدخول.');
//     }

//     console.log("🏗️ إنشاء أصل جديد:", assetData);
//     const assetResponse = await client.post('/api/resource/Asset', assetData);

//     if (!assetResponse.data?.data) {
//       throw new Error('فشل في إنشاء الأصل في Frappe');
//     }

//     const createdAsset = assetResponse.data.data;
//     console.log("✅ تم إنشاء الأصل بنجاح:", createdAsset);

//     return {
//       success: true,
//       item: createdItem,
//       asset: createdAsset,
//       message: check.exists
//         ? 'تم إنشاء الأصل لأن العنصر موجود بالفعل'
//         : 'تم إنشاء العنصر والأصل معاً'
//     };

//   } catch (error) {
//     console.error("❌ خطأ في إنشاء المعدة في Frappe:", error);

//     let errorMessage = 'حدث خطأ في إنشاء المعدة';
//     if (error.response) {
//       console.error("تفاصيل الخطأ:", error.response.data);

//       if (error.response.data.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response.data.exc) {
//         errorMessage = error.response.data.exc;
//       } else if (error.response.status === 417) {
//         errorMessage = 'رمز العنصر موجود بالفعل في النظام';
//       } else if (error.response.status === 400) {
//         errorMessage = 'بيانات غير صحيحة - يرجى التحقق من الحقول المطلوبة';
//       } else if (error.response.status === 403) {
//         errorMessage = 'ليس لديك صلاحية لإنشاء هذا النوع من البيانات';
//       } else {
//         errorMessage = `خطأ في الخادم: ${error.response.status} ${error.response.statusText}`;
//       }
//     } else if (error.message) {
//       errorMessage = error.message;
//     }

//     return {
//       success: false,
//       error: errorMessage,
//       item: null,
//       asset: null
//     };
//   }
// };

// ✅ إنشاء Equipment (Item + Asset)
// export const createEquipmentInFrappe = async (equipmentData) => {
//   const client = apiClient(); 

//   try {
//     console.log('🔧 البيانات المستلمة:', equipmentData);

//     // 1️⃣ التحقق من وجود الـ Item
//     let check = await checkItemExists(equipmentData.item_code);
//     let createdItem = check.item;

//     // 2️⃣ لو مش موجود → إنشاء Item جديد
//     if (!check.exists) {
//       const itemData = {
//         item_code: equipmentData.item_code,
//         item_name: equipmentData.item_name,
//         item_group: equipmentData.item_group || 'معدات',
//         is_stock_item: Number(equipmentData.is_stock_item) || 0,
//         is_fixed_asset: Number(equipmentData.is_fixed_asset) || 1,
//         asset_category: equipmentData.asset_category
//       };

//       if (itemData.is_fixed_asset === 1 && itemData.is_stock_item === 1) {
//         throw new Error('الأصول الثابتة يجب أن تكون غير مخزونة (is_stock_item = 0)');
//       }

//       console.log("📦 إنشاء عنصر جديد:", itemData);
//       const itemResponse = await client.post('/api/resource/Item', itemData);

//       if (!itemResponse.data?.data) {
//         throw new Error('فشل في إنشاء العنصر في Frappe');
//       }

//       createdItem = itemResponse.data.data;
//       console.log("✅ تم إنشاء العنصر بنجاح:", createdItem);
//     }

//     // 3️⃣ إنشاء Asset باستخدام الـ Item
//     const today = new Date().toISOString().split('T')[0];
//     const assetData = {
//       item_code: createdItem.name,
//       asset_name: equipmentData.asset_name || createdItem.item_name,
//       asset_category: equipmentData.asset_category,
//       is_existing_asset: Number(equipmentData.is_existing_asset) || 1,
//       asset_owner: equipmentData.asset_owner || 'Supplier',
//       supplier: equipmentData.supplier,
//       location: equipmentData.location,
//       purchase_date: equipmentData.purchase_date || today,
//       available_for_use_date: equipmentData.available_for_use_date || today,
//       net_purchase_amount: equipmentData.net_purchase_amount || 10000,
//       gross_purchase_amount: equipmentData.gross_purchase_amount || equipmentData.net_purchase_amount || 10000,
//       asset_quantity: 1
//     };

//     if (!assetData.supplier || assetData.supplier === 'المورد الحالي') {
//       throw new Error('اسم المورد غير صحيح. يرجى التحقق من بيانات تسجيل الدخول.');
//     }

//     console.log("🏗️ إنشاء أصل جديد:", assetData);
//     const assetResponse = await client.post('/api/resource/Asset', assetData);

//     if (!assetResponse.data?.data) {
//       throw new Error('فشل في إنشاء الأصل في Frappe');
//     }

//     const createdAsset = assetResponse.data.data;
//     console.log("✅ تم إنشاء الأصل بنجاح:", createdAsset);

//     return {
//       success: true,
//       item: createdItem,
//       asset: createdAsset,
//       message: check.exists
//         ? 'تم إنشاء الأصل لأن العنصر موجود بالفعل'
//         : 'تم إنشاء العنصر والأصل معاً'
//     };

//   } catch (error) {
//     console.error("❌ خطأ في إنشاء المعدة في Frappe:", error);

//     let errorMessage = 'حدث خطأ في إنشاء المعدة';
//     if (error.response) {
//       console.error("تفاصيل الخطأ:", error.response.data);

//       if (error.response.data.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response.data.exc) {
//         errorMessage = error.response.data.exc;
//       } else if (error.response.status === 417) {
//         errorMessage = 'رمز العنصر موجود بالفعل في النظام';
//       } else if (error.response.status === 400) {
//         errorMessage = 'بيانات غير صحيحة - يرجى التحقق من الحقول المطلوبة';
//       } else if (error.response.status === 403) {
//         errorMessage = 'ليس لديك صلاحية لإنشاء هذا النوع من البيانات';
//       } else {
//         errorMessage = `خطأ في الخادم: ${error.response.status} ${error.response.statusText}`;
//       }
//     } else if (error.message) {
//       errorMessage = error.message;
//     }

//     return {
//       success: false,
//       error: errorMessage,
//       item: null,
//       asset: null
//     };
//   }
// };


// ==============================================================
// ==============================================================
// تسجيل دخول المورد بـ Frappe
const vendorLogin = async (username, password) => {
  try {
    console.log('🔐 محاولة تسجيل دخول المورد:', username);
 
    const loginData = {
      usr: username,
      pwd: password
    };
    
    const response = await generateCredential(username,password);
    
    if (response.data && response.data.message === 'Logged In') {
      console.log('✅ تم تسجيل الدخول بنجاح');
      router.push('/'); 
      return {
        success: true,
          data: response.data,
          message: 'تم تسجيل الدخول بنجاح'
      };
    
    } else {
        console.log('response', response);
        console.log('❌ فشل في تسجيل الدخول');
        return {
        success: false,
            error: 'بيانات تسجيل الدخول غير صحيحة',
            data: null
        };
    }
  } catch (error) {
    console.log('vendorLogin response (error)',error)
    console.error('❌ خطأ في تسجيل الدخول:', error);
    
    let errorMessage = 'حدث خطأ في تسجيل الدخول';
    if (error.response) {
      errorMessage = `خطأ في الخادم: ${error.response.status} ${error.response.statusText}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
      
      return {
        success: false,
      error: errorMessage,
      data: null
    };
  }
};

// إنشاء مستخدم جديد في Frappe
 const createUserInFrappe = async (userData) => {
  try {
       
    console.log('👤 إنشاء مستخدم في Frappe:', userData);
    
    const userPayload = {
      email: userData.email,
      first_name: userData.first_name || userData.name?.split(' ')[0] || '',
      last_name: userData.last_name || userData.name?.split(' ').slice(1).join(' ') || '',
      full_name: userData.name || userData.email,
      user_type: 'Website User',
      send_welcome_email: 0,
      language: 'ar',
      time_zone: 'Asia/Riyadh'
    };
    
    const response = await apiClient.post('/User', userPayload);
    
    if (!response.data || !response.data.data) {
      throw new Error('فشل في إنشاء المستخدم في Frappe');
    }
    
    const createdUser = response.data.data;
    console.log('✅ تم إنشاء المستخدم بنجاح:', createdUser);
    
              return { 
                success: true, 
      data: createdUser,
      message: 'تم إنشاء المستخدم بنجاح في Frappe'
    };
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم في Frappe:', error);
    
    let errorMessage = 'حدث خطأ في إنشاء المستخدم';
    if (error.response) {
        errorMessage = `خطأ في الخادم: ${error.response.status} ${error.response.statusText}`;
    } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
      success: false,
        error: errorMessage,
      data: null
      };
    }
};

// إنشاء Item بشكل منفصل (مطلوب بواسطة auth.createDefaultEquipment)
 const createItem = async (itemData) => {
    try {
     
    console.log('📦 Creating Item  Frappe:', itemData);

    const payload = {
      item_code: itemData.item_code,
      item_name: itemData.item_name || itemData.item_code,
      item_group: itemData.item_group || 'معدات',
      is_stock_item: Number(itemData.is_stock_item ?? 0),
      is_fixed_asset: Number(itemData.is_fixed_asset ?? 1),
      asset_category: itemData.asset_category || itemData.category
    };

    if (payload.is_fixed_asset === 1 && payload.is_stock_item === 1) {
      throw new Error('الأصول الثابتة يجب أن تكون غير مخزونة (is_stock_item = 0)');
    }

    const response = await apiClient.post('/Item', payload);
    if (!response.data || !response.data.data) {
      throw new Error('فشل في إنشاء Item في Frappe');
    }

    const created = response.data.data;
    console.log('✅ تم إنشاء Item:', created);
    return { success: true, item_code: created.name, data: created };
    } catch (error) {
    console.error('❌ خطأ في إنشاء Item:', error);
      return { success: false, error: error.message };
    }
};

// إنشاء Asset بشكل منفصل (مطلوب بواسطة auth.createDefaultEquipment)
 const createAsset = async (assetData) => {
    try {
     
    console.log('🏗️ إنشاء Asset في Frappe:', assetData);

    const payload = {
      item_code: assetData.item_code,
      asset_name: assetData.asset_name || assetData.item_name || assetData.item_code,
      asset_category: assetData.asset_category || assetData.category || 'معدات البناء',
      is_existing_asset: Number(assetData.is_existing_asset ?? 1),
      asset_owner: assetData.asset_owner || 'Supplier',
      supplier: assetData.supplier || 'Supplier',
      location: assetData.location || 'الرياض',
      available_for_use_date: assetData.available_for_use_date || new Date().toISOString().split('T')[0],
      purchase_date: assetData.purchase_date || new Date().toISOString().split('T')[0],
      net_purchase_amount: Number(assetData.net_purchase_amount ?? assetData.purchase_amount ?? 10000),
      gross_purchase_amount: Number(assetData.gross_purchase_amount ?? assetData.net_purchase_amount ?? assetData.purchase_amount ?? 10000),
      asset_quantity: Number(assetData.asset_quantity ?? 1)
    };

    const response = await apiClient.post('/Asset', payload);
    if (!response.data || !response.data.data) {
      throw new Error('فشل في إنشاء Asset في Frappe');
    }

    const created = response.data.data;
    console.log('✅ تم إنشاء Asset:', created);
    return { success: true, data: created };
    } catch (error) {
    console.error('❌ خطأ في إنشاء Asset:', error);
      return { success: false, error: error.message };
    }
};

// ===== دوال إدارة المعدات =====




// ===== دوال الموردين =====


// تحديث بيانات المورد في Frappe
export const updateSupplierInFrappe = async (email, updateData) => {
  try {
    
    console.log('✏️ تحديث مورد في Frappe:', { email, updateData });

    const existing = await getSupplierByEmail(email);
    if (!existing || !existing.success) {
      throw new Error('المورد غير موجود في Frappe');
    }

    const supplierName = existing.data.name;
    const response = await apiClient.put(`/Supplier/${supplierName}`, updateData);
    if (!response.data || !response.data.data) {
      throw new Error('فشل في تحديث المورد في Frappe');
    }

    console.log('✅ تم تحديث المورد:', response.data.data);
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('❌ خطأ في تحديث المورد في Frappe:', error);
    const errorMessage = error?.response?.data?.message || error.message || 'فشل تحديث المورد';
    return { success: false, error: errorMessage };
  }
};
// =======================================================================
// Api Validate  Supplier exist
export const getSupplierByEmail = async (email) => {

  const client = await apiClient(); 
  try {
    
    console.log('👤 البحث عن المورد بالبريد الإلكتروني:', email);
    const response = await client.get(`/api/resource/Supplier?filters=[["email_id","=","${email}"]]&limit_page_length=1`);
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      const supplier = response.data.data[0];
      console.log('✅ تم العثور على المورد:', supplier.name);
    return {
      success: true,
        data: supplier,
        message: 'تم العثور على المورد'
      };
    } else {
      console.log('❌ لم يتم العثور على المورد');
    return {
      success: false,
        error: 'لم يتم العثور على المورد',
        data: null
      };
    }
  } catch (error) {
    console.error('❌ خطأ في البحث عن المورد:', error);
    return {
      success: false,
      error: 'حدث خطأ في البحث عن المورد',
      data: null
    };
  }
};


// Api Create Supplier
export const registerVendorApi = async (vendorData) => {
  try {
    
    console.log('🏷️ supplier Data', vendorData);

    // تحقق إن كان المورد موجوداً بالبريد
    const existing = await getSupplierByEmail(vendorData.email || vendorData.email_id || '');
    if (existing && existing.success) {
      console.log('ℹ️ المورد موجود مسبقاً في Frappe:', existing.data.name);
      return { success: true, data: existing.data, message: 'المورد موجود مسبقاً' };
    }

    const payload = {
      supplier_name: vendorData.name || vendorData.company_name || vendorData.email,
      supplier_type: vendorData.company_type || 'Company',
      email_id: vendorData.email,
      mobile_no: vendorData.phone || '',
      tax_id: vendorData.tax_number || vendorData.registration_number || '',
      address_line1: vendorData.address || ''
    };
    
    const client = await apiClient(); 
    const response = await client.post('api/resource/Supplier', payload);
    if (!response.data || !response.data.data) {
      throw new Error('فشل في إنشاء المورد في Frappe');
    }

    console.log('✅ تم إنشاء المورد في Frappe:', response.data.data);
    return { success: true, data: response.data.data, message: 'تم إنشاء المورد' };
  } catch (error) {
    console.log('error:',error);
    console.error('❌ خطأ في إنشاء المورد في Frappe:', error);
    const errorMessage = error?.response?.data?.message || error.message || 'فشل إنشاء المورد';
    return { success: false, error: errorMessage };
  }
};





// جلب المورد بالاسم
export const getSupplierByName = async (name) => {
  try {
    
    console.log('👤 البحث عن المورد بالاسم:', name);
    
    const response = await apiClient.get(`/Supplier?filters=[["supplier_name","=","${name}"]]&limit_page_length=1`);
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      const supplier = response.data.data[0];
      console.log('✅ تم العثور على المورد:', supplier.name);
    return {
      success: true,
        data: supplier,
        message: 'تم العثور على المورد'
      };
    } else {
      console.log('❌ لم يتم العثور على المورد');
    return {
      success: false,
        error: 'لم يتم العثور على المورد',
        data: null
      };
    }
  } catch (error) {
    console.error('❌ خطأ في البحث عن المورد:', error);
    return {
      success: false,
      error: 'حدث خطأ في البحث عن المورد',
      data: null
    };
  }
};

// جلب Asset Owner من Frappe
export const getAssetOwners = async () => {
  try {
    
    console.log('👤 جلب خيارات مالك الأصل من Frappe...');
    
    // محاولة جلب Asset Owners من Frappe
    const response = await apiClient.get('/Asset Owner?limit_page_length=1000');
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      console.log('✅ تم جلب خيارات مالك الأصل من Frappe:', response.data.data);
      return response.data.data;
    } else {
      console.log('⚠️ لم يتم العثور على Asset Owners في Frappe، استخدام القيم الافتراضية');
      const defaultAssetOwners = [
        { name: 'Company', asset_owner_name: 'شركة' },
        { name: 'Supplier', asset_owner_name: 'مورد' },
        { name: 'Customer', asset_owner_name: 'عميل' },
        { name: 'Lessor', asset_owner_name: 'مؤجر' },
        { name: 'Lessee', asset_owner_name: 'مستأجر' }
      ];
      
      return defaultAssetOwners;
    }
    
  } catch (error) {
    console.error('❌ خطأ في جلب خيارات مالك الأصل من Frappe:', error);
    // إرجاع قيم افتراضية في حالة الخطأ
    const defaultAssetOwners = [
      { name: 'Company', asset_owner_name: 'شركة' },
      { name: 'Supplier', asset_owner_name: 'مورد' },
      { name: 'Customer', asset_owner_name: 'عميل' },
      { name: 'Lessor', asset_owner_name: 'مؤجر' },
      { name: 'Lessee', asset_owner_name: 'مستأجر' }
    ];
    
    return defaultAssetOwners;
  }
};

// جلب Asset Owner من Frappe - محاولة أخرى
export const getAssetOwnersFromFrappe = async () => {
  try {
    
    console.log('👤 جلب خيارات مالك الأصل من Frappe (محاولة أخرى)...');
    
    // محاولة جلب Asset Owners من Frappe
    const response = await apiClient.get('/Asset Owner?limit_page_length=1000');
    
    if (response.data && response.data.data && response.data.data.length > 0) {
      console.log('✅ تم جلب خيارات مالك الأصل من Frappe:', response.data.data);
      return response.data.data;
    } else {
      console.log('⚠️ لم يتم العثور على Asset Owners في Frappe، استخدام القيم الافتراضية');
      const defaultAssetOwners = [
        { name: 'Company', asset_owner_name: 'شركة' },
        { name: 'Supplier', asset_owner_name: 'مورد' },
        { name: 'Customer', asset_owner_name: 'عميل' },
        { name: 'Lessor', asset_owner_name: 'مؤجر' },
        { name: 'Lessee', asset_owner_name: 'مستأجر' }
      ];
      
      return defaultAssetOwners;
    }
    
  } catch (error) {
    console.error('❌ خطأ في جلب خيارات مالك الأصل من Frappe:', error);
    // إرجاع قيم افتراضية في حالة الخطأ
    const defaultAssetOwners = [
      { name: 'Company', asset_owner_name: 'شركة' },
      { name: 'Supplier', asset_owner_name: 'مورد' },
      { name: 'Customer', asset_owner_name: 'عميل' },
      { name: 'Lessor', asset_owner_name: 'مؤجر' },
      { name: 'Lessee', asset_owner_name: 'مستأجر' }
    ];
    
    return defaultAssetOwners;
  }
};


// تصدير الكائن الافتراضي للتوافق مع الكود القديم
export default {
  vendorLogin,
  createUserInFrappe,
  createItem,
  createAsset,
  getAssetCategories,
  getLocations,
  getEquipmentItems,
  getAssetsFromFrappe,
  createEquipmentInFrappe,
  getSupplierByEmail,
  getSupplierByName,
  registerVendorApi,
  updateSupplierInFrappe,
  getAssetOwners,
  getAssetOwnersFromFrappe,
  getItemGroups,
  getEquipmentBySupplier
};