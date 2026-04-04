<template>
  <div>
    <div class="page-header">
      <h1 class="page-title">Все заказы</h1>
      <span class="orders-count" v-if="orders.length">{{ orders.length }} заказов</span>
    </div>

    <LoadingSpinner v-if="loading" />
    <div v-else-if="orders.length === 0" class="empty">Заказов пока нет</div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-meta">
            <span class="order-id">#{{ order.id }}</span>
            <span class="order-date">{{ formatDate(order.created_at) }}</span>
          </div>
          <div class="order-right">
            <select
              :value="order.status"
              :class="['status-select', `status--${order.status}`]"
              @change="changeStatus(order, $event.target.value)"
            >
              <option value="new">🆕 Новый</option>
              <option value="processing">⚙️ В обработке</option>
              <option value="delivered">✅ Доставлен</option>
              <option value="cancelled">❌ Отменён</option>
            </select>
            <span class="order-total-badge">{{ formatTotal(order) }}</span>
          </div>
        </div>

        <div class="order-body">
          <div class="customer-info">
            <h3 class="info-title">Покупатель</h3>
            <div class="info-row">
              <span class="info-label">Имя</span>
              <span class="info-value">{{ order.user_name || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ order.email || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Телефон</span>
              <span class="info-value">{{ order.phone || order.user_phone || '—' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Адрес</span>
              <span class="info-value">{{ order.address || '—' }}</span>
            </div>
            <div class="info-row" v-if="order.discount_percent > 0">
              <span class="info-label">Скидка</span>
              <span class="info-value discount">{{ order.discount_percent }}%</span>
            </div>

            <div class="sizes-block" v-if="order.user_clothing_size || order.user_shoe_size || order.user_gender">
              <h3 class="info-title" style="margin-top: 12px">Размеры покупателя</h3>
              <div class="info-row" v-if="order.user_gender">
                <span class="info-label">Пол</span>
                <span class="info-value">{{ order.user_gender === 'male' ? 'Мужской' : 'Женский' }}</span>
              </div>
              <div class="info-row" v-if="order.user_clothing_size">
                <span class="info-label">Размер одежды</span>
                <span class="info-value size-badge">{{ order.user_clothing_size }}</span>
              </div>
              <div class="info-row" v-if="order.user_shoe_size">
                <span class="info-label">Размер обуви</span>
                <span class="info-value size-badge">{{ order.user_shoe_size }}</span>
              </div>
            </div>
          </div>

          <div class="order-items">
            <h3 class="info-title">Товары</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Размер</th>
                  <th>Цвет</th>
                  <th>Кол-во</th>
                  <th>Цена</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, i) in order.items" :key="i">
                  <td class="td-name">{{ item.product_name }}</td>
                  <td>{{ item.size }}</td>
                  <td>{{ item.color }}</td>
                  <td>{{ item.quantity }} шт.</td>
                  <td class="td-price">{{ formatPrice(item.price) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllOrders, updateOrderStatus } from '@/services/orders'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const orders = ref([])
const loading = ref(true)
const toast = useToastStore()

onMounted(async () => {
  try {
    const res = await getAllOrders()
    orders.value = res.data
  } finally {
    loading.value = false
  }
})

const formatPrice = (p) => Number(p).toLocaleString('ru-RU') + ' UZS'

const formatDate = (d) =>
  new Date(d).toLocaleDateString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

const formatTotal = (order) => {
  const base = order.items.reduce((s, i) => s + Number(i.price) * i.quantity, 0)
  const final = order.discount_percent > 0
    ? base - (base * order.discount_percent / 100)
    : base
  return formatPrice(final)
}

const changeStatus = async (order, status) => {
  try {
    await updateOrderStatus(order.id, status)
    order.status = status
    toast.success(`Статус заказа #${order.id} обновлён`)
  } catch {
    toast.error('Ошибка обновления статуса')
  }
}
</script>

<style scoped>
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.page-title { font-size: 24px; font-weight: 700; }
.orders-count { background: #1a1a1a; color: #fff; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 20px; }
.empty { text-align: center; color: #888; padding: 80px 0; font-size: 16px; }
.orders-list { display: flex; flex-direction: column; gap: 16px; }
.order-card { background: #fff; border: 1px solid #e8e8e4; border-radius: 12px; overflow: hidden; }
.order-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #fafaf8; border-bottom: 1px solid #e8e8e4; }
.order-meta { display: flex; align-items: center; gap: 12px; }
.order-id { font-size: 16px; font-weight: 700; }
.order-date { font-size: 13px; color: #888; }
.order-right { display: flex; align-items: center; gap: 12px; }
.status-select { padding: 6px 28px 6px 12px; border-radius: 20px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; outline: none; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; }
.status--new        { background: #e8f4fd; color: #2980b9; }
.status--processing { background: #fef9e7; color: #d68910; }
.status--delivered  { background: #eafaf1; color: #1e8449; }
.status--cancelled  { background: #fdedec; color: #c0392b; }
.order-total-badge { font-size: 15px; font-weight: 700; }
.order-body { display: grid; grid-template-columns: 280px 1fr; }
.customer-info { padding: 20px; border-right: 1px solid #e8e8e4; display: flex; flex-direction: column; gap: 10px; }
.info-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #999; margin-bottom: 4px; }
.info-row { display: flex; flex-direction: column; gap: 2px; }
.info-label { font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 0.4px; }
.info-value { font-size: 14px; color: #1a1a1a; font-weight: 500; word-break: break-all; }
.info-value.discount { color: #27ae60; }
.sizes-block { border-top: 1px solid #e8e8e4; padding-top: 12px; display: flex; flex-direction: column; gap: 10px; }
.size-badge { display: inline-block; background: #f0f0ee; padding: 2px 10px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.order-items { padding: 20px; }
.items-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.items-table th { text-align: left; padding: 8px 12px; background: #f8f8f6; border-bottom: 1px solid #e8e8e4; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; font-weight: 600; }
.items-table td { padding: 10px 12px; border-bottom: 1px solid #f0f0ee; }
.items-table tbody tr:last-child td { border-bottom: none; }
.td-name { font-weight: 500; }
.td-price { font-weight: 600; }
</style>