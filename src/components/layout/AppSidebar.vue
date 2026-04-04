<template>
  <aside :class="['sidebar', mobileOpen ? 'sidebar--open' : '']">
    <!-- Шапка сайдбара -->
    <div class="sidebar-header">
      <RouterLink to="/" class="sidebar-logo">MUMU</RouterLink>
      <button class="sidebar-close" @click="$emit('close')">✕</button>
    </div>

    <!-- Промо -->
    <div class="sidebar-promo">
      БЕСПЛАТНАЯ ДОСТАВКА ОТ 3799000 UZS
    </div>

    <!-- Поиск -->
    <div class="sidebar-search">
      <input v-model="search" placeholder="Поиск (бренд, товар...)" @keyup.enter="doSearch" />
      <span class="search-icon">⌕</span>
    </div>

    <!-- Навигация -->
    <nav class="sidebar-nav">
      <RouterLink to="/">Главная</RouterLink>
      <RouterLink to="/catalog">Каталог</RouterLink>

      <div v-for="parent in tree" :key="parent.id" class="nav-group">
        <button class="nav-group-title" @click="toggleGroup(parent.id)">
          <span>{{ parent.name }}</span>
          <span class="nav-arrow" :class="{ open: openGroups.includes(parent.id) }">›</span>
        </button>
        <div v-if="openGroups.includes(parent.id)" class="nav-group-children">
          <button class="nav-child" :class="{ active: catalogStore.activeCategory === parent.name }"
            @click="selectCategory(parent.name)">
            Все в «{{ parent.name }}»
          </button>
          <button v-for="child in parent.children" :key="child.id" class="nav-child"
            :class="{ active: catalogStore.activeCategory === child.name }" @click="selectCategory(child.name)">
            {{ child.name }}
          </button>
        </div>
      </div>

      <div class="nav-divider"></div>
      <RouterLink to="/wishlist">
        Избранное
        <span v-if="wishlist.count > 0" class="nav-count">({{ wishlist.count }})</span>
      </RouterLink>
      <RouterLink to="/cart">
        Корзина
        <span v-if="cart.totalCount > 0" class="nav-count">({{ cart.totalCount }})</span>
      </RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/orders">Заказы</RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/profile">Личный кабинет</RouterLink>
      <RouterLink v-if="auth.isAdmin" to="/admin" class="nav-admin">⚙ Admin</RouterLink>
    </nav>

    <!-- Футер -->
    <div class="sidebar-footer">
      <template v-if="auth.isLoggedIn">
        <span class="sidebar-email">{{ auth.user?.name || auth.email }}</span>
        <RouterLink to="/profile" class="profile-link">Личный кабинет →</RouterLink>
        <button class="sidebar-logout" @click="handleLogout">Выйти</button>
      </template>
      <template v-else>
        <RouterLink to="/login">Войти</RouterLink>
        <RouterLink to="/register">Регистрация</RouterLink>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useCatalogStore } from '@/stores/catalog'
import { getCategoriesTree } from '@/services/categories'

const props = defineProps({
  mobileOpen: { type: Boolean, default: false }
})

defineEmits(['close'])

const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const catalogStore = useCatalogStore()
const router = useRouter()

const tree = ref([])
const openGroups = ref([])
const search = ref('')

onMounted(async () => {
  const res = await getCategoriesTree()
  tree.value = res.data
})

const toggleGroup = (id) => {
  const idx = openGroups.value.indexOf(id)
  if (idx >= 0) openGroups.value.splice(idx, 1)
  else openGroups.value.push(id)
}

const selectCategory = (name) => {
  catalogStore.fetchProducts(name)
  router.push('/catalog')
}

const doSearch = () => {
  if (search.value.trim()) {
    router.push({ path: '/catalog', query: { q: search.value } })
    search.value = ''
  }
}

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.sidebar {
  width: 210px;
  min-width: 210px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e8e8e8;
  background: #fff;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 100;
  transition: transform 0.3s ease;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.sidebar-logo {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #000;
}

.sidebar-close {
  display: none;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  padding: 0;
  line-height: 1;
}

.sidebar-promo {
  padding: 8px 20px;
  font-size: 10px;
  letter-spacing: 0.08em;
  background: #000;
  color: #fff;
  text-transform: uppercase;
}

.sidebar-search {
  position: relative;
  padding: 12px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.sidebar-search input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 12px;
  color: #000;
  background: transparent;
  padding-right: 20px;
}

.sidebar-search input::placeholder {
  color: #999;
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #999;
}

.sidebar-nav {
  flex: 1;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
}

.sidebar-nav a {
  display: block;
  padding: 8px 20px;
  font-size: 13px;
  color: #000;
  transition: color 0.15s;
}

.sidebar-nav a.router-link-exact-active {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.nav-admin {
  color: #0000ff !important;
}

.nav-count {
  color: #999;
  font-size: 12px;
}

.nav-group {
  display: flex;
  flex-direction: column;
}

.nav-group-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px;
  font-size: 13px;
  color: #000;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.nav-arrow {
  font-size: 16px;
  color: #999;
  transition: transform 0.2s;
  line-height: 1;
}

.nav-arrow.open {
  transform: rotate(90deg);
}

.nav-group-children {
  display: flex;
  flex-direction: column;
  padding-left: 12px;
}

.nav-child {
  padding: 6px 20px;
  font-size: 12px;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}

.nav-child:hover {
  color: #000;
}

.nav-child.active {
  color: #000;
  font-weight: 500;
}

.nav-divider {
  height: 1px;
  background: #e8e8e8;
  margin: 8px 20px;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-email {
  font-size: 11px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-footer a {
  font-size: 12px;
  color: #000;
}

.sidebar-footer a:hover {
  text-decoration: underline;
}

.sidebar-logout {
  background: none;
  border: none;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  text-align: left;
  padding: 0;
}

.sidebar-logout:hover {
  color: #000;
}


.profile-link { font-size: 12px; color: #000; text-decoration: underline; text-underline-offset: 2px; }
/* ========================
   МОБИЛЬНАЯ ВЕРСИЯ
======================== */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    max-height: 85vh;
    border-right: none;
    border-top: 1px solid #e8e8e8;
    border-radius: 16px 16px 0 0;
    transform: translateY(100%);
    z-index: 100;
    overflow-y: auto;
    visibility: hidden;
    pointer-events: none;
    transition: transform 0.3s ease, visibility 0.3s ease;
  }

  .sidebar--open {
    transform: translateY(0);
    visibility: visible;
    pointer-events: auto;
  }

  .sidebar-close {
    display: block;
  }
}
</style>