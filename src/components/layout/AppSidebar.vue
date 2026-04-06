<template>
  <aside :class="['sidebar', mobileOpen ? 'sidebar--open' : '']">
    <div class="sidebar-header">
      <RouterLink to="/" class="sidebar-logo">MUMU</RouterLink>
      <button class="sidebar-close" @click="$emit('close')">✕</button>
    </div>

    <div class="sidebar-promo">БЕСПЛАТНАЯ ДОСТАВКА ОТ 3 799 000 UZS</div>

    <div class="sidebar-search">
      <input v-model="search" placeholder="Поиск..." @keyup.enter="doSearch" />
      <span class="search-icon">⌕</span>
    </div>

    <nav class="sidebar-nav">
      <!-- Главные категории по полу -->
      <div v-for="parent in genderCategories" :key="parent.id" class="nav-section">
        <button
          :class="['nav-section-title', openGroups.includes(parent.id) ? 'open' : '']"
          @click="toggleGroup(parent.id)"
        >
          <span>{{ parent.name }}</span>
          <span class="nav-arrow" :class="{ open: openGroups.includes(parent.id) }">›</span>
        </button>

        <div v-if="openGroups.includes(parent.id)" class="nav-section-body">
          <!-- Подкатегории второго уровня -->
          <div v-for="sub in parent.children" :key="sub.id" class="nav-sub-group">
            <button
              :class="['nav-sub-title', openSubGroups.includes(sub.id) ? 'open' : '']"
              @click="toggleSubGroup(sub.id)"
            >
              {{ sub.name }}
              <span class="nav-arrow-sm" :class="{ open: openSubGroups.includes(sub.id) }">›</span>
            </button>

            <div v-if="openSubGroups.includes(sub.id)" class="nav-sub-children">
              <button
                class="nav-leaf"
                @click="selectCategory(sub.name)"
              >
                Все {{ sub.name.toLowerCase() }}
              </button>
              <button
                v-for="leaf in sub.children"
                :key="leaf.id"
                :class="['nav-leaf', catalogStore.activeCategory === leaf.name ? 'active' : '']"
                @click="selectCategory(leaf.name)"
              >
                {{ leaf.name }}
              </button>
            </div>
          </div>

          <!-- Если нет подкатегорий -->
          <button
            v-if="!parent.children?.length"
            class="nav-leaf"
            @click="selectCategory(parent.name)"
          >
            Смотреть всё
          </button>
        </div>
      </div>

      <div class="nav-divider"></div>

      <!-- Бренды -->
      <RouterLink to="/brands" class="nav-link">Бренды</RouterLink>
      <RouterLink to="/catalog" class="nav-link">Все товары</RouterLink>

      <div class="nav-divider"></div>

      <!-- Личное -->
      <RouterLink to="/how-to-order" class="nav-link">Как заказать?</RouterLink>
      <RouterLink to="/legit-check" class="nav-link">Легит чек</RouterLink>
      <RouterLink to="/wishlist" class="nav-link">
        Избранное
        <span v-if="wishlist.count > 0" class="nav-count">{{ wishlist.count }}</span>
      </RouterLink>
      <RouterLink to="/cart" class="nav-link">
        Корзина
        <span v-if="cart.totalCount > 0" class="nav-count">{{ cart.totalCount }}</span>
      </RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/orders" class="nav-link">Заказы</RouterLink>
      <RouterLink v-if="auth.isLoggedIn" to="/profile" class="nav-link">Личный кабинет</RouterLink>
      <RouterLink v-if="auth.isAdmin" to="/admin" class="nav-link nav-admin">⚙ Админ</RouterLink>
    </nav>

    <div class="sidebar-footer">
      <template v-if="auth.isLoggedIn">
        <span class="sidebar-user">{{ auth.user?.name || auth.email }}</span>
        <button class="sidebar-logout" @click="handleLogout">Выйти</button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="footer-link">Войти</RouterLink>
        <RouterLink to="/register" class="footer-link footer-link--secondary">Регистрация</RouterLink>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useCatalogStore } from '@/stores/catalog'
import { getCategoriesTree } from '@/services/categories'

defineProps({ mobileOpen: { type: Boolean, default: false } })
defineEmits(['close'])

const auth = useAuthStore()
const cart = useCartStore()
const wishlist = useWishlistStore()
const catalogStore = useCatalogStore()
const router = useRouter()

