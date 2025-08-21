import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import api from './api.js';
import { gateway, postLoginWithFirebase } from './gateway.js';

import config from '@/config/frappe';
export const authAPI = {
    async login(username, password) {
      try {
        const response = await fetch(
          `${config.FRAPPE_URL}/api/method/equipment.api.auth.authenticate_and_generate_api_key`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: username,
              password: password
            })
          }
        )

        const result = await response.json()
        if (result.message && result.message.success) {
          const creds = result.message

          // حفظ البيانات في localStorage
          localStorage.setItem("api_key", creds.api_key)
          localStorage.setItem("api_secret", creds.api_secret)
          localStorage.setItem("user_data", creds.data)

          alert("✅ تسجيل الدخول ناجح")
          return result
          // مثال: إعادة توجيه للصفحة الرئيسية
          // window.location.href = "/"
          
        } else {
          alert("❌ خطأ: " + (result.message?.message || "فشل تسجيل الدخول"))
        }
      } catch (err) {
        console.error("Login error:", err)
        alert("⚠ حدث خطأ أثناء تسجيل الدخول")
      }
    },
    logout: async () => {
    localStorage.clear()
    router.push('/login')
  }


}



// دالة التحقق من وجود البريد الإلكتروني
export const checkEmailExists = async (email) => {
  try {
    console.log('🔍 التحقق من وجود البريد الإلكتروني:', email);
    
    // ✅ الخطوة 1: التحقق من Firebase
    console.log('📝 التحقق من Firebase...');
    const vendorsRef = collection(db, 'vendors');
    console.log('vendorsRef',vendorsRef)
    const q = query(vendorsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log('✅ البريد الإلكتروني موجود في Firebase');
      return {
        exists: true,
        message: 'البريد الإلكتروني مستخدم بالفعل'
      };
    }
    
    // ✅ الخطوة 2: التحقق من Frappe
    console.log('🔗 التحقق من Frappe...');
    const frappeCheck = await api.getSupplierByEmail(email);
    
    if (frappeCheck.success) {
      console.log('✅ البريد الإلكتروني موجود في Frappe');
      return {
        exists: true,
        message: 'البريد الإلكتروني مستخدم بالفعل في النظام'
      };
    }
    
    console.log('✅ البريد الإلكتروني متاح في كلا النظامين');
    return {
      exists: false,
      message: 'البريد الإلكتروني متاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في التحقق من البريد الإلكتروني:', error);
    return {
      exists: false,
      error: error.message
    };
  }
};

