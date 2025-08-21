const config = {
  FRAPPE_URL: import.meta.env.VITE_FRAPPE_URL_LOCAL,
  ENV: import.meta.env.VITE_ENV || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE
}
export default config;
// دالة لجلب API Key/Secret من السيرفر
export const generateCredential = async (username, password) => {
  try {
    const response = await fetch(`${config.FRAPPE_URL}/api/method/equipment.api.auth.authenticate_and_generate_api_key`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.message && data.message.success) {
      const creds = data.message;
      // تخزين في localStorage مثلاً
      localStorage.setItem("api_key", creds.api_key);
      localStorage.setItem("api_secret", creds.api_secret);
      return creds;
    } else {
      throw new Error(data.message?.message || "Login failed");
    }
  } catch (err) {
    console.error("❌ Error generating credentials:", err);
    return null;
  }
};

// دالة للحصول على إعدادات Frappe بعد تسجيل الدخول
export const getFrappeConfig = () => {
  const apiKey = localStorage.getItem("api_key");
  const apiSecret = localStorage.getItem("api_secret");

  return {
    baseURL: config.FRAPPE_URL,
    headers: {
      "Authorization": `token ${apiKey}:${apiSecret}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  }
}
