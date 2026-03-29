<template>
  <div class="summary">
    <h3 class="summary-title">Итого</h3>

    <div class="summary-row">
      <span>Товары ({{ cart.totalCount }} шт.)</span>
      <span>{{ formatPrice(cart.totalPrice) }}</span>
    </div>

    <div class="summary-row">
      <span>Доставка</span>
      <span>бесплатно</span>
    </div>

    <div class="summary-total">
      <span>К оплате</span>
      <span>{{ formatPrice(cart.totalPrice) }}</span>
    </div>

    <BaseButton variant="primary" @click="$router.push('/checkout')" style="width: 100%">
      Оформить заказ
    </BaseButton>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const $router = useRouter()

const formatPrice = (price) =>
  Number(price).toLocaleString('ru-RU') + ' UZS'
</script>

<style scoped>
.summary {
  background: #fff;
  border: 1px solid #e8e8e4;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: sticky;
  top: 88px;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #555;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 17px;
  font-weight: 700;
  padding-top: 14px;
  border-top: 1px solid #e8e8e4;
}
</style>