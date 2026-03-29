<template>
  <div class="orders-page">
    <div class="page-header">
      <h1 class="page-title">Your Orders</h1>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="orders.length === 0" class="empty">
      <p>У вас пока нет заказов</p>
      <RouterLink to="/catalog" class="empty-link">Начать покупки →</RouterLink>
    </div>

    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-row">
        <div class="order-meta">
          <div class="order-meta-left">
            <span class="order-date">{{ formatDate(order.created_at) }}</span>
            <span v-if="order.address" class="order-address">📍 {{ order.address }}</span>
          </div>
          <span :class="['order-status', `status--${order.status}`]">
            {{ statusLabel(order.status) }}
          </span>
        </div>

        <div class="order-items">
          <div v-for="(item, i) in order.items" :key="i" class="order-item">
            <div class="order-item-left">
              <p class="order-item-brand">{{ item.product_name }}</p>
              <p class="order-item-meta">{{ item.size }} / {{ item.color }}</p>
            </div>
            <div class="order-item-right">
              <span class="order-item-qty">Qty: {{ item.quantity }}</span>
              <span class="order-item-price">{{ formatPrice(item.price) }}</span>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <div v-if="order.discount_percent > 0" class="order-discount">
            Скидка {{ order.discount_percent }}% применена
          </div>
          <div class="order-total">
            Total: <strong>{{ formatTotal(order) }}</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyOrders } from '@/services/orders'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await getMyOrders()
    orders.value = res.data
  } finally {
    loading.value = false
  }
})

const formatPrice = (p) => Number(p).toLocaleString('ru-RU') + ' UZS'

const formatDate = (d) =>
  new Date(d).toLocaleDateString('ru-RU', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

const formatTotal = (order) => {
  const base = order.items.reduce((s, i) => s + Number(i.price) * i.quantity, 0)
  const final = order.discount_percent > 0
    ? base - (base * order.discount_percent / 100)
    : base
  return formatPrice(final)
}

const statusLabel = (s) => ({
  new: 'New',
  processing: 'Processing',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
}[s] || s)
</script>

<style scoped>
.orders-page { display: flex; flex-direction: column; gap: 0; }

.page-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
}

.page-title { font-size: 18px; font-weight: 300; letter-spacing: -0.01em; }

.empty {
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty p { font-size: 13px; color: #999; }

.empty-link {
  font-size: 12px;
  color: #000;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.orders-list { display: flex; flex-direction: column; }

.order-row {
  border-bottom: 1px solid #e8e8e8;
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.order-meta-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-date {
  font-size: 12px;
  color: #999;
  letter-spacing: 0.03em;
}

.order-address {
  font-size: 12px;
  color: #555;
}

.order-status {
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 4px 10px;
}

.status--new        { background: #f0f0f0; color: #555; }
.status--processing { background: #fef9e7; color: #b7950b; }
.status--delivered  { background: #eafaf1; color: #1e8449; }
.status--cancelled  { background: #fdedec; color: #c0392b; }

.order-items {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f4f4f4;
}

.order-item:last-child { border-bottom: none; }

.order-item-left { display: flex; flex-direction: column; gap: 2px; }

.order-item-brand {
  font-size: 13px;
  font-weight: 500;
}

.order-item-meta { font-size: 12px; color: #999; }

.order-item-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.order-item-qty { font-size: 12px; color: #999; }
.order-item-price { font-size: 13px; font-weight: 500; }

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 4px;
}

.order-discount { font-size: 11px; color: #27ae60; }

.order-total {
  font-size: 14px;
  color: #000;
  margin-left: auto;
}


@media (max-width: 480px) {
  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .order-item-right {
    flex-direction: row;
    gap: 12px;
  }

  .order-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}






</style>