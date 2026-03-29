import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView from '@/views/HomeView.vue'
import CatalogView from '@/views/CatalogView.vue'
import ProductView from '@/views/ProductView.vue'
import CartView from '@/views/CartView.vue'
import CheckoutView from '@/views/ChekoutView.vue'
import OrdersView from '@/views/OrdersView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import WishlistView from '@/views/WishlistView.vue'

import AdminLayout from '@/views/admin/AdminLayout.vue'
import AdminProducts from '@/views/admin/AdminProducts.vue'
import AdminCategories from '@/views/admin/AdminCategories.vue'
import AdminBrands from '@/views/admin/AdminBrands.vue'
import AdminOrders from '@/views/admin/AdminOrders.vue'
import AdminPromocodes from '@/views/admin/AdminPromocodes.vue'

const routes = [
  { path: '/',             component: HomeView },
  { path: '/catalog',      component: CatalogView },
  { path: '/product/:id',  component: ProductView },
  { path: '/cart',         component: CartView },
  { path: '/wishlist',     component: WishlistView },
  { path: '/checkout',     component: CheckoutView,  meta: { requiresAuth: true } },
  { path: '/orders',       component: OrdersView,    meta: { requiresAuth: true } },
  { path: '/login',        component: LoginView },
  { path: '/register',     component: RegisterView },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '',             redirect: '/admin/products' },
      { path: 'products',     component: AdminProducts },
      { path: 'categories',   component: AdminCategories },
      { path: 'brands',       component: AdminBrands },
      { path: 'orders',       component: AdminOrders },
      { path: 'promocodes',   component: AdminPromocodes },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) return '/login'
  if (to.meta.requiresAdmin && !auth.isAdmin) return '/'
})

export default router