<template>
  <div class="cart-page">
    <div class="page-header">
      <h1 class="page-title">Your Shopping Cart
        <span class="page-count" v-if="cart.items.length">({{ cart.totalCount }} items)</span>
      </h1>
    </div>

    <div v-if="cart.items.length === 0" class="empty">
      <p>Your cart is empty</p>
      <RouterLink to="/catalog" class="empty-link">Continue Shopping →</RouterLink>
    </div>

    <div v-else class="cart-layout">
      <!-- Список товаров -->
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.variant.id" class="cart-item">
          <div class="item-img">
            <img
              v-if="item.product.images?.length"
              :src="`${apiUrl}/uploads/${item.product.images[0].filename}`"
              :alt="item.product.name"
            />
            <div v-else class="item-img-empty"></div>
          </div>

          <div class="item-info">
            <p class="item-brand">{{ item.product.brand || item.product.category }}</p>
            <p class="item-name">{{ item.product.name }}</p>
            <p class="item-variant">{{ item.variant.size }} / {{ item.variant.color }}</p>
            <p class="item-unit-price">{{ formatPrice(item.product.price) }}</p>
          </div>

          <div class="item-right">
            <div class="item-qty">
              <button @click="decrement(item)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="cart.updateQuantity(item.variant.id, item.quantity + 1)">+</button>
            </div>
            <p class="item-total">{{ formatPrice(item.product.price * item.quantity) }}</p>
            <button class="item-remove" @click="cart.removeItem(item.variant.id)">
              Remove Product
            </button>
          </div>
        </div>
      </div>

      <!-- Итог -->
      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>{{ formatPrice(cart.totalPrice) }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>{{ cart.totalPrice >= 5000 ? 'Free' : formatPrice(300) }}</span>
        </div>
        <div class="summary-total">
          <span>Total</span>
          <span>{{ formatPrice(cart.totalPrice >= 5000 ? cart.totalPrice : cart.totalPrice + 300) }}</span>
        </div>
        <RouterLink to="/checkout" class="checkout-btn">
          CHECKOUT ( {{ formatPrice(cart.totalPrice >= 5000 ? cart.totalPrice : cart.totalPrice + 300) }} )
        </RouterLink>
        <RouterLink to="/catalog" class="continue-link">← Continue Shopping</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const apiUrl = import.meta.env.VITE_API_URL

const formatPrice = (price) => Number(price).toLocaleString('ru-RU') + ' UZS'

const decrement = (item) => {
  if (item.quantity > 1) {
    cart.updateQuantity(item.variant.id, item.quantity - 1)
  } else {
    cart.removeItem(item.variant.id)
  }
}
</script>

<style scoped>
.cart-page { display: flex; flex-direction: column; gap: 0; }

.page-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 0;
}

.page-title {
  font-size: 18px;
  font-weight: 300;
  letter-spacing: -0.01em;
}

.page-count { font-size: 14px; color: #999; margin-left: 8px; }

.empty {
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.empty p { font-size: 13px; color: #999; }

.empty-link {
  font-size: 12px;
  color: #000;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 0;
  align-items: start;
}

/* Товары */
.cart-items {
  border-right: 1px solid #e8e8e8;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 20px;
  padding: 24px 40px 24px 0;
  border-bottom: 1px solid #e8e8e8;
}

.item-img {
  width: 120px;
  height: 150px;
  background: #f2f2f0;
  overflow: hidden;
  flex-shrink: 0;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-img-empty {
  width: 100%;
  height: 100%;
  background: #f2f2f0;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 4px;
}

.item-brand {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}

.item-name {
  font-size: 13px;
  color: #333;
  line-height: 1.4;
}

.item-variant {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
}

.item-unit-price {
  font-size: 13px;
  color: #000;
  margin-top: auto;
}

.item-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 4px;
  min-width: 100px;
}

.item-qty {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e8e8e8;
  padding: 6px 12px;
}

.item-qty button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #000;
  line-height: 1;
  padding: 0;
}

.item-qty span {
  font-size: 13px;
  min-width: 16px;
  text-align: center;
}

.item-total {
  font-size: 14px;
  font-weight: 500;
}

.item-remove {
  background: none;
  border: none;
  font-size: 11px;
  color: #999;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  padding: 0;
}

.item-remove:hover { color: #000; }

/* Итог */
.cart-summary {
  padding: 24px 0 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 40px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #555;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
}

.checkout-btn {
  display: block;
  text-align: center;
  background: #000;
  color: #fff;
  padding: 14px;
  font-size: 11px;
  letter-spacing: 0.08em;
  margin-top: 8px;
  transition: opacity 0.2s;
}

.checkout-btn:hover { opacity: 0.75; }

.continue-link {
  font-size: 11px;
  color: #999;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.continue-link:hover { color: #000; }





@media (max-width: 768px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-items {
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }

  .cart-item {
    grid-template-columns: 80px 1fr auto;
    gap: 12px;
    padding: 16px 0;
  }

  .item-img {
    width: 80px;
    height: 100px;
  }

  .cart-summary {
    position: static;
    padding: 24px 0 0;
    border-top: none;
  }
}

@media (max-width: 480px) {
  .cart-item {
    grid-template-columns: 70px 1fr;
    grid-template-rows: auto auto;
  }

  .item-right {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}


</style>