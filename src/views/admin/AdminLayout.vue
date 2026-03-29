<template>
  <div class="admin">
    <aside class="sidebar">
      <div class="sidebar-logo">MUMU Admin</div>
      <nav class="sidebar-nav">
        <RouterLink to="/admin/products">🛍 Товары</RouterLink>
        <RouterLink to="/admin/categories">📂 Категории</RouterLink>
        <RouterLink to="/admin/brands">🏷 Бренды</RouterLink>
        <RouterLink to="/admin/orders">📦 Заказы</RouterLink>
        <RouterLink to="/admin/promocodes">🎟 Промокоды</RouterLink>
      </nav>
      <div class="sidebar-bottom">
        <RouterLink to="/" class="back-link">← На сайт</RouterLink>
        <button @click="logout" class="logout-btn">Выйти</button>
      </div>
    </aside>
    <div class="admin-content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const auth = useAuthStore()
const router = useRouter()
const logout = () => { auth.logout(); router.push('/login') }
</script>

<style scoped>
.admin { display: flex; min-height: 100vh; }
.sidebar {
  width: 220px; background: #1a1a1a; color: #fff;
  display: flex; flex-direction: column; padding: 24px 0;
  flex-shrink: 0; position: sticky; top: 0; height: 100vh;
}
.sidebar-logo { font-size: 18px; font-weight: 800; padding: 0 24px 24px; border-bottom: 1px solid #333; letter-spacing: -0.5px; }
.sidebar-nav { display: flex; flex-direction: column; padding: 16px 0; flex: 1; }
.sidebar-nav a {
  padding: 12px 24px; color: #aaa; text-decoration: none;
  font-size: 14px; transition: all 0.2s; border-left: 3px solid transparent;
}
.sidebar-nav a:hover { color: #fff; background: #222; }
.sidebar-nav a.router-link-active { color: #fff; background: #222; border-left-color: #fff; }
.sidebar-bottom { padding: 16px 24px; border-top: 1px solid #333; display: flex; flex-direction: column; gap: 10px; }
.back-link { color: #aaa; font-size: 13px; text-decoration: none; transition: color 0.2s; }
.back-link:hover { color: #fff; }
.logout-btn {
  background: transparent; border: 1px solid #444; color: #aaa;
  padding: 8px; border-radius: 6px; font-size: 13px; cursor: pointer; transition: all 0.2s;
}
.logout-btn:hover { border-color: #c0392b; color: #c0392b; }
.admin-content { flex: 1; padding: 32px; background: #f8f8f6; overflow-y: auto; }
</style>