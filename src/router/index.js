import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import RegisterVendor from '../views/RegisterVendor.vue'
import VendorDashboard from '../views/VendorDashboard.vue'
import EquipmentPage from '../views/EquipmentPage.vue'
import AddEquipmentPage from '../views/AddEquipmentPage.vue'
import CompleteProfile from '../views/CompleteProfile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/register-vendor',
    name: 'RegisterVendor',
    component: RegisterVendor
  },
  {
    path: '/vendor/dashboard',
    name: 'VendorDashboard',
    component: VendorDashboard
  },
  {
    path: '/equipment',
    name: 'Equipment',
    component: EquipmentPage
  },
  {
    path: '/add-equipment',
    name: 'AddEquipment',
    component: AddEquipmentPage
  },
  {
    path: '/complete-profile',
    name: 'CompleteProfile',
    component: CompleteProfile
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 