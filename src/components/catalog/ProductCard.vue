<template>
  <div class="card" @click="$router.push(`/product/${product.id}`)">
    <div class="card-img">
      <img v-if="product.images && product.images.length > 0" :src="getImageUrl(product.images[0].filename)"
        :alt="product.name" />
      <div v-else class="card-no-img"></div>

      <!-- Бейджи -->
      <div class="card-badges">
        <span v-if="!hasStock" class="badge badge--sold">Нет в наличии</span>
      </div>

      <!-- Избранное -->
      <button :class="['wish-btn', wishlist.isInWishlist(product.id) ? 'wished' : '']" @click.stop="toggleWish">
        {{ wishlist.isInWishlist(product.id) ? '♥' : '♡' }}
      </button>
    </div>

    <div class="card-body">
      <p class="card-brand">{{ product.brand || product.category }}</p>
      <p class="card-name">{{ product.name }}</p>
      <p class="card-price">{{ formatPrice(product.price) }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useToastStore } from '@/stores/toast'

const props = defineProps({
  product: { type: Object, required: true }
})

const apiUrl = import.meta.env.VITE_API_URL
const getImageUrl = (filename) => {
  if (!filename) return ''
  if (filename.startsWith('http')) return filename
  return `${apiUrl}/uploads/${filename}`
}
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToastStore()

const hasStock = computed(() =>
  props.product.variants && props.product.variants.some(v => v.stock > 0)
)

const formatPrice = (price) =>
  Number(price).toLocaleString('ru-RU') + ' UZS'

const toggleWish = () => {
  wishlist.toggle(props.product)
  toast.info(wishlist.isInWishlist(props.product.id) ? 'Добавлено в избранное' : 'Убрано из избранного')
}
</script>

<style scoped>
.card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.card-img {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: #f2f2f0;
  overflow: hidden;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover .card-img img {
  transform: scale(1.03);
}

.card-no-img {
  width: 100%;
  height: 100%;
  background: #f2f2f0;
}

.card-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.badge {
  font-size: 10px;
  padding: 3px 7px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge--sold {
  background: #fff;
  color: #000;
}

.wish-btn {
  position: absolute;
  top: 8px;
  right: 10px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #000;
  line-height: 1;
  opacity: 0;
  transition: opacity 0.2s;
}

.card:hover .wish-btn {
  opacity: 1;
}

.wish-btn.wished {
  opacity: 1;
  color: #000;
}

.card-body {
  padding: 10px 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card-brand {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #000;
  font-weight: 500;
}

.card-name {
  font-size: 12px;
  color: #555;
  line-height: 1.4;
}

.card-price {
  font-size: 13px;
  color: #000;
  margin-top: 4px;
}
</style>