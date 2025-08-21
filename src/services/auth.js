import config from '@/config/frappe';
import axios from 'axios';
import router from '@/router';

export const authAPI = {
  async login(username, password) {
    try {
      const response = await fetch(
        `${config.FRAPPE_URL}/api/method/equipment.api.auth.authenticate_and_generate_api_key`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        }
      );

      const result = await response.json();

      if (result.message && result.message.success) {
        const creds = result.message;
        const { api_key, api_secret, sid, role, user_type, email, full_name } = creds.data;

        localStorage.setItem("api_key", api_key);
        localStorage.setItem("api_secret", api_secret);
        localStorage.setItem("sid", sid);
        localStorage.setItem("role", role);
        localStorage.setItem("user_type", user_type);
        localStorage.setItem("email", email);
        localStorage.setItem('frappe_supplier_name', full_name.toLowerCase());

        // جلب CSRF token مباشرة بعد تسجيل الدخول
        try {
          await authAPI.fetchAndStoreCsrfToken(api_key, api_secret);
        } catch (csrfError) {
          console.warn("⚠️ Could not fetch CSRF token immediately:", csrfError);
        }

        alert("✅ تسجيل الدخول ناجح");
        return result;
      } else {
        alert("❌ خطأ: " + (result.message?.message || "فشل تسجيل الدخول"));
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("⚠ حدث خطأ أثناء تسجيل الدخول");
    }
  },

  async fetchAndStoreCsrfToken(api_key, api_secret) {
    try {
      const headers = api_key && api_secret ? { 'Authorization': `token ${api_key}:${api_secret}` } : {};
      const res = await axios.get(`${config.FRAPPE_URL}/api/method/equipment.api.middleware.get_csrf_token`, {
        withCredentials: true,
        headers
      });
       console.log('res ',res)
      console.log('res data',res.data)
      const csrf_token = res.data?.csrf_token || res.data?.message.message; // حسب طريقة رد السيرفر
      if (csrf_token) {
        localStorage.setItem("csrf_token", csrf_token);
        console.log("🛡️ CSRF Token stored:", csrf_token);
        return csrf_token;
      }
    } catch (error) {
      console.warn("⚠️ Could not fetch CSRF token:", error);
      return null;
    }
  },

  logout: async () => {
    localStorage.clear();
    router.push('/login');
  }
};


export const apiClient = async () => {
  const api_key = localStorage.getItem("api_key");
  const api_secret = localStorage.getItem("api_secret");
  const sid = localStorage.getItem("sid");
  let csrf_token = localStorage.getItem("csrf_token");

  if (!config?.FRAPPE_URL) throw new Error('FRAPPE_URL is not defined');

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };

  if (api_key && api_secret) headers['Authorization'] = `token ${api_key}:${api_secret}`;

  // جلب CSRF token إذا كان موجود sid بدون token
  if (!csrf_token && sid) {
    csrf_token = await authAPI.fetchAndStoreCsrfToken(api_key, api_secret);
  }

  if (csrf_token) headers['X-Frappe-CSRF-Token'] = csrf_token;

  const client = axios.create({
    baseURL: config.FRAPPE_URL,
    timeout: 30000,
    withCredentials: true,
    headers
  });

  client.interceptors.response.use(
    res => res,
    async error => {
      const status = error.response?.status;
      const msg = error.response?.data?.message || '';

      // Retry CSRF token مرة واحدة فقط
      if (status === 403 && /CSRF|Invalid Request/i.test(msg) && !error.config._retry) {
        console.log("🔄 CSRF token expired, fetching new one...");
        error.config._retry = true;
        const newToken = await authAPI.fetchAndStoreCsrfToken(api_key, api_secret);
        if (newToken) {
          error.config.headers['X-Frappe-CSRF-Token'] = newToken;
          return client.request(error.config);
        }
      }

      if (status === 401) {
        alert("⚠️ انتهت صلاحية الجلسة أو بيانات الدخول غير صحيحة");
        localStorage.clear();
        router.push('/login');
      }

      return Promise.reject(error);
    }
  );

  return client;
};

//   try {
//     console.log('🔍 session validation');

//     const sessionType = localStorage.getItem('session_type');
//     const vendorEmail = localStorage.getItem('vendor_email');

//     if (!sessionType || sessionType !== 'vendor' || !vendorEmail) {
//       console.log('❌ لا توجد جلسة Frappe نشطة');
//       return { hasSession: false, message: 'لا توجد جلسة نشطة' };
//     }

//     // 🟢 استدعاء API للتحقق من الإيميل (تأكد ان عندك api.getSupplierByEmail)
//     // const frappeCheck = await api.getSupplierByEmail(vendorEmail);
//     const frappeCheck = { 
//             success: true,
//             data: { email: vendorEmail } }; // مؤقت للتجربة

//     if (frappeCheck.success) {
//       console.log('✅ جلسة Frappe نشطة وصحيحة');
//       return { 
//           hasSession: true,
//           vendorData: frappeCheck.data,
//           message: 'جلسة Frappe نشطة' };
//     } else {
//       console.log('❌ جلسة Frappe غير صحيحة');
//       localStorage.removeItem('session_type');
//       localStorage.removeItem('vendor_email');
//       localStorage.removeItem('frappe_supplier_data');

//       return { hasSession: false, message: 'انتهت صلاحية الجلسة' };
//     }

//   } catch (error) {
//     console.error('❌ خطأ في التحقق من جلسة Frappe:', error);
//     return { hasSession: false, error: error.message };
//   }
// };