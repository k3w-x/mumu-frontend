<template>
  <div class="wishlist-page">
    <div class="page-header">
      <h1 class="page-title">Избранное
        <span class="page-count" v-if="wishlist.items.length">({{ wishlist.items.length }} товаров)</span>
      </h1>
      <p class="page-sub">Товары которые вам понравились</p>
    </div>

    <div v-if="wishlist.items.length === 0" class="empty">
      <p>Список избранного пуст</p>
      <RouterLink to="/catalog" class="empty-link">Перейти в каталог →</RouterLink>
    </div>

    <div v-else class="wishlist-list">
      <div v-for="product in wishlist.items" :key="product.id" class="wishlist-item">
        <div class="wishlist-item-img" @click="$router.push(`/product/${product.id}`)">
          <img v-if="product.images?.length" :src="getImageUrl(product.images[0].filename)" :alt="product.name" />
          <div v-else class="img-empty"></div>
        </div>

        <div class="wishlist-item-info">
          <p class="item-brand">{{ product.brand_name || product.category }}</p>
          <p class="item-name" @click="$router.push(`/product/${product.id}`)">{{ product.name }}</p>
          <p class="item-price">{{ formatPrice(product.price) }}</p>
          <p v-if="inStock(product)" class="item-stock">В наличии</p>
          <p v-else class="item-stock item-stock--out">Нет в наличии</p>
        </div>

        <div class="wishlist-item-actions">
          <button class="add-to-cart-btn" :disabled="!inStock(product)" @click="addToCart(product)">
            Добавить в корзину
          </button>
          <button class="remove-btn" @click="wishlist.remove(product.id)">Удалить 🗑</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'

const wishlist = useWishlistStore()
const cart = useCartStore()
const toast = useToastStore()
const apiUrl = import.meta.env.VITE_API_URL

const getImageUrl = (filename) => {
  if (!filename) return ''
  if (filename.startsWith('http')) return filename
  return `${apiUrl}/uploads/${filename}`
}

const formatPrice = (price) => Number(price).toLocaleString('ru-RU') + ' UZS'
const inStock = (product) => product.variants?.some(v => v.stock > 0)

const addToCart = (product) => {
  const variant = product.variants?.find(v => v.stock > 0)
  if (variant) {
    cart.addItem(product, variant)
    toast.success('Добавлено в корзину')
  }
}
</script>

<style scoped>
.wishlist-page { display: flex; flex-direction: column; gap: 0; }
.page-header { padding-bottom: 16px; border-bottom: 1px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; }
.page-title { font-size: 18px; font-weight: 300; letter-spacing: -0.01em; }
.page-count { font-size: 14px; color: #999; margin-left: 8px; }
.page-sub { font-size: 12px; color: #999; }
.empty { padding: 80px 0; display: flex; flex-direction: column; gap: 16px; }
.empty p { font-size: 13px; color: #999; }
.empty-link { font-size: 12px; color: #000; text-decoration: underline; text-underline-offset: 3px; }
.wishlist-list { display: flex; flex-direction: column; }
.wishlist-item { display: grid; grid-template-columns: 200px 1fr auto; gap: 24px; padding: 24px 0; border-bottom: 1px solid #e8e8e8; align-items: center; }
.wishlist-item-img { width: 200px; height: 250px; background: #f2f2f0; overflow: hidden; cursor: pointer; }
.wishlist-item-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.wishlist-item-img:hover img { transform: scale(1.03); }
.img-empty { width: 100%; height: 100%; }
.wishlist-item-info { display: flex; flex-direction: column; gap: 6px; }
.item-brand { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 500; }
.item-name { font-size: 14px; color: #333; line-height: 1.4; cursor: pointer; }
.item-name:hover { text-decoration: underline; text-underline-offset: 2px; }
.item-price { font-size: 14px; color: #000; margin-top: 4px; }
.item-stock { font-size: 11px; color: #27ae60; margin-top: 2px; }
.item-stock--out { color: #c0392b; }
.wishlist-item-actions { display: flex; flex-direction: column; gap: 8px; align-items: flex-end; min-width: 160px; }
.add-to-cart-btn { padding: 10px 16px; background: #000; color: #fff; border: none; font-size: 12px; cursor: pointer; letter-spacing: 0.04em; transition: opacity 0.2s; white-space: nowrap; }
.add-to-cart-btn:hover:not(:disabled) { opacity: 0.75; }
.add-to-cart-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.remove-btn { background: none; border: none; font-size: 11px; color: #999; cursor: pointer; text-decoration: underline; text-underline-offset: 2px; padding: 0; }
.remove-btn:hover { color: #000; }
@media (max-width: 768px) {
  .wishlist-item { grid-template-columns: 120px 1fr; grid-template-rows: auto auto; gap: 16px; }
  .wishlist-item-img { width: 120px; height: 150px; }
  .wishlist-item-actions { grid-column: 1 / -1; flex-direction: row; align-items: center; justify-content: flex-start; }
}
@media (max-width: 480px) {
  .wishlist-item { grid-template-columns: 100px 1fr; }
  .wishlist-item-img { width: 100px; height: 125px; }
}
</style>