const tree = ref([])
const openGroups = ref([])
const openSubGroups = ref([])
const search = ref('')

const genderCategories = computed(() =>
  tree.value.filter(c => c.gender === 'male' || c.gender === 'female')
)

onMounted(async () => {
  const res = await getCategoriesTree()
  tree.value = res.data
})

const toggleGroup = (id) => {
  const idx = openGroups.value.indexOf(id)
  if (idx >= 0) openGroups.value.splice(idx, 1)
  else openGroups.value.push(id)
}

const toggleSubGroup = (id) => {
  const idx = openSubGroups.value.indexOf(id)
  if (idx >= 0) openSubGroups.value.splice(idx, 1)
  else openSubGroups.value.push(id)
}

const selectCategory = (name) => {
  catalogStore.fetchProducts(name)
  router.push({ path: '/catalog', query: { category: name } })
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
  width: 220px;
  min-width: 220px;
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
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.sidebar-logo {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.08em;
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
}

.sidebar-promo {
  padding: 7px 20px;
  font-size: 9px;
  letter-spacing: 0.08em;
  background: #000;
  color: #fff;
  text-transform: uppercase;
  text-align: center;
}

.sidebar-search {
  position: relative;
  padding: 10px 20px;
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

.sidebar-search input::placeholder { color: #bbb; }

.search-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 15px;
  color: #bbb;
}

/* Навигация */
.sidebar-nav {
  flex: 1;
  padding: 4px 0;
  display: flex;
  flex-direction: column;
}

/* Главные секции (Для него / Для неё) */
.nav-section { display: flex; flex-direction: column; }

.nav-section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 20px;
  font-size: 13px;
  font-weight: 500;
  color: #000;
  background: none;
  border: none;
  border-bottom: 1px solid #f0f0ee;
  cursor: pointer;
  text-align: left;
  width: 100%;
  letter-spacing: 0.02em;
  transition: background 0.15s;
}

.nav-section-title:hover { background: #fafaf8; }
.nav-section-title.open { background: #f5f5f3; }

.nav-arrow {
  font-size: 16px;
  color: #999;
  transition: transform 0.2s;
}

.nav-arrow.open { transform: rotate(90deg); }

.nav-section-body {
  background: #fafaf8;
  border-bottom: 1px solid #e8e8e8;
  padding: 4px 0;
}

/* Подкатегории второго уровня (Одежда, Обувь...) */
.nav-sub-group { display: flex; flex-direction: column; }

.nav-sub-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px 8px 28px;
  font-size: 12px;
  font-weight: 500;
  color: #444;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  transition: color 0.15s;
}

.nav-sub-title:hover { color: #000; }
.nav-sub-title.open { color: #000; }

.nav-arrow-sm {
  font-size: 13px;
  color: #bbb;
  transition: transform 0.2s;
}

.nav-arrow-sm.open { transform: rotate(90deg); }

.nav-sub-children {
  display: flex;
  flex-direction: column;
  padding: 2px 0 6px;
}

/* Листья (Футболки, Шорты...) */
.nav-leaf {
  padding: 6px 20px 6px 40px;
  font-size: 12px;
  color: #777;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: color 0.15s;
}

.nav-leaf:hover { color: #000; }
.nav-leaf.active { color: #000; font-weight: 600; }

/* Обычные ссылки */
.nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 20px;
  font-size: 13px;
  color: #000;
  transition: color 0.15s;
}

.nav-link:hover { opacity: 0.7; }
.nav-link.router-link-exact-active { text-decoration: underline; text-underline-offset: 3px; }
.nav-admin { color: #1a73e8 !important; font-weight: 500; }

.nav-count {
  background: #000;
  color: #fff;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.nav-divider {
  height: 1px;
  background: #e8e8e8;
  margin: 4px 0;
}

/* Футер */
.sidebar-footer {
  padding: 14px 20px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-user {
  font-size: 11px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.footer-link {
  font-size: 12px;
  font-weight: 500;
  color: #000;
  padding: 6px 0;
}

.footer-link--secondary { color: #999; font-weight: 400; }
.footer-link:hover { text-decoration: underline; }

.sidebar-logout {
  background: none;
  border: none;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  text-align: left;
  padding: 0;
}

.sidebar-logout:hover { color: #c0392b; }

/* Мобилка */
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

  .sidebar-close { display: block; }
}
</style>