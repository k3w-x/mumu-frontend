<template>
  <div class="profile-page">
    <div class="profile-header">
      <h1 class="profile-title">Личный кабинет</h1>
      <p class="profile-email">{{ auth.user?.email }}</p>
    </div>

    <div class="profile-layout">
      <!-- Вкладки -->
      <div class="profile-tabs">
        <button :class="['tab', activeTab === 'info' ? 'active' : '']" @click="activeTab = 'info'">
          Личные данные
        </button>
        <button :class="['tab', activeTab === 'sizes' ? 'active' : '']" @click="activeTab = 'sizes'">
          Мои размеры
        </button>
        <button :class="['tab', activeTab === 'orders' ? 'active' : '']" @click="activeTab = 'orders'">
          Мои заказы
        </button>
      </div>

      <!-- Личные данные -->
      <div v-if="activeTab === 'info'" class="profile-content">
        <h2 class="section-title">Личные данные</h2>
        <div class="fields">
          <div class="field">
            <label class="field-label">Имя</label>
            <input v-model="form.name" type="text" class="field-input" placeholder="Ваше имя" />
          </div>
          <div class="field">
            <label class="field-label">Телефон</label>
            <input v-model="form.phone" type="tel" class="field-input" placeholder="+998 90 123 45 67" />
          </div>
          <div class="field">
            <label class="field-label">Email</label>
            <input :value="auth.user?.email" type="email" class="field-input" disabled />
            <span class="field-hint">Email изменить нельзя</span>
          </div>
        </div>
        <p v-if="saveSuccess" class="success-msg">✓ Данные сохранены</p>
        <p v-if="saveError" class="error-msg">{{ saveError }}</p>
        <button class="save-btn" :disabled="saving" @click="save">
          {{ saving ? 'СОХРАНЯЕМ...' : 'СОХРАНИТЬ' }}
        </button>
      </div>

      <!-- Размеры -->
      <div v-if="activeTab === 'sizes'" class="profile-content">
        <h2 class="section-title">Мои размеры</h2>
        <p class="section-sub">Эта информация используется при оформлении заказов</p>
        <div class="fields">
          <div class="field">
            <label class="field-label">Пол</label>
            <select v-model="form.gender" class="field-input">
              <option value="">— не указан —</option>
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Размер одежды</label>
            <select v-model="form.clothing_size" class="field-input">
              <option value="">— не указан —</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
          <div class="field">
            <label class="field-label">Размер обуви</label>
            <select v-model="form.shoe_size" class="field-input">
              <option value="">— не указан —</option>
              <option v-for="size in shoeSizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
        </div>
        <p v-if="saveSuccess" class="success-msg">✓ Размеры сохранены</p>
        <p v-if="saveError" class="error-msg">{{ saveError }}</p>
        <button class="save-btn" :disabled="saving" @click="save">
          {{ saving ? 'СОХРАНЯЕМ...' : 'СОХРАНИТЬ' }}
        </button>
      </div>

      <!-- Заказы -->
      <div v-if="activeTab === 'orders'" class="profile-content">
        <h2 class="section-title">Мои заказы</h2>
        <LoadingSpinner v-if="ordersLoading" />
        <div v-else-if="orders.length === 0" class="empty">
          <p>Заказов пока нет</p>
          <RouterLink to="/catalog" class="empty-link">Перейти в каталог →</RouterLink>
        </div>
        <div v-else class="orders-list">
          <div v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-header">
              <span class="order-id">Заказ #{{ order.id }}</span>
              <span :class="['order-status', `status-${order.status}`]">{{ statusLabel(order.status) }}</span>
              <span class="order-date">{{ formatDate(order.created_at) }}</span>
            </div>
            <div class="order-info">
              <span>Адрес: {{ order.address }}</span>
              <span>Телефон: {{ order.phone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="logout-btn" @click="logout">Выйти из аккаунта</button>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const auth = useAuthStore()
const router = useRouter()

const activeTab = ref('info')
const saving = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')
const orders = ref([])
const ordersLoading = ref(false)

const shoeSizes = Array.from({ length: 15 }, (_, i) => String(35 + i))

const form = reactive({
  name: auth.user?.name || '',
  phone: auth.user?.phone || '',
  gender: auth.user?.gender || '',
  clothing_size: auth.user?.clothing_size || '',
  shoe_size: auth.user?.shoe_size || ''
})

const save = async () => {
  saving.value = true
  saveSuccess.value = false
  saveError.value = ''
  try {
    await auth.updateProfile({
      name: form.name,
      phone: form.phone,
      gender: form.gender,
      clothing_size: form.clothing_size,
      shoe_size: form.shoe_size
    })
    saveSuccess.value = true
    setTimeout(() => saveSuccess.value = false, 3000)
  } catch (err) {
    saveError.value = err.response?.data?.error || 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}

const loadOrders = async () => {
  ordersLoading.value = true
  try {
    const res = await api.get('/orders')
    orders.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    ordersLoading.value = false
  }
}

onMounted(async () => {
  await auth.fetchProfile()
  form.name = auth.user?.name || ''
  form.phone = auth.user?.phone || ''
  form.gender = auth.user?.gender || ''
  form.clothing_size = auth.user?.clothing_size || ''
  form.shoe_size = auth.user?.shoe_size || ''
  loadOrders()
})

const statusLabel = (status) => {
  const map = { new: 'Новый', processing: 'В обработке', shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён' }
  return map[status] || status
}

const formatDate = (d) => new Date(d).toLocaleDateString('ru-RU')

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.profile-page { display: flex; flex-direction: column; gap: 32px; max-width: 700px; }
.profile-header { display: flex; flex-direction: column; gap: 4px; padding-bottom: 20px; border-bottom: 1px solid #e8e8e8; }
.profile-title { font-size: 22px; font-weight: 300; }
.profile-email { font-size: 13px; color: #999; }
.profile-layout { display: flex; flex-direction: column; gap: 0; }
.profile-tabs { display: flex; border-bottom: 1px solid #e8e8e8; margin-bottom: 32px; }
.tab { padding: 12px 20px; background: none; border: none; border-bottom: 2px solid transparent; font-size: 13px; cursor: pointer; color: #999; transition: all 0.2s; margin-bottom: -1px; }
.tab:hover { color: #000; }
.tab.active { color: #000; border-bottom-color: #000; font-weight: 500; }
.profile-content { display: flex; flex-direction: column; gap: 24px; }
.section-title { font-size: 16px; font-weight: 500; }
.section-sub { font-size: 12px; color: #999; margin-top: -16px; }
.fields { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.06em; }
.field-input { padding: 10px 12px; border: 1px solid #e8e8e8; font-size: 13px; outline: none; transition: border-color 0.15s; font-family: inherit; width: 100%; background: #fff; }
.field-input:focus { border-color: #000; }
.field-input:disabled { background: #f8f8f8; color: #aaa; cursor: not-allowed; }
.field-hint { font-size: 11px; color: #bbb; }
.save-btn { padding: 12px 32px; background: #000; color: #fff; border: none; font-size: 11px; letter-spacing: 0.1em; cursor: pointer; transition: opacity 0.2s; align-self: flex-start; }
.save-btn:hover:not(:disabled) { opacity: 0.75; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.success-msg { font-size: 12px; color: #27ae60; }
.error-msg { font-size: 12px; color: #c0392b; }
.empty { display: flex; flex-direction: column; gap: 12px; padding: 40px 0; }
.empty p { font-size: 13px; color: #999; }
.empty-link { font-size: 12px; color: #000; text-decoration: underline; }
.orders-list { display: flex; flex-direction: column; gap: 12px; }
.order-card { border: 1px solid #e8e8e8; border-radius: 8px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.order-header { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.order-id { font-size: 14px; font-weight: 500; }
.order-status { font-size: 11px; padding: 3px 8px; border-radius: 20px; background: #f0f0ee; }
.status-new { background: #e8f0fe; color: #1a73e8; }
.status-processing { background: #fef9ec; color: #d68910; }
.status-shipped { background: #e8f5e9; color: #27ae60; }
.status-delivered { background: #e8f5e9; color: #1b5e20; }
.status-cancelled { background: #fdecea; color: #c0392b; }
.order-date { font-size: 12px; color: #999; margin-left: auto; }
.order-info { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #777; }
.logout-btn { align-self: flex-start; padding: 10px 24px; background: none; border: 1px solid #e8e8e8; font-size: 12px; cursor: pointer; transition: all 0.2s; color: #999; }
.logout-btn:hover { border-color: #c0392b; color: #c0392b; }
</style>