<template>
  <div class="cart-item">
    <div class="cart-item-img">
      <img
        v-if="item.product.images && item.product.images.length > 0"
        :src="`${apiUrl}/uploads/${item.product.images[0].filename}`"
        :alt="item.product.name"
      />
      <div v-else class="no-img">нет фото</div>
    </div>

    <div class="cart-item-info">
      <p class="cart-item-name">{{ item.product.name }}</p>
      <p class="cart-item-variant">{{ item.variant.size }} / {{ item.variant.color }}</p>
      <p class="cart-item-price">{{ formatPrice(item.product.price) }}</p>
    </div>

    <div class="cart-item-controls">
      <div class="qty">
        <button @click="decrement">−</button>
        <span>{{ item.quantity }}</span>
        <button @click="increment">+</button>
      </div>
      <button class="remove-btn" @click="cart.removeItem(item.variant.id)">удалить</button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const apiUrl = import.meta.env.VITE_API_URL
const cart = useCartStore()

const formatPrice = (price) =>
  Number(price).toLocaleString('ru-RU') + ' UZS'

const increment = () =>
  cart.updateQuantity(props.item.variant.id, props.item.quantity + 1)

const decrement = () => {
  if (props.item.quantity > 1) {
    cart.updateQuantity(props.item.variant.id, props.item.quantity - 1)
  } else {
    cart.removeItem(props.item.variant.id)
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #e8e8e4;
}

.cart-item-img {
  width: 80px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f4f4f2;
  flex-shrink: 0;
}

.cart-item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-img {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bbb;
  font-size: 12px;
}

.cart-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item-name {
  font-size: 15px;
  font-weight: 600;
}

.cart-item-variant {
  font-size: 13px;
  color: #888;
}

.cart-item-price {
  font-size: 15px;
  font-weight: 700;
  margin-top: auto;
}

.cart-item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.qty {
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 4px 12px;
}

.qty button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #1a1a1a;
  line-height: 1;
}

.qty span {
  font-size: 15px;
  font-weight: 500;
  min-width: 16px;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 13px;
  color: #c0392b;
  cursor: pointer;
  text-decoration: underline;
}
</style>