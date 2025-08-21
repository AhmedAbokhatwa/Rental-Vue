import { createStore } from 'vuex';
import { auth, db } from '../firebase/config';
import api from '../services/api.js';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';

export default createStore({
  state: {
    // حالة المصادقة
    authStatus: '',
    user: null,
    vendorData: null,
    frappeData: null,
    
    // حالة التحميل
    loading: false,
    
    // رسائل الأخطاء
    error: null,
    
    // بيانات الجلسة
    sessionType: localStorage.getItem('session_type') || '',
    token: localStorage.getItem('firebase_token') || '',
    
    // بيانات المورد
    vendorUid: localStorage.getItem('vendor_uid') || '',
    vendorEmail: localStorage.getItem('vendor_email') || '',
    vendorName: localStorage.getItem('vendor_name') || '',
    frappeSupplierName: localStorage.getItem('frappe_supplier_name') || ''
  },

  mutations: {
    // طلب مصادقة
    AUTH_REQUEST(state) {
      state.authStatus = 'loading';
      state.loading = true;
      state.error = null;
    },

    // نجاح المصادقة
    AUTH_SUCCESS(state, payload) {
      state.authStatus = 'success';
      state.loading = false;
      state.user = payload.user;
      state.vendorData = payload.vendorData;
      state.frappeData = payload.frappeData;
      state.sessionType = payload.sessionType || 'vendor';
      state.token = payload.token || '';
      state.error = null;
    },

    // خطأ في المصادقة
    AUTH_ERROR(state, error) {
      state.authStatus = 'error';
      state.loading = false;
      state.error = error;
      state.user = null;
      state.vendorData = null;
      state.frappeData = null;
    },

    // تسجيل الخروج
    LOGOUT(state) {
      state.authStatus = '';
      state.user = null;
      state.vendorData = null;
      state.frappeData = null;
      state.sessionType = '';
      state.token = '';
      state.vendorUid = '';
      state.vendorEmail = '';
      state.vendorName = '';
      state.frappeSupplierName = '';
      state.error = null;
    },

    // تحديث بيانات المورد
    UPDATE_VENDOR_DATA(state, vendorData) {
      state.vendorData = vendorData;
    },

    // تحديث بيانات Frappe
    UPDATE_FRAPPE_DATA(state, frappeData) {
      state.frappeData = frappeData;
    },

    // تعيين حالة التحميل
    SET_LOADING(state, loading) {
      state.loading = loading;
    },

    // تعيين رسالة خطأ
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    // ✅ اختبار البحث عن المورد الموجود
    async testSupplierSearch({ commit }, { supplierName, email }) {
      try {
        console.log('🧪 اختبار البحث عن المورد في Store:', { supplierName, email });
        
        const results = await api.testSupplierSearch(supplierName, email);
        
        console.log('📊 نتائج اختبار البحث:', results);
        
        return {
          success: true,
          results: results
        };
      } catch (error) {
        console.error('❌ خطأ في اختبار البحث عن المورد:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    // تسجيل دخول المورد
    async loginVendor({ commit }, { email, password }) {
      try {
        commit('AUTH_REQUEST');

        console.log('🚀 بدء تسجيل دخول المورد:', email);

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
            localStorage.setItem('session_type', 'vendor');
            localStorage.setItem('session_user', JSON.stringify(user));
            localStorage.setItem('vendor_uid', user.uid);
            localStorage.setItem('vendor_name', vendorData.name);
            localStorage.setItem('vendor_email', vendorData.email);
            localStorage.setItem('frappe_supplier_name', vendorData.name);
            localStorage.setItem('frappe_supplier_data', JSON.stringify(frappeData));
            localStorage.setItem('vendor_data', JSON.stringify(vendorData));
            
            // تحديث Vuex state
            commit('AUTH_SUCCESS', {
              user: user,
              vendorData: vendorData,
              frappeData: frappeData,
              sessionType: 'vendor',
              token: ''
            });
            
            return {
              success: true,
              message: 'تم تسجيل الدخول بنجاح عبر Frappe',
              user: user,
              vendorData: vendorData,
              source: 'frappe'
            };
          } else {
            console.log('⚠️ لم يتم العثور على بيانات المورد في Frappe');
          }
        } else {
          console.log('⚠️ فشل في تسجيل الدخول عبر Frappe، جاري المحاولة عبر Firebase...');
        }

        // ✅ الخطوة 2: إذا فشل Frappe، نعود إلى Firebase
        console.log('🔐 الخطوة 2: تسجيل الدخول في Firebase...');
        const { signInWithEmailAndPassword } = await import('firebase/auth');
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log('✅ تم تسجيل الدخول في Firebase بنجاح');

        // جلب بيانات المورد من Firestore
        const { doc, getDoc } = await import('firebase/firestore');
        const vendorDocRef = doc(db, 'vendors', user.uid);
        const vendorDoc = await getDoc(vendorDocRef);

        if (vendorDoc.exists()) {
          const vendorData = vendorDoc.data();
          console.log('✅ تم العثور على بيانات المورد في Firestore');

          // التحقق من وجود المورد في Frappe
          let existingSupplier = await api.getSupplierByEmail(email);
          let frappeDataFirebase = null;
          if (existingSupplier && existingSupplier.success) {
            frappeDataFirebase = existingSupplier.data;
          } else {
            console.log('⚠️ المورد غير موجود في Frappe، جاري إنشاؤه...');
            const frappeResult = await api.registerVendor(vendorData);
            if (frappeResult && frappeResult.success) {
              console.log('✅ تم إنشاء المورد في Frappe بنجاح');
              frappeDataFirebase = frappeResult.data;
            } else {
              console.log('⚠️ فشل في إنشاء المورد في Frappe، لكن سنكمل تسجيل الدخول');
              frappeDataFirebase = {
                name: vendorData.name,
                supplier_name: vendorData.name,
                email_id: vendorData.email
              };
            }
          }

          // حفظ بيانات الجلسة
          localStorage.setItem('session_type', 'vendor');
          localStorage.setItem('session_user', JSON.stringify(user));
          localStorage.setItem('vendor_uid', user.uid);
          localStorage.setItem('vendor_name', vendorData.name);
          localStorage.setItem('vendor_email', vendorData.email);
          localStorage.setItem('frappe_supplier_name', vendorData.name);
          localStorage.setItem('frappe_supplier_data', JSON.stringify(frappeDataFirebase));
          localStorage.setItem('vendor_data', JSON.stringify(vendorData));
          if (user.accessToken) {
            localStorage.setItem('firebase_token', user.accessToken);
          }

          // تحديث Vuex state
          commit('AUTH_SUCCESS', {
            user: user,
            vendorData: vendorData,
            frappeData: frappeDataFirebase,
            sessionType: 'vendor',
            token: user.accessToken
          });

          return {
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            user: user,
            vendorData: vendorData,
            source: 'firebase'
          };
        } else {
          throw new Error('بيانات المورد غير موجودة');
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

        commit('AUTH_ERROR', errorMessage);

        return {
          success: false,
          error: errorMessage
        };
      }
    },

    // تسجيل مورد جديد
    async registerVendor({ commit }, vendorData) {
      try {
        commit('AUTH_REQUEST');
        
        console.log('🚀 بدء تسجيل مورد جديد:', vendorData.email);
        
        // إنشاء حساب في Firebase
        const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          vendorData.email, 
          vendorData.password
        );
        
        const user = userCredential.user;
        console.log('✅ تم إنشاء حساب Firebase بنجاح - UID:', user.uid);
        
        // تحديث الملف الشخصي
        await updateProfile(user, {
          displayName: vendorData.name,
          photoURL: vendorData.photoURL || ''
        });
        
        // حفظ بيانات المورد في Firestore
        const { doc, setDoc } = await import('firebase/firestore');
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
        
                 // ربط المورد مع Frappe
         const frappeResult = await api.registerVendor(vendorDoc);
         let frappeData = null;
         
         if (frappeResult.success) {
           console.log('✅ تم ربط المورد مع Frappe بنجاح');
           frappeData = frappeResult.data;
         } else {
           console.log('⚠️ تحذير: فشل في ربط المورد مع Frappe:', frappeResult.error);
           // حتى لو فشل في Frappe، نكمل العملية
           frappeData = {
             name: vendorData.name,
             supplier_name: vendorData.name,
             email_id: vendorData.email
           };
         }
        
        // حفظ بيانات الجلسة
        localStorage.setItem('session_type', 'vendor');
        localStorage.setItem('session_user', JSON.stringify(user));
        localStorage.setItem('vendor_uid', user.uid);
        localStorage.setItem('vendor_name', vendorData.name);
        localStorage.setItem('vendor_email', vendorData.email);
        localStorage.setItem('frappe_supplier_name', vendorData.name);
        if (user.accessToken) {
          localStorage.setItem('firebase_token', user.accessToken);
        }
        
        commit('AUTH_SUCCESS', {
          user: user,
          vendorData: vendorDoc,
          frappeData: frappeData,
          sessionType: 'vendor',
          token: user.accessToken
        });
        
        return {
          success: true,
          message: 'تم تسجيل المورد بنجاح',
          user: user,
          frappeData: frappeData
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
        
        commit('AUTH_ERROR', errorMessage);
        
        return {
          success: false,
          error: errorMessage
        };
      }
    },

    // تسجيل الخروج
    async logout({ commit }) {
      try {
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
        
        // مسح بيانات الجلسة
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
        
        commit('LOGOUT');
        
        console.log('✅ تم تسجيل الخروج بنجاح');
        
        return {
          success: true,
          message: 'تم تسجيل الخروج بنجاح'
        };
        
      } catch (error) {
        console.error('❌ خطأ في تسجيل الخروج:', error);
        commit('AUTH_ERROR', error.message);
        
        return {
          success: false,
          error: error.message
        };
      }
    },

    // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
    async checkAuthOnPageLoad({ commit }) {
      try {
        console.log('🔍 التحقق من حالة تسجيل الدخول عند تحميل الصفحة...');
        
        // ✅ الخطوة 1: التحقق من جلسة Frappe أولاً
        const { checkFrappeSession } = await import('../services/auth.js');
        const frappeSession = await checkFrappeSession();
        
        if (frappeSession.hasSession) {
          console.log('✅ تم العثور على جلسة Frappe نشطة');
          
          // إنشاء كائن المستخدم من بيانات Frappe
          const user = {
            uid: frappeSession.vendorData.name || frappeSession.vendorData.email_id,
            email: frappeSession.vendorData.email_id,
            displayName: frappeSession.vendorData.supplier_name
          };
          
          // إنشاء بيانات المورد
          const vendorData = {
            uid: user.uid,
            name: frappeSession.vendorData.supplier_name,
            email: frappeSession.vendorData.email_id,
            phone: frappeSession.vendorData.mobile_no || '',
            company_name: frappeSession.vendorData.supplier_name,
            company_type: frappeSession.vendorData.supplier_type || 'Company',
            registration_number: frappeSession.vendorData.tax_id || '',
            tax_number: frappeSession.vendorData.tax_id || '',
            address: frappeSession.vendorData.address_line1 || '',
            status: 'approved'
          };
          
          commit('AUTH_SUCCESS', {
            user: user,
            vendorData: vendorData,
            frappeData: frappeSession.vendorData,
            sessionType: 'vendor',
            token: ''
          });
          
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
          localStorage.clear();
          commit('LOGOUT');
          return {
            isAuthenticated: false,
            message: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى'
          };
        }
        
        // التحقق من وجود المورد في Frappe
        const frappeCheck = await api.getSupplierByEmail(vendorEmail);
        
        if (frappeCheck.success) {
          console.log('✅ المستخدم مسجل في كلا النظامين');
          
          // جلب بيانات المورد من Firestore
          const { doc, getDoc } = await import('firebase/firestore');
          const vendorDoc = await getDoc(doc(db, 'vendors', currentUser.uid));
          
          if (vendorDoc.exists()) {
            const vendorData = vendorDoc.data();
            
            commit('AUTH_SUCCESS', {
              user: currentUser,
              vendorData: vendorData,
              frappeData: frappeCheck.data,
              sessionType: 'vendor',
              token: currentUser.accessToken
            });
            
            return {
              isAuthenticated: true,
              vendorData: frappeCheck.data,
              message: 'مرحباً بك مرة أخرى',
              source: 'firebase_frappe'
            };
          }
        } else {
          console.log('⚠️ المستخدم غير موجود في Frappe، لكن سنكمل تسجيل الدخول');
          
          // جلب بيانات المورد من Firestore
          const { doc, getDoc } = await import('firebase/firestore');
          const vendorDoc = await getDoc(doc(db, 'vendors', currentUser.uid));
          
          if (vendorDoc.exists()) {
            const vendorData = vendorDoc.data();
            
            // إنشاء بيانات Frappe افتراضية
            const frappeData = {
              name: vendorData.name,
              supplier_name: vendorData.name,
              email_id: vendorData.email
            };
            
            commit('AUTH_SUCCESS', {
              user: currentUser,
              vendorData: vendorData,
              frappeData: frappeData,
              sessionType: 'vendor',
              token: currentUser.accessToken
            });
            
            return {
              isAuthenticated: true,
              vendorData: frappeData,
              message: 'مرحباً بك مرة أخرى',
              source: 'firebase_only'
            };
          }
        }
        
        console.log('⚠️ المستخدم غير موجود في Firestore');
        return {
          isAuthenticated: false,
          message: 'يجب إعادة تسجيل الدخول'
        };
        
      } catch (error) {
        console.error('❌ خطأ في التحقق من حالة تسجيل الدخول:', error);
        commit('AUTH_ERROR', error.message);
        
        return {
          isAuthenticated: false,
          error: error.message
        };
      }
    },

    // تحديث بيانات المورد
    async updateVendorData({ commit }, updateData) {
      try {
        commit('SET_LOADING', true);
        
        const user = auth.currentUser;
        if (!user) {
          throw new Error('المستخدم غير مسجل الدخول');
        }
        
        // تحديث البيانات في Firestore
        const { doc, updateDoc } = await import('firebase/firestore');
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
            commit('UPDATE_FRAPPE_DATA', frappeResult.data);
          } else {
            console.log('⚠️ فشل في تحديث البيانات في Frappe:', frappeResult.error);
          }
        }
        
        commit('SET_LOADING', false);
        
        return {
          success: true,
          message: 'تم تحديث البيانات بنجاح'
        };
        
      } catch (error) {
        console.error('❌ خطأ في تحديث بيانات المورد:', error);
        commit('SET_ERROR', error.message);
        commit('SET_LOADING', false);
        
        return {
          success: false,
          error: error.message
        };
      }
    },

    // تسجيل الدخول بـ Google
    async loginWithGoogle({ commit }) {
      try {
        console.log('🔐 بدء تسجيل الدخول بـ Google...');
        
        // استخدام Firebase Authentication
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        
        if (result.user) {
          console.log('✅ تم تسجيل الدخول بـ Google بنجاح:', result.user);
          
          // الحصول على ID Token
          const idToken = await result.user.getIdToken();
          
          // حفظ بيانات الجلسة
          const sessionData = {
            type: 'firebase',
            user: result.user,
            token: idToken,
            source: 'firebase'
          };
          
          // حفظ في localStorage
          localStorage.setItem('session_type', 'firebase');
          localStorage.setItem('firebase_token', idToken);
          localStorage.setItem('vendor_uid', result.user.uid);
          localStorage.setItem('vendor_email', result.user.email);
          localStorage.setItem('vendor_name', result.user.displayName || '');
          
          // تحديث state
          commit('AUTH_SUCCESS', sessionData);
          
          return { success: true, source: 'firebase' };
        } else {
          throw new Error('فشل في تسجيل الدخول بـ Google');
        }
      } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول بـ Google:', error);
        commit('AUTH_ERROR', error.message);
        return { success: false, error: error.message };
      }
    },

    // استرداد كلمة المرور
    async resetPassword({ commit }, { email }) {
      try {
        console.log('🔐 بدء إرسال رابط استرداد كلمة المرور...');
        
        // استخدام Firebase Auth لإرسال رابط إعادة تعيين كلمة المرور
        await sendPasswordResetEmail(auth, email);
        
        console.log('✅ تم إرسال رابط استرداد كلمة المرور بنجاح');
        return { success: true };
      } catch (error) {
        console.error('❌ خطأ في إرسال رابط استرداد كلمة المرور:', error);
        
        let errorMessage = 'حدث خطأ في إرسال رابط استرداد كلمة المرور';
        
        // معالجة أخطاء محددة
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'البريد الإلكتروني غير مسجل في النظام';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'البريد الإلكتروني غير صحيح';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'تم إرسال طلبات كثيرة. يرجى الانتظار قبل المحاولة مرة أخرى';
        } else if (error.message.includes('Network Error')) {
          errorMessage = 'خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت';
        }
        
        return { success: false, error: errorMessage };
      }
    },
    loginUser({ commit }, payload) {
      commit('SET_LOADING', true)
      // هنا تحط استدعاء API
      // بعد نجاح تسجيل الدخول:
      commit('SET_LOGGED_IN', true)
      commit('SET_LOADING', false)
    },
    logoutUser({ commit }) {
      commit('SET_LOGGED_IN', false)
        // أي تنظيف إضافي مثل مسح الـ token من localStorage
      localStorage.removeItem('api_key')
      localStorage.removeItem('api_secret')
    }
  },

  getters: {
    // التحقق من تسجيل الدخول
    isLoggedIn: state => !!state.user && !!state.token,
    
    // حالة المصادقة
    authStatus: state => state.authStatus,
    
    // المستخدم الحالي
    currentUser: state => state.user,
    
    // بيانات المورد
    currentVendor: state => state.vendorData,
    
    // بيانات Frappe
    currentFrappeData: state => state.frappeData,
    
    // حالة التحميل
    isLoading: state => state.loading,
    
    // رسالة الخطأ
    errorMessage: state => state.error,
    
    // نوع الجلسة
    sessionType: state => state.sessionType,
    
    // اسم المورد
    vendorName: state => state.vendorName || state.frappeSupplierName,
    
    // معرف المورد
    vendorUid: state => state.vendorUid,
    
    // بريد المورد
    vendorEmail: state => state.vendorEmail
  }
}); 