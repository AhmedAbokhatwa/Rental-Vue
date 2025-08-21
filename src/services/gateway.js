import axios from 'axios'
import { getAuth } from 'firebase/auth'

const GATEWAY_BASE_URL = import.meta?.env?.VITE_GATEWAY_URL || 'http://localhost:8080'

export const gateway = axios.create({
  baseURL: GATEWAY_BASE_URL,
  withCredentials: true,
  headers: { 'Accept': 'application/json' }
})

// Inject Firebase ID token automatically for protected routes
gateway.interceptors.request.use(async (config) => {
  try {
    const user = getAuth().currentUser
    if (user) {
      const token = await user.getIdToken()
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {}
  return config
})

// Auth: requires Firebase ID token in Authorization header
export const postLoginWithFirebase = async (idToken, { accountType, fullName }) => {
  const res = await gateway.post('/auth/login-with-firebase', { accountType, fullName }, {
    headers: { Authorization: `Bearer ${idToken}` }
  })
  return res.data
}

// Catalog endpoints
export const gwGetAssetCategories = async () => {
  const res = await gateway.get('/catalog/asset-categories')
  return res.data?.data || []
}

export const gwGetLocations = async () => {
  const res = await gateway.get('/catalog/locations')
  return res.data?.data || []
}

export const gwGetAssetOwners = async () => {
  const res = await gateway.get('/catalog/asset-owners')
  return res.data?.data || []
}

export const gwGetItemGroups = async () => {
  const res = await gateway.get('/catalog/item-groups')
  return res.data?.data || []
}

// Equipment
export const gwCreateEquipment = async (payload) => {
  const res = await gateway.post('/equipment', payload)
  return res.data
}

export const gwGetAssets = async () => {
  const res = await gateway.get('/equipment/assets')
  return res.data?.data || []
}

export default {
  postLoginWithFirebase,
  gwGetAssetCategories,
  gwGetLocations,
  gwGetAssetOwners,
  gwGetItemGroups,
  gwCreateEquipment,
  gwGetAssets
}


