
Object.keys(import.meta.env).forEach(key => {
  if (key.startsWith('VITE_')) {
    console.log(`${key}: ${import.meta.env[key]}`)
  }
})




// إعدادات التطبيق الأساسية
export const config = {
  FRAPPE_URL: import.meta.env.VITE_FRAPPE_URL_LOCAL,
  API_KEY: import.meta.env.VITE_API_KEY,
  API_SECRET: import.meta.env.VITE_API_SECRET,
  ENV: import.meta.env.VITE_ENV || 'development',
  GATEWAY_URL: import.meta.env.VITE_GATEWAY_URL,
  
  // إعدادات إضافية
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE
}

// دالة للحصول على إعدادات Frappe
export const getFrappeConfig = () => {
  return {
    baseURL: config.FRAPPE_URL,
    apiKey: config.API_KEY,
    apiSecret: config.API_SECRET,
    headers: {
      'Authorization': `Token ${config.API_KEY}:${config.API_SECRET}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
}

// دالة للحصول على رابط Gateway
export const getGatewayConfig = () => {
  return {
    baseURL: config.GATEWAY_URL,
    timeout: 10000, // 10 ثواني
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
}

// دالة للتحقق من صحة الإعدادات
export const validateConfig = () => {
  const requiredFields = ['FRAPPE_URL', 'API_KEY', 'API_SECRET']
  const missing = requiredFields.filter(field => !config[field])
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing)
    return false
  }
  
  console.log('✅ All required environment variables are loaded')
  return true
}

// دالة مساعدة لبناء URLs
export const buildApiUrl = (endpoint) => {
  const baseUrl = config.FRAPPE_URL.replace(/\/$/, '') // إزالة / من النهاية
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}/api/resource${cleanEndpoint}`
}

// دالة لبناء رابط Gateway
export const buildGatewayUrl = (endpoint) => {
  const baseUrl = config.GATEWAY_URL.replace(/\/$/, '')
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${baseUrl}${cleanEndpoint}`
}

// تصدير الإعدادات كـ default
export default config