// دالة تسجيل مورد جديد - تطبيق خطة RPAD
export const registerVendor = async (vendorData) => {
  try {
    console.log('🚀 بدء تطبيق خطة RPAD - تسجيل مورد جديد:', vendorData.email);
    
    // ✅ الخطوة 1: Register - إنشاء حساب في Firebase
    console.log('📝 الخطوة 1: إنشاء حساب Firebase...');
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      vendorData.email, 
      vendorData.password
    );
    
    const user = userCredential.user;
    console.log('✅ تم إنشاء حساب Firebase بنجاح - UID:', user.uid);
    
    // ✅ الخطوة 2: Profile - تحديث الملف الشخصي
    console.log('👤 الخطوة 2: تحديث الملف الشخصي...');
    await updateProfile(user, {
      displayName: vendorData.name,
      photoURL: vendorData.photoURL || ''
    });
    
    // ✅ الخطوة 3: Authentication - حفظ بيانات المورد في Firestore
    console.log('🔐 الخطوة 3: حفظ بيانات المورد في Firestore...');
    const vendorDoc = {
      uid: user.uid,
      name: vendorData.name,
      email: vendorData.email,
      phone: vendorData.phone || '',
      company_name: vendorData.company_name || '',
      company_type: vendorData.company_type || '',
      registration_number: vendorData.registration_number || '',
      tax_number: vendorData.tax_number || '',
      address: vendorData.address || '',
      status: 'approved',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    await setDoc(doc(db, 'vendors', user.uid), vendorDoc);
    console.log('✅ تم حفظ بيانات المورد في Firestore');
    
    // ✅ الخطوة 4: Data Link - ربط المورد مع Frappe
    console.log('🔗 الخطوة 4: ربط المورد مع Frappe...');
    const frappeResult = await api.registerVendor(vendorDoc);
    if (frappeResult.success) {
      console.log('✅ تم ربط المورد مع Frappe بنجاح');
      // حفظ بيانات Frappe في localStorage
      localStorage.setItem('frappe_supplier_data', JSON.stringify(frappeResult.data));
      localStorage.setItem('frappe_supplier_name', vendorData.name);
      
      // ✅ الخطوة 4.5: محاولة إنشاء معدة افتراضية تلقائياً (اختياري)
      console.log('🏗️ الخطوة 4.5: محاولة إنشاء معدة افتراضية تلقائياً...');
      try {
        const defaultEquipmentResult = await createDefaultEquipment(vendorData.name);
        if (defaultEquipmentResult.success) {
          console.log('✅ تم إنشاء معدة افتراضية بنجاح');
          localStorage.setItem('default_equipment_created', 'true');
        } else {
          console.log('⚠️ تحذير: فشل في إنشاء معدة افتراضية:', defaultEquipmentResult.error);
          // لا نوقف العملية بسبب فشل إنشاء المعدة
        }
      } catch (equipmentError) {
        console.log('⚠️ تحذير: خطأ في إنشاء معدة افتراضية:', equipmentError);
        // لا نوقف العملية بسبب فشل إنشاء المعدة
      }
    } else {
      console.log('⚠️ تحذير: فشل في ربط المورد مع Frappe:', frappeResult.error);
    }
    
    // ✅ الخطوة 5: حفظ بيانات الجلسة
    console.log('💾 الخطوة 5: حفظ بيانات الجلسة...');
    const sessionData = {
      type: 'vendor',
      user: user,
      frappeData: frappeResult.success ? frappeResult.data : null
    };
    
    const saved = saveSessionData(sessionData);
    if (!saved) {
      console.warn('⚠️ تحذير: فشل في حفظ بيانات الجلسة');
    }
    
    console.log('🎉 تم تطبيق خطة RPAD بنجاح!');
    
    return {
      success: true,
      message: 'تم تسجيل المورد بنجاح',
      user: user,
      frappeData: frappeResult.data
    };
    
  } catch (error) {
    console.error('❌ خطأ في تسجيل المورد:', error);
    
    let errorMessage = 'حدث خطأ في تسجيل المورد';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
        break;
      case 'auth/invalid-email':
        errorMessage = 'البريد الإلكتروني غير صحيح';
        break;
      case 'auth/weak-password':
        errorMessage = 'كلمة المرور ضعيفة جداً';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'خطأ في الاتصال بالشبكة';
        break;
      default:
        errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// دالة تسجيل دخول المورد - تطبيق خطة RPAD
export const loginVendor = async (email, password) => {
  try {
    console.log('🚀 بدء تطبيق خطة RPAD - تسجيل دخول المورد:', email);
    
    // ✅ الخطوة 1: محاولة تسجيل الدخول عبر Frappe أولاً
    console.log('🔐 الخطوة 1: محاولة تسجيل الدخول عبر Frappe...');
    const frappeLoginResult = await api.vendorLogin(email, password);
    
    if (frappeLoginResult && frappeLoginResult.success) {
      console.log('✅ تم تسجيل الدخول عبر Frappe بنجاح');
      
      // جلب بيانات المورد من Frappe
      console.log('👤 الخطوة 2: جلب بيانات المورد من Frappe...');
      let supplierResult = await api.getSupplierByEmail(email);
      
      if (!supplierResult || !supplierResult.success) {
        // إذا لم يتم العثور عليه بالبريد، نجرب البحث بالاسم
        supplierResult = await api.getSupplierByName(email);
      }
      
      if (supplierResult && supplierResult.success) {
        console.log('✅ تم العثور على بيانات المورد في Frappe');
        const frappeData = supplierResult.data;
        
        // إنشاء كائن المستخدم من بيانات Frappe
        const user = {
          uid: frappeData.name || email,
          email: frappeData.email_id || email,
          displayName: frappeData.supplier_name || email
        };
        
        // إنشاء بيانات المورد
        const vendorData = {
          uid: user.uid,
          name: frappeData.supplier_name || email,
          email: frappeData.email_id || email,
          phone: frappeData.mobile_no || '',
          company_name: frappeData.supplier_name || '',
          company_type: frappeData.supplier_type || 'Company',
          registration_number: frappeData.tax_id || '',
          tax_number: frappeData.tax_id || '',
          address: frappeData.address_line1 || '',
          status: 'approved',
          created_at: new Date(),
          updated_at: new Date()
        };
        
        // حفظ بيانات الجلسة
        console.log('💾 حفظ بيانات الجلسة...');
        localStorage.setItem('vendor_uid', user.uid);
        localStorage.setItem('vendor_name', vendorData.name);
        localStorage.setItem('vendor_email', vendorData.email);
        localStorage.setItem('vendor_status', vendorData.status);
        localStorage.setItem('vendor_data', JSON.stringify(vendorData));
        localStorage.setItem('frappe_supplier_data', JSON.stringify(frappeData));
        localStorage.setItem('frappe_supplier_name', vendorData.name);
        localStorage.setItem('session_type', 'vendor');
        localStorage.setItem('session_user', JSON.stringify(user));
        
        return {
          success: true,
          user: user,
          vendorData: vendorData,
          frappeData: frappeData,
          message: 'تم تسجيل الدخول بنجاح عبر Frappe',
          isNewUser: false
        };
      } else {
        console.log('⚠️ لم يتم العثور على بيانات المورد في Frappe');
      }
    } else {
      console.log('⚠️ فشل في تسجيل الدخول عبر Frappe، جاري المحاولة عبر Firebase...');
    }
    
    // ✅ الخطوة 2: إذا فشل Frappe، نعود إلى Firebase
    console.log('🔐 الخطوة 2: تسجيل الدخول في Firebase...');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('✅ تم تسجيل الدخول في Firebase بنجاح');

    // ربط جلسة Firebase مع Frappe عبر Gateway
    try {
      const idToken = await user.getIdToken();
      await postLoginWithFirebase(idToken, { accountType: 'Supplier', fullName: vendorData?.name || email });
      console.log('🔗 Session linked with Frappe via Gateway');
    } catch (e) {
      console.warn('⚠️ Gateway link failed (will continue):', e?.message);
    }
    
    // ✅ الخطوة 3: جلب بيانات المورد من Firestore
    console.log('👤 الخطوة 3: جلب بيانات المورد من Firestore...');
    const vendorDoc = await getDoc(doc(db, 'vendors', user.uid));
    
    if (vendorDoc.exists()) {
      const vendorData = vendorDoc.data();
      console.log('✅ تم العثور على بيانات المورد في Firestore');
      console.log('📋 بيانات المورد:', vendorData);
      
      // التحقق من وجود المورد في Frappe أولاً
      console.log('🔍 التحقق من وجود المورد في Frappe...');
      let existingSupplierResult = await api.getSupplierByEmail(vendorData.email);
      
      if (!existingSupplierResult.success) {
        // إذا لم يجد بالبريد، ابحث بالاسم
        existingSupplierResult = await api.getSupplierByName(vendorData.name);
      }
      
      if (existingSupplierResult.success) {
        // المورد موجود في Frappe - ربطه مباشرة
        console.log('✅ المورد موجود في Frappe، ربطه مباشرة');
        localStorage.setItem('frappe_supplier_data', JSON.stringify(existingSupplierResult.data));
        localStorage.setItem('frappe_supplier_name', existingSupplierResult.data.name);
      } else {
        // المورد غير موجود في Frappe - محاولة إنشائه
        console.log('🔗 ربط المورد مع Frappe...');
        const frappeResult = await api.registerVendor(vendorData);
        if (frappeResult.success) {
          console.log('✅ تم ربط المورد مع Frappe بنجاح');
          localStorage.setItem('frappe_supplier_data', JSON.stringify(frappeResult.data));
          localStorage.setItem('frappe_supplier_name', vendorData.name);
        } else {
          console.log('⚠️ تحذير: فشل في ربط المورد مع Frappe:', frappeResult.error);
        }
      }
      
      // حفظ بيانات الجلسة
      console.log('💾 حفظ بيانات الجلسة...');
      localStorage.setItem('vendor_uid', user.uid);
      localStorage.setItem('vendor_name', vendorData.name);
      localStorage.setItem('vendor_email', vendorData.email);
      localStorage.setItem('vendor_status', vendorData.status);
      localStorage.setItem('vendor_data', JSON.stringify(vendorData));
      
      return {
        success: true,
        user: user,
        vendorData: vendorData,
        message: 'تم تسجيل الدخول بنجاح',
        isNewUser: false
      };
    } else {
      return {
        success: false,
        error: 'بيانات المورد غير موجودة'
      };
    }
    
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول:', error);
    
    let errorMessage = 'حدث خطأ في تسجيل الدخول';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'البريد الإلكتروني غير مسجل';
        break;
      case 'auth/wrong-password':
        errorMessage = 'كلمة المرور غير صحيحة';
        break;
      case 'auth/invalid-email':
        errorMessage = 'البريد الإلكتروني غير صحيح';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'خطأ في الاتصال بالشبكة';
        break;
      default:
        errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// دالة تسجيل دخول المورد عبر Frappe فقط دون استخدام Firebase.
// هذه الدالة تلجأ إلى واجهة Frappe "api/method/login" لتسجيل الدخول ثم
// تبحث عن بيانات المورد في Frappe عبر البريد الإلكتروني أو الاسم.
// في حال نجاح المصادقة يتم حفظ بيانات الجلسة في localStorage بنفس
// التنسيق المستخدم في وظائف المصادقة الأخرى.
export const loginVendorWithFrappe = async (username, password) => {
  try {
    console.log('🚀 بدء تسجيل الدخول عبر Frappe:', username);

    // نستخدم api.vendorLogin من api.js لتنفيذ عملية تسجيل الدخول إلى Frappe.
    const loginResult = await api.vendorLogin(username, password);
    if (!loginResult || !loginResult.success) {
      console.warn('❌ فشل تسجيل الدخول عبر Frappe:', loginResult?.error);
      return {
        success: false,
        error: loginResult?.error || 'فشل تسجيل الدخول عبر Frappe'
      };
    }

    // جلب بيانات المورد من Frappe بعد تسجيل الدخول
    let supplierResult = await api.getSupplierByEmail(username);
    if (!supplierResult || !supplierResult.success) {
      // إذا لم يتم العثور عليه بالبريد الإلكتروني، نجرب البحث بالاسم (إذا كانت الدالة موجودة)
      if (typeof api.getSupplierByName === 'function') {
        supplierResult = await api.getSupplierByName(username);
      }
    }

    const frappeData = supplierResult && supplierResult.success ? supplierResult.data : null;
    const displayName = frappeData?.supplier_name || username;

    // إنشاء كائن المستخدم من معلومات Frappe
    const user = {
      uid: frappeData?.name || '',
      email: username,
      displayName: displayName
    };

    // حفظ بيانات الجلسة في التخزين المحلي
    const sessionData = {
      type: 'vendor',
      user: user,
      frappeData: frappeData
    };
    saveSessionData(sessionData);

    console.log('✅ تم تسجيل الدخول عبر Frappe بنجاح. المستخدم:', user);
    return {
      success: true,
      user: user,
      frappeData: frappeData,
      message: 'تم تسجيل الدخول عبر Frappe بنجاح'
    };
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول عبر Frappe:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// دالة تسجيل دخول المورد بـ Google
export const loginWithGoogle = async () => {
  try {
    console.log('🔍 بدء تسجيل الدخول بـ Google');
    
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    console.log('📝 محاولة فتح نافذة تسجيل الدخول بـ Google...');
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    console.log('✅ تم تسجيل الدخول بـ Google بنجاح');
    console.log('👤 بيانات المستخدم:', {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    });
    
    // التحقق من وجود بيانات المورد في Firestore
    console.log('🔍 البحث عن بيانات المورد في Firestore...');
    const vendorDoc = await getDoc(doc(db, 'vendors', user.uid));
    
    if (vendorDoc.exists()) {
      // المورد موجود - جلب البيانات
      console.log('✅ تم العثور على بيانات المورد');
      const vendorData = vendorDoc.data();
      console.log('📋 بيانات المورد:', vendorData);
      
      // التحقق من وجود المورد في Frappe أولاً
      console.log('🔍 التحقق من وجود المورد في Frappe...');
      let existingSupplierResult = await api.getSupplierByEmail(vendorData.email);
      
      if (!existingSupplierResult.success) {
        // إذا لم يجد بالبريد، ابحث بالاسم
        existingSupplierResult = await api.getSupplierByName(vendorData.name);
      }
      
      if (existingSupplierResult.success) {
        // المورد موجود في Frappe - ربطه مباشرة
        console.log('✅ المورد موجود في Frappe، ربطه مباشرة');
        localStorage.setItem('frappe_supplier_data', JSON.stringify(existingSupplierResult.data));
        localStorage.setItem('frappe_supplier_name', existingSupplierResult.data.name);
      } else {
        // المورد غير موجود في Frappe - محاولة إنشائه
        console.log('🔗 ربط المورد مع Frappe...');
        const frappeResult = await api.registerVendor(vendorData);
        if (frappeResult.success) {
          console.log('✅ تم ربط المورد مع Frappe بنجاح');
          localStorage.setItem('frappe_supplier_data', JSON.stringify(frappeResult.data));
          localStorage.setItem('frappe_supplier_name', vendorData.name);
        } else {
          console.log('⚠️ تحذير: فشل في ربط المورد مع Frappe:', frappeResult.error);
        }
      }
      
      // التحقق من وجود معدة افتراضية (اختياري)
      console.log('🔍 التحقق من وجود معدة افتراضية...');
      const defaultEquipmentCreated = localStorage.getItem('default_equipment_created');
      if (!defaultEquipmentCreated) {
        console.log('🏗️ محاولة إنشاء معدة افتراضية للمورد الموجود...');
        try {
          const defaultEquipmentResult = await createDefaultEquipment(vendorData.name);
          if (defaultEquipmentResult.success) {
            console.log('✅ تم إنشاء معدة افتراضية بنجاح');
            localStorage.setItem('default_equipment_created', 'true');
          } else {
            console.log('⚠️ تحذير: فشل في إنشاء معدة افتراضية:', defaultEquipmentResult.error);
            // لا نوقف العملية بسبب فشل إنشاء المعدة
          }
        } catch (equipmentError) {
          console.log('⚠️ تحذير: خطأ في إنشاء معدة افتراضية:', equipmentError);
          // لا نوقف العملية بسبب فشل إنشاء المعدة
        }
      }
      
      // حفظ بيانات الجلسة
      localStorage.setItem('vendor_uid', user.uid);
      localStorage.setItem('vendor_name', vendorData.name);
      localStorage.setItem('vendor_email', vendorData.email);
      localStorage.setItem('vendor_status', vendorData.status);
      localStorage.setItem('vendor_data', JSON.stringify(vendorData));
      
      return {
        success: true,
        user: user,
        vendorData: vendorData,
        message: 'تم تسجيل الدخول بنجاح',
        isNewUser: false
      };
    } else {
      // مستخدم جديد - إنشاء بيانات المورد
      console.log('🆕 مستخدم جديد - إنشاء بيانات المورد...');
      const newVendorData = {
        uid: user.uid,
        name: user.displayName || 'مستخدم جديد',
        email: user.email,
        phone: user.phoneNumber || '',
        company_name: '',
        company_type: '',
        registration_number: '',
        tax_number: '',
        address: '',
        status: 'approved',
        created_at: new Date(),
        updated_at: new Date(),
        isGoogleUser: true,
        photoURL: user.photoURL || ''
      };
      
      console.log('💾 حفظ بيانات المورد الجديد في Firestore...');
      await setDoc(doc(db, 'vendors', user.uid), newVendorData);
      console.log('✅ تم حفظ بيانات المورد الجديد بنجاح');
      
      // التحقق من وجود المورد في Frappe أولاً (للمستخدمين الجدد أيضاً)
      console.log('🔍 التحقق من وجود المورد في Frappe...');
      let existingSupplierResult = await api.getSupplierByEmail(newVendorData.email);
      
      if (!existingSupplierResult.success) {
        // إذا لم يجد بالبريد، ابحث بالاسم
        existingSupplierResult = await api.getSupplierByName(newVendorData.name);
      }
      
      if (existingSupplierResult.success) {
        // المورد موجود في Frappe - ربطه مباشرة
        console.log('✅ المورد موجود في Frappe، ربطه مباشرة');
        localStorage.setItem('frappe_supplier_data', JSON.stringify(existingSupplierResult.data));
        localStorage.setItem('frappe_supplier_name', existingSupplierResult.data.name);
      } else {
        // المورد غير موجود في Frappe - محاولة إنشائه
        console.log('🔗 ربط المورد الجديد مع Frappe...');
        const frappeResult = await api.registerVendor(newVendorData);
        if (frappeResult.success) {
          console.log('✅ تم ربط المورد الجديد مع Frappe بنجاح');
          localStorage.setItem('frappe_supplier_data', JSON.stringify(frappeResult.data));
          localStorage.setItem('frappe_supplier_name', newVendorData.name);
        } else {
          console.log('⚠️ تحذير: فشل في ربط المورد الجديد مع Frappe:', frappeResult.error);
        }
      }
      
      // محاولة إنشاء معدة افتراضية للمورد الجديد (اختياري)
      console.log('🏗️ محاولة إنشاء معدة افتراضية للمورد الجديد...');
      try {
        const defaultEquipmentResult = await createDefaultEquipment(newVendorData.name);
        if (defaultEquipmentResult.success) {
          console.log('✅ تم إنشاء معدة افتراضية بنجاح');
          localStorage.setItem('default_equipment_created', 'true');
        } else {
          console.log('⚠️ تحذير: فشل في إنشاء معدة افتراضية:', defaultEquipmentResult.error);
          // لا نوقف العملية بسبب فشل إنشاء المعدة
        }
      } catch (equipmentError) {
        console.log('⚠️ تحذير: خطأ في إنشاء معدة افتراضية:', equipmentError);
        // لا نوقف العملية بسبب فشل إنشاء المعدة
      }
      
      // حفظ بيانات الجلسة
      localStorage.setItem('vendor_uid', user.uid);
      localStorage.setItem('vendor_name', newVendorData.name);
      localStorage.setItem('vendor_email', newVendorData.email);
      localStorage.setItem('vendor_status', newVendorData.status);
      localStorage.setItem('vendor_data', JSON.stringify(newVendorData));
      
      return {
        success: true,
        user: user,
        vendorData: newVendorData,
        message: 'تم إنشاء حساب جديد بنجاح',
        isNewUser: true
      };
    }
    
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول بـ Google:', error);
    console.error('🔍 تفاصيل الخطأ:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    });
    
    let errorMessage = 'حدث خطأ في تسجيل الدخول بـ Google';
    
    switch (error.code) {
      case 'auth/popup-closed-by-user':
        errorMessage = 'تم إغلاق نافذة تسجيل الدخول';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'تم حظر نافذة تسجيل الدخول. يرجى السماح بالنوافذ المنبثقة';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'تم إلغاء طلب تسجيل الدخول';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'خطأ في الاتصال بالشبكة';
        break;
      case 'permission-denied':
        errorMessage = 'خطأ في الأذونات. يرجى التحقق من قواعد Firestore';
        break;
      case 'unavailable':
        errorMessage = 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً';
        break;
      default:
        errorMessage = `خطأ غير متوقع: ${error.message}`;
    }
    
    return {
      success: false,
      error: errorMessage,
      details: error.code
    };
  }
};

// دالة تسجيل الخروج
export const logoutVendor = async () => {
  try {
    await signOut(auth);
    
    // مسح بيانات الجلسة باستخدام الدالة الجديدة
    clearSessionData();
    
    console.log('✅ تم تسجيل الخروج بنجاح');
    
    return {
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في تسجيل الخروج:', error);
    
    return {
      success: false,
      error: error.message
    };
  }
};

// دالة جلب بيانات المورد الحالي
export const getCurrentVendor = async () => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      return {
        success: false,
        error: 'المستخدم غير مسجل الدخول'
      };
    }
    
    // جلب البيانات من Frappe أولاً
    const vendorEmail = localStorage.getItem('vendor_email');
    if (vendorEmail) {
      const frappeResult = await api.getSupplierByEmail(vendorEmail);
      
      if (frappeResult.success) {
        console.log('✅ تم جلب بيانات المورد من Frappe');
        return {
          success: true,
          vendorData: frappeResult.data,
          source: 'frappe'
        };
      }
    }
    
    // إذا فشل جلب البيانات من Frappe، نجلب من Firestore
    const vendorDoc = await getDoc(doc(db, 'vendors', user.uid));
    
    if (!vendorDoc.exists()) {
      return {
        success: false,
        error: 'بيانات المورد غير موجودة'
      };
    }
    
    return {
      success: true,
      vendorData: vendorDoc.data(),
      source: 'firestore'
    };
    
  } catch (error) {
    console.error('❌ خطأ في جلب بيانات المورد:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// دالة تحديث بيانات المورد
export const updateVendorData = async (updateData) => {
  try {
    console.log('🔍 تحديث بيانات المورد:', updateData);
    
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: 'المستخدم غير مسجل الدخول'
      };
    }
    
    // تحديث البيانات في Firestore
    await updateDoc(doc(db, 'vendors', user.uid), {
      ...updateData,
      updated_at: new Date()
    });
    
    // تحديث البيانات في Frappe
    const vendorEmail = localStorage.getItem('vendor_email');
    if (vendorEmail) {
      const frappeResult = await api.updateSupplierInFrappe(vendorEmail, updateData);
      
      if (frappeResult.success) {
        console.log('✅ تم تحديث البيانات في Frappe');
      } else {
        console.log('⚠️ فشل في تحديث البيانات في Frappe:', frappeResult.error);
      }
    }
    
    // تحديث localStorage
    const currentData = JSON.parse(localStorage.getItem('vendor_data') || '{}');
    const updatedData = { ...currentData, ...updateData };
    localStorage.setItem('vendor_data', JSON.stringify(updatedData));
    
    return {
      success: true,
      message: 'تم تحديث البيانات بنجاح'
    };
    
  } catch (error) {
    console.error('❌ خطأ في تحديث بيانات المورد:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// دالة إعادة تعيين كلمة المرور
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    
    return {
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني'
    };
    
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين كلمة المرور:', error);
    
    let errorMessage = 'حدث خطأ في إعادة تعيين كلمة المرور';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'البريد الإلكتروني غير مسجل';
        break;
      case 'auth/invalid-email':
        errorMessage = 'البريد الإلكتروني غير صحيح';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'خطأ في الاتصال بالشبكة';
        break;
      default:
        errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// دالة التحقق من حالة تسجيل الدخول
export const checkAuthState = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// دالة التحقق من وجود مستخدم مسجل الدخول
export const isAuthenticated = () => {
  const vendorUid = localStorage.getItem('vendor_uid');
  const vendorEmail = localStorage.getItem('vendor_email');
  return !!(vendorUid && vendorEmail);
};

// دالة التحقق من وجود جلسة Frappe نشطة
export const checkFrappeSession = async () => {
  try {
    console.log('🔍 التحقق من وجود جلسة Frappe نشطة...');
    
    // التحقق من وجود بيانات الجلسة في localStorage
    const sessionType = localStorage.getItem('session_type');
    const vendorEmail = localStorage.getItem('vendor_email');
    const frappeSupplierData = localStorage.getItem('frappe_supplier_data');
    
    if (!sessionType || sessionType !== 'vendor' || !vendorEmail) {
      console.log('❌ لا توجد جلسة Frappe نشطة');
      return {
        hasSession: false,
        message: 'لا توجد جلسة نشطة'
      };
    }
    
    // التحقق من صحة البيانات في Frappe
    const frappeCheck = await api.getSupplierByEmail(vendorEmail);
    
    if (frappeCheck.success) {
      console.log('✅ جلسة Frappe نشطة وصحيحة');
      return {
        hasSession: true,
        vendorData: frappeCheck.data,
        message: 'جلسة Frappe نشطة'
      };
    } else {
      console.log('❌ جلسة Frappe غير صحيحة');
      // مسح البيانات القديمة
      localStorage.removeItem('session_type');
      localStorage.removeItem('vendor_email');
      localStorage.removeItem('frappe_supplier_data');
      
      return {
        hasSession: false,
        message: 'انتهت صلاحية الجلسة'
      };
    }
    
  } catch (error) {
    console.error('❌ خطأ في التحقق من جلسة Frappe:', error);
    return {
      hasSession: false,
      error: error.message
    };
  }
};

// دالة التحقق من حالة تسجيل الدخول عند تحميل الصفحة - محسنة
export const checkAuthOnPageLoad = async () => {
  try {
    console.log('🔍 التحقق من حالة تسجيل الدخول عند تحميل الصفحة...');
    
    // ✅ الخطوة 1: التحقق من جلسة Frappe أولاً
    const frappeSession = await checkFrappeSession();
    
    if (frappeSession.hasSession) {
      console.log('✅ تم العثور على جلسة Frappe نشطة');
      return {
        isAuthenticated: true,
        vendorData: frappeSession.vendorData,
        message: 'مرحباً بك مرة أخرى',
        source: 'frappe'
      };
    }
    
    // ✅ الخطوة 2: إذا لم توجد جلسة Frappe، نتحقق من Firebase
    const vendorUid = localStorage.getItem('vendor_uid');
    const vendorEmail = localStorage.getItem('vendor_email');
    
    if (!vendorUid || !vendorEmail) {
      console.log('❌ لا توجد بيانات تسجيل دخول محفوظة');
      return {
        isAuthenticated: false,
        message: 'يرجى تسجيل الدخول'
      };
    }
    
    // التحقق من حالة Firebase
    const currentUser = auth.currentUser;
    if (!currentUser || currentUser.uid !== vendorUid) {
      console.log('❌ المستخدم غير مسجل في Firebase');
      // مسح البيانات القديمة
      localStorage.clear();
      return {
        isAuthenticated: false,
        message: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى'
      };
    }
    
    // التحقق من وجود المورد في Frappe
    const frappeCheck = await api.getSupplierByEmail(vendorEmail);
    
    if (frappeCheck.success) {
      console.log('✅ المستخدم مسجل في كلا النظامين');
      return {
        isAuthenticated: true,
        vendorData: frappeCheck.data,
        message: 'مرحباً بك مرة أخرى',
        source: 'firebase_frappe'
      };
    } else {
      console.log('⚠️ المستخدم غير موجود في Frappe');
      return {
        isAuthenticated: false,
        message: 'يجب إعادة تسجيل الدخول'
      };
    }
    
  } catch (error) {
    console.error('❌ خطأ في التحقق من حالة تسجيل الدخول:', error);
    return {
      isAuthenticated: false,
      error: error.message
    };
  }
};

// دالة اختبار الاتصال بـ Frappe
export const testFrappeConnection = async () => {
  try {
    console.log('🔍 اختبار الاتصال بـ Frappe...');
    const result = await api.testConnection();
    
    if (result.success) {
      console.log('✅ الاتصال بـ Frappe يعمل بشكل صحيح');
      return {
        success: true,
        message: 'الاتصال بـ Frappe يعمل بشكل صحيح'
      };
    } else {
      console.log('❌ فشل في الاتصال بـ Frappe:', result.error);
      return {
        success: false,
        error: result.error
      };
    }
  } catch (error) {
    console.error('❌ خطأ في اختبار الاتصال:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// دالة إنشاء معدة افتراضية تلقائياً
export const createDefaultEquipment = async (supplierName) => {
  try {
    console.log('🏗️ إنشاء معدة افتراضية للمورد:', supplierName);
    
    // إنشاء كود فريد للمعدة
    const timestamp = Date.now();
    const itemCode = `EQ-${supplierName.replace(/\s+/g, '-')}-${timestamp}`;
    
    // الخطوة 1: إنشاء Item
    console.log('📦 الخطوة 1: إنشاء Item...');
    const itemResult = await api.createItem({
      item_code: itemCode,
      item_name: 'معدة افتراضية',
      item_group: 'معدات',
      asset_category: 'معدات البناء' // فئة افتراضية
    });
    
    if (!itemResult.success) {
      console.error('❌ فشل في إنشاء Item:', itemResult.error);
      return {
        success: false,
        error: `فشل في إنشاء Item: ${itemResult.error}`
      };
    }
    
    console.log('✅ تم إنشاء Item بنجاح:', itemResult.item_code);
    
    // الخطوة 2: إنشاء Asset
    console.log('🏗️ الخطوة 2: إنشاء Asset...');
    const assetResult = await api.createAsset({
      asset_name: 'معدة افتراضية',
      asset_category: 'معدات البناء',
      item_code: itemResult.item_code,
      item_name: 'معدة افتراضية',
      supplier: supplierName,
      location: 'الرياض',
      description: 'معدة افتراضية تم إنشاؤها تلقائياً عند تسجيل المورد',
      technical_condition: 'جيد',
      available_for_use_date: new Date().toISOString().split('T')[0],
      net_purchase_amount: 1000,
      asset_quantity: 1
    });
    
    if (!assetResult.success) {
      console.error('❌ فشل في إنشاء Asset:', assetResult.error);
      return {
        success: false,
        error: `فشل في إنشاء Asset: ${assetResult.error}`
      };
    }
    
    console.log('✅ تم إنشاء Asset بنجاح');
    
    return {
      success: true,
      message: 'تم إنشاء معدة افتراضية بنجاح',
      item_code: itemResult.item_code,
      asset_data: assetResult.data
    };
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء معدة افتراضية:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// دالة حفظ معلومات الجلسة
export const saveSessionData = (sessionData) => {
  try {
    console.log('💾 حفظ بيانات الجلسة:', sessionData);
    
    // حفظ نوع الحساب
    localStorage.setItem('session_type', sessionData.type);
    
    // حفظ بيانات المستخدم
    localStorage.setItem('session_user', JSON.stringify(sessionData.user));
    
    // حفظ بيانات Frappe إذا كانت موجودة
    if (sessionData.frappeData) {
      localStorage.setItem('session_frappe_data', JSON.stringify(sessionData.frappeData));
    }
    
    // حفظ بيانات إضافية حسب نوع الحساب
    if (sessionData.type === 'vendor') {
      localStorage.setItem('vendor_uid', sessionData.user.uid);
      localStorage.setItem('vendor_name', sessionData.user.displayName || sessionData.user.name);
      localStorage.setItem('vendor_email', sessionData.user.email);
      localStorage.setItem('vendor_status', 'approved');
      localStorage.setItem('frappe_supplier_name', sessionData.user.displayName || sessionData.user.name);
      localStorage.setItem('default_equipment_created', 'true');
    } else {
      localStorage.setItem('user_uid', sessionData.user.uid);
      localStorage.setItem('user_name', sessionData.user.displayName || sessionData.user.name);
      localStorage.setItem('user_email', sessionData.user.email);
      localStorage.setItem('user_status', 'active');
    }
    
    // حفظ بيانات إضافية للتوافق مع النظام القديم
    if (sessionData.user) {
      localStorage.setItem('current_user', JSON.stringify(sessionData.user));
      if (sessionData.user.accessToken) {
        localStorage.setItem('firebase_token', sessionData.user.accessToken);
      }
    }
    
    console.log('✅ تم حفظ بيانات الجلسة بنجاح');
    return true;
  } catch (error) {
    console.error('❌ خطأ في حفظ بيانات الجلسة:', error);
    return false;
  }
};

// دالة جلب معلومات الجلسة الحالية
export const getCurrentSession = () => {
  try {
    const sessionType = localStorage.getItem('session_type');
    const sessionUser = localStorage.getItem('session_user');
    const sessionFrappeData = localStorage.getItem('session_frappe_data');
    
    if (!sessionType || !sessionUser) {
      return null;
    }
    
    const user = JSON.parse(sessionUser);
    const frappeData = sessionFrappeData ? JSON.parse(sessionFrappeData) : null;
    
    return {
      type: sessionType,
      user: user,
      frappeData: frappeData
    };
  } catch (error) {
    console.error('❌ خطأ في جلب بيانات الجلسة:', error);
    return null;
  }
};

// دالة التحقق من وجود جلسة نشطة
export const hasActiveSession = () => {
  const session = getCurrentSession();
  return session !== null;
};

// دالة مسح بيانات الجلسة
export const clearSessionData = () => {
  try {
    console.log('🗑️ مسح بيانات الجلسة');
    
    // مسح جميع بيانات الجلسة
    localStorage.removeItem('session_type');
    localStorage.removeItem('session_user');
    localStorage.removeItem('session_frappe_data');
    localStorage.removeItem('vendor_uid');
    localStorage.removeItem('vendor_name');
    localStorage.removeItem('vendor_email');
    localStorage.removeItem('vendor_status');
    localStorage.removeItem('frappe_supplier_name');
    localStorage.removeItem('default_equipment_created');
    localStorage.removeItem('user_uid');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_status');
    localStorage.removeItem('vendor_data');
    localStorage.removeItem('frappe_supplier_data');
    localStorage.removeItem('firebase_token');
    
    console.log('✅ تم مسح بيانات الجلسة بنجاح');
    return true;
  } catch (error) {
    console.error('❌ خطأ في مسح بيانات الجلسة:', error);
    return false;
  }
}; 