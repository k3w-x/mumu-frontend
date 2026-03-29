<template>
  <div class="checkout-page">
    <div class="page-header">
      <h1 class="page-title">Checkout</h1>
    </div>

    <div v-if="cart.items.length === 0" class="empty">
      <p>Your cart is empty</p>
      <RouterLink to="/catalog" class="empty-link">Continue Shopping →</RouterLink>
    </div>

    <div v-else class="checkout-layout">
      <!-- Форма -->
      <div class="checkout-form">
        <div class="form-section">
          <h2 class="form-section-title">ДОСТАВКА</h2>
          <div class="form-fields">
            <div class="field">
              <label class="field-label">Адрес доставки</label>
              <input v-model="form.address" class="field-input" placeholder="Город, улица, дом, квартира" />
            </div>
            <div class="field">
              <label class="field-label">Телефон</label>
              <input v-model="form.phone" class="field-input" placeholder="+7 999 000 00 00" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="form-section-title">ПРОМОКОД</h2>
          <div class="promo-row">
            <input
              v-model="promoCode"
              class="field-input promo-input"
              placeholder="Введите промокод"
              :disabled="discount > 0"
              style="text-transform: uppercase"
              @keyup.enter="applyPromo"
            />
            <button
              v-if="discount === 0"
              class="promo-btn"
              :disabled="promoLoading || !promoCode"
              @click="applyPromo"
            >
              {{ promoLoading ? '...' : 'Применить' }}
            </button>
            <button v-else class="promo-btn promo-btn--reset" @click="resetPromo">
              Убрать
            </button>
          </div>
          <p v-if="promoError" class="field-error">{{ promoError }}</p>
          <p v-if="discount > 0" class="promo-ok">Скидка {{ discount }}% применена</p>
        </div>

        <p v-if="error" class="submit-error">{{ error }}</p>
      </div>

      <!-- Сводка заказа -->
      <div class="checkout-summary">
        <h2 class="form-section-title">ВАШИ ТОВАРЫ</h2>

        <div class="summary-items">
          <div v-for="item in cart.items" :key="item.variant.id" class="summary-item">
            <div class="summary-item-img">
              <img
                v-if="item.product.images?.length"
                :src="`${apiUrl}/uploads/${item.product.images[0].filename}`"
                :alt="item.product.name"
              />
              <div v-else class="summary-item-img-empty"></div>
            </div>
            <div class="summary-item-info">
              <p class="summary-item-brand">{{ item.product.brand || item.product.category }}</p>
              <p class="summary-item-name">{{ item.product.name }}</p>
              <p class="summary-item-meta">
                {{ item.variant.size }} · {{ item.variant.color }} · {{ item.quantity }} шт.
              </p>
            </div>
            <p class="summary-item-price">{{ formatPrice(item.product.price * item.quantity) }}</p>
          </div>
        </div>

        <div class="summary-totals">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>{{ formatPrice(cart.totalPrice) }}</span>
          </div>
          <div v-if="discount > 0" class="summary-row summary-row--discount">
            <span>Скидка {{ discount }}%</span>
            <span>− {{ formatPrice(cart.totalPrice * discount / 100) }}</span>
          </div>
          <div class="summary-row">
            <span>Доставка</span>
            <span>Бесплатно</span>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>{{ formatPrice(finalPrice) }}</span>
          </div>
        </div>

        <button class="submit-btn" :disabled="loading" @click="submit">
          {{ loading ? 'ОФОРМЛЯЕМ...' : `ПОДТВЕРДИТЬ ЗАКАЗ ( ${formatPrice(finalPrice)} )` }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { createOrder } from '@/services/orders'
import { checkPromocode } from '@/services/promocodes'

const cart = useCartStore()
const toast = useToastStore()
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_URL

const form = ref({ address: '', phone: '' })
const loading = ref(false)
const error = ref('')
const promoCode = ref('')
const promoLoading = ref(false)
const promoError = ref('')
const discount = ref(0)

const finalPrice = computed(() => {
  const base = cart.totalPrice
  return discount.value > 0 ? base - (base * discount.value / 100) : base
})

const formatPrice = (price) => Number(price).toLocaleString('ru-RU') + ' UZS'

const applyPromo = async () => {
  if (!promoCode.value) return
  promoLoading.value = true
  promoError.value = ''
  try {
    const res = await checkPromocode(promoCode.value)
    discount.value = res.data.discount_percent
    toast.success(`Промокод применён — скидка ${discount.value}%!`)
  } catch (err) {
    promoError.value = err.response?.data?.error || 'Промокод не найден'
  } finally {
    promoLoading.value = false
  }
}

const resetPromo = () => {
  promoCode.value = ''
  discount.value = 0
  promoError.value = ''
}

const submit = async () => {
  if (!form.value.address.trim() || !form.value.phone.trim()) {
    error.value = 'Заполните адрес и телефон'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const items = cart.items.map(i => ({
      product_id: i.product.id,
      variant_id: i.variant.id,
      quantity: i.quantity
    }))
    await createOrder(items, form.value.address, form.value.phone, discount.value)
    cart.clearCart()
    toast.success('Заказ оформлен!')
    router.push('/orders')
  } catch (err) {
    error.value = err.response?.data?.error || 'Ошибка при оформлении'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-page { display: flex; flex-direction: column; gap: 0; }

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

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 0;
  align-items: start;
}

.checkout-form {
  padding: 32px 40px 32px 0;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section { display: flex; flex-direction: column; gap: 16px; }

.form-section-title {
  font-size: 10px;
  letter-spacing: 0.12em;
  color: #999;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 10px;
}

.form-fields { display: flex; flex-direction: column; gap: 12px; }

.field { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-size: 11px;
  color: #999;
  letter-spacing: 0.04em;
}

.field-input {
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
  font-family: inherit;
}

.field-input:focus { border-color: #000; }
.field-input:disabled { background: #f8f8f8; color: #999; }

.promo-row { display: flex; gap: 8px; }
.promo-input { flex: 1; }

.promo-btn {
  padding: 10px 16px;
  background: #000;
  color: #fff;
  border: none;
  font-size: 12px;
  cursor: pointer;
  letter-spacing: 0.04em;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.promo-btn:hover:not(:disabled) { opacity: 0.75; }
.promo-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.promo-btn--reset {
  background: transparent;
  color: #999;
  border: 1px solid #ddd;
}

.promo-btn--reset:hover { color: #000; border-color: #000; opacity: 1; }

.field-error { font-size: 11px; color: #c0392b; }
.promo-ok { font-size: 11px; color: #27ae60; }
.submit-error { font-size: 12px; color: #c0392b; }

/* Сводка */
.checkout-summary {
  padding: 32px 0 32px 32px;
  position: sticky;
  top: 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-items {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.summary-item {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e8e8e8;
  align-items: center;
}

.summary-item-img {
  width: 64px;
  height: 80px;
  background: #f2f2f0;
  overflow: hidden;
}

.summary-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.summary-item-img-empty {
  width: 100%;
  height: 100%;
}

.summary-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary-item-brand {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

.summary-item-name { font-size: 12px; color: #333; line-height: 1.3; }
.summary-item-meta { font-size: 11px; color: #999; }
.summary-item-price { font-size: 13px; font-weight: 500; }

.summary-totals {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #555;
}

.summary-row--discount { color: #27ae60; }

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: #000;
  color: #fff;
  border: none;
  font-size: 11px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:hover:not(:disabled) { opacity: 0.75; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }





@media (max-width: 768px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-form {
    border-right: none;
    padding-right: 0;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 32px;
  }

  .checkout-summary {
    position: static;
    padding-left: 0;
    padding-top: 24px;
  }
}

</style>