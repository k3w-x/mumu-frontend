<template>
  <div class="app-layout">
    <AppSidebar :mobileOpen="mobileOpen" @close="mobileOpen = false" />

    <div class="app-body">
      <AppTopbar @burger="mobileOpen = true" />
      <main class="app-main">
        <RouterView />
      </main>
    </div>
  </div>

  <!-- Оверлей для мобилки -->
  <div
    v-if="mobileOpen"
    class="mobile-overlay"
    @click="mobileOpen = false"
  ></div>

  <ToastNotifications />
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import ToastNotifications from '@/components/ui/ToastNotifications.vue'

const mobileOpen = ref(false)
const route = useRoute()

// Закрываем меню при переходе на другую страницу
watch(() => route.path, () => { mobileOpen.value = false })
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 13px;
  background: #fff;
  color: #000;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;

}

a { color: inherit; text-decoration: none; }
button { font-family: inherit; }
</style>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  padding: 32px 40px;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
}

@media (max-width: 768px) {
  .app-main {
    padding: 20px 16px;
  }
}

@media (max-width: 480px) {
  .app-main {
    padding: 16px 12px;
  }
}
</style>