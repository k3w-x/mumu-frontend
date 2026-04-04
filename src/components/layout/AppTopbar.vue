<template>
  <div class="topbar">
    <div class="topbar-left">
      <!-- Бургер — только на мобилке -->
      <button class="burger-btn" @click="$emit('burger')">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <span class="breadcrumb" v-if="breadcrumb">{{ breadcrumb }}</span>
    </div>

    <div class="topbar-center">
      <!-- Лого на мобилке -->
      <RouterLink to="/" class="mobile-logo">MUMU</RouterLink>
    </div>

    <div class="topbar-right">
      <RouterLink to="/wishlist">Избранное ({{ wishlist.count }})</RouterLink>
      <RouterLink to="/cart">Корзина ({{ cart.totalCount }})</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

defineEmits(['burger'])

const route = useRoute()
const cart = useCartStore()
const wishlist = useWishlistStore()

const breadcrumb = computed(() => {
  const map = {
    '/': null,
    '/catalog': 'Каталог',
    '/cart': 'Корзина',
    '/wishlist': 'Избранное',
    '/checkout': 'Оформление',
    '/orders': 'Мои заказы',
    '/login': 'Войти',
    '/register': 'Регистрация',
  }
  return map[route.path] || null
})
</script>

<style scoped>
.topbar {
  height: 48px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  font-size: 12px;
  color: #666;
  flex-shrink: 0;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.topbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.topbar-right {
  display: flex;
  gap: 24px;
  flex: 1;
  justify-content: flex-end;
}

.topbar-right a {
  color: #000;
  font-size: 12px;
  transition: opacity 0.15s;
}

.topbar-right a:hover {
  opacity: 0.6;
}

.breadcrumb {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* Бургер */
.burger-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.burger-btn span {
  display: block;
  width: 22px;
  height: 1px;
  background: #000;
  transition: all 0.2s;
}

/* Лого на мобилке */
.mobile-logo {
  display: none;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #000;
}

/* Tablet */
@media (max-width: 768px) {
  .topbar {
    padding: 0 16px;
  }

  .burger-btn {
    display: flex;
  }

  .mobile-logo {
    display: block;
  }

  .breadcrumb {
    display: none;
  }

  .topbar-right a:first-child {
    display: none;
  }
}

/* Mobile */
@media (max-width: 480px) {
  .topbar-right {
    gap: 12px;
  }

  .topbar-right a {
    font-size: 11px;
  }
}
</style>