<template>
  <div v-if="product" class="product-page">

    <!-- Левая часть — галерея -->
    <!-- Левая часть — галерея -->
    <div class="product-gallery">

      <!-- Десктоп: вертикальные миниатюры слева -->
      <div class="gallery-thumbs" v-if="product.images?.length > 1">
        <div v-for="(img, i) in product.images" :key="img.id" :class="['thumb', i === activeImg ? 'active' : '']"
          @click="activeImg = i">
          <img :src="`${apiUrl}/uploads/${img.filename}`" :alt="'Фото ' + (i + 1)" />
        </div>
      </div>

      <!-- Десктоп: главное фото -->
      <div class="gallery-main desktop-main">
        <img v-if="product.images?.length" :src="`${apiUrl}/uploads/${product.images[activeImg].filename}`"
          :alt="product.name" />
        <div v-else class="gallery-empty"></div>
      </div>

      <!-- Мобильный свайп -->
      <div class="mobile-swipe" v-if="product.images?.length" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <div class="mobile-swipe-track" :style="{ transform: `translateX(-${activeImg * 100}%)` }">
          <div v-for="(img, i) in product.images" :key="img.id" class="mobile-swipe-slide">
            <img :src="`${apiUrl}/uploads/${img.filename}`" :alt="'Фото ' + (i + 1)" />
          </div>
        </div>
        <!-- Мобильные миниатюры под свайпом -->
        <div class="mobile-thumbs" v-if="product.images?.length > 1">
          <div v-for="(img, i) in product.images" :key="img.id"
            :class="['mobile-thumb', i === activeImg ? 'active' : '']" @click="activeImg = i">
            <img :src="`${apiUrl}/uploads/${img.filename}`" :alt="'Фото ' + (i + 1)" />
          </div>
        </div>
        <!-- Точки-индикаторы -->
        <div class="swipe-dots" v-if="product.images.length > 1">
          <span v-for="(img, i) in product.images" :key="i" :class="['dot', i === activeImg ? 'active' : '']"
            @click="activeImg = i"></span>
        </div>
      </div>

    </div>

    <!-- Правая панель — прилипает -->
    <div class="product-info">
      <!-- Путь -->
      <div class="product-path">
        <RouterLink to="/catalog">Каталог</RouterLink>
        <span> / </span>
        <span>{{ product.category }}</span>
      </div>

      <div class="product-header">
        <p class="product-brand">{{ product.brand || product.category }}</p>
        <h1 class="product-name">{{ product.name }}</h1>
        <p class="product-price">{{ formatPrice(product.price) }}</p>
      </div>

      <!-- Размеры -->
      <div class="product-sizes" v-if="product.variants?.length">
        <p class="sizes-label">ВЫБЕРИТЕ РАЗМЕР</p>
        <div class="sizes-grid">
          <button v-for="v in product.variants" :key="v.id"
            :class="['size-btn', selectedVariant?.id === v.id ? 'active' : '', v.stock === 0 ? 'sold' : '']"
            :disabled="v.stock === 0" @click="selectedVariant = v">
            {{ v.size }}
            <span v-if="v.color !== 'default'" class="size-color">/ {{ v.color }}</span>
          </button>
        </div>
      </div>

      <!-- Кнопка добавить -->
      <button class="add-btn" :disabled="!selectedVariant" @click="addToCart">
        {{ selectedVariant ? `ДОБАВИТЬ В КОРЗИНУ ( ${formatPrice(product.price)} )` : 'ВЫБЕРИТЕ РАЗМЕР' }}
      </button>

      <button :class="['wish-link', wishlist.isInWishlist(product.id) ? 'wished' : '']" @click="toggleWish">
        {{ wishlist.isInWishlist(product.id) ? '♥ В избранном' : '♡ Добавить в избранное' }}
      </button>

      <p v-if="added" class="added-msg">Добавлено в корзину</p>

      <!-- Детали -->
      <div class="product-details" v-if="product.description || product.material">
        <details class="detail-block" v-if="product.description">
          <summary class="detail-summary">ОПИСАНИЕ</summary>
          <p class="detail-text">{{ product.description }}</p>
        </details>
        <details class="detail-block" v-if="product.material">
          <summary class="detail-summary">СОСТАВ И МАТЕРИАЛ</summary>
          <p class="detail-text">{{ product.material }}</p>
        </details>
      </div>
    </div>

  </div>

  <LoadingSpinner v-else-if="loading" />
  <div v-else class="not-found">Товар не найден</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProducts } from '@/services/products'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useToastStore } from '@/stores/toast'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route = useRoute()
const cart = useCartStore()
const wishlist = useWishlistStore()
const toast = useToastStore()

const apiUrl = import.meta.env.VITE_API_URL
const product = ref(null)
const loading = ref(true)
const selectedVariant = ref(null)
const activeImg = ref(0)
const added = ref(false)

// Свайп на мобилке
const touchStartX = ref(0)

const onTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
}

const onTouchEnd = (e) => {
  const diff = touchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(diff) < 40) return // слишком короткий свайп
  if (diff > 0 && activeImg.value < product.value.images.length - 1) {
    activeImg.value++
  } else if (diff < 0 && activeImg.value > 0) {
    activeImg.value--
  }
}

onMounted(async () => {
  try {
    const res = await getProducts()
    product.value = res.data.find(p => p.id === Number(route.params.id))
  } finally {
    loading.value = false
  }
})

const formatPrice = (price) => Number(price).toLocaleString('ru-RU') + ' UZS'

const addToCart = () => {
  if (!selectedVariant.value) return
  cart.addItem(product.value, selectedVariant.value)
  toast.success('Добавлено в корзину')
  added.value = true
  setTimeout(() => added.value = false, 2000)
}

const toggleWish = () => {
  wishlist.toggle(product.value)
  toast.info(wishlist.isInWishlist(product.value.id) ? 'Добавлено в избранное' : 'Убрано из избранного')
}
</script>

<style scoped>
.product-page {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 0;
  align-items: start;
  min-height: calc(100vh - 40px);
}

/* Галерея */
.product-gallery {
  display: flex;
  gap: 10px;
  padding-right: 40px;
}

.gallery-thumbs {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 60px;
  flex-shrink: 0;
}

.thumb {
  width: 60px;
  height: 75px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid transparent;
  transition: border-color 0.15s;
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb.active {
  border-color: #000;
}

.gallery-main {
  flex: 1;
  background: #f2f2f0;
}

.gallery-main img {
  width: 100%;
  display: block;
}

.gallery-empty {
  width: 100%;
  aspect-ratio: 3/4;
  background: #f2f2f0;
}

/* Правая панель — прилипает */
.product-info {
  position: sticky;
  top: 40px;
  padding: 0 0 40px 40px;
  border-left: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.product-path {
  font-size: 11px;
  color: #999;
  letter-spacing: 0.03em;
}

.product-path a:hover {
  color: #000;
  text-decoration: underline;
}

.product-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-brand {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.product-name {
  font-size: 15px;
  font-weight: 300;
  line-height: 1.4;
  color: #000;
}

.product-price {
  font-size: 15px;
  color: #000;
  margin-top: 4px;
}

/* Размеры */
.product-sizes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sizes-label {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: #999;
}

.sizes-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.size-btn {
  padding: 8px 14px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.03em;
}

.size-btn:hover:not(:disabled) {
  border-color: #000;
}

.size-btn.active {
  background: #000;
  border-color: #000;
  color: #fff;
}

.size-btn.sold {
  opacity: 0.35;
  cursor: not-allowed;
  text-decoration: line-through;
}

.size-color {
  color: #999;
  font-size: 11px;
}

/* Кнопки */
.add-btn {
  width: 100%;
  padding: 14px;
  background: #000;
  color: #fff;
  border: none;
  font-size: 12px;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: opacity 0.2s;
}

.add-btn:hover:not(:disabled) {
  opacity: 0.75;
}

.add-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.wish-link {
  background: none;
  border: none;
  font-size: 12px;
  color: #999;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: color 0.15s;
}

.wish-link:hover {
  color: #000;
}

.wish-link.wished {
  color: #000;
}

.added-msg {
  font-size: 12px;
  color: #27ae60;
}

/* Детали */
.product-details {
  border-top: 1px solid #e8e8e8;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-block {
  border-bottom: 1px solid #e8e8e8;
}

.detail-summary {
  padding: 12px 0;
  font-size: 11px;
  letter-spacing: 0.1em;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-summary::-webkit-details-marker {
  display: none;
}

.detail-summary::after {
  content: '+';
  font-size: 16px;
  color: #999;
}

details[open] .detail-summary::after {
  content: '−';
}

.detail-text {
  font-size: 12px;
  color: #555;
  line-height: 1.7;
  padding-bottom: 14px;
}

.not-found {
  padding: 80px 0;
  text-align: center;
  color: #999;
  font-size: 13px;
}


/* Мобильный свайп */
.mobile-swipe {
  position: relative;
  width: 100%;
  overflow: hidden;
  background: #f2f2f0;
}

.mobile-swipe-track {
  display: flex;
  transition: transform 0.35s ease;
  will-change: transform;
}

.mobile-swipe-slide {
  min-width: 100%;
  aspect-ratio: 3/4;
}

.mobile-swipe-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.swipe-dots {
  position: absolute;
  bottom: 12px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background 0.2s;
}

.dot.active {
  background: #fff;
}

@media (max-width: 768px) {
  .product-page {
    grid-template-columns: 1fr;
  }

  .product-gallery {
    padding-right: 0;
  }

  .product-info {
    position: static;
    border-left: none;
    border-top: 1px solid #e8e8e8;
    padding: 24px 0 0;
    max-height: none;
    overflow: visible;
  }

  /* Прячем десктопную галерею на мобилке */
  .gallery-thumbs,
  .desktop-main {
    display: none;
  }
}

@media (min-width: 769px) {

  /* Прячем мобильный свайп на десктопе */
  .mobile-swipe {
    display: none;
  }
}

@media (max-width: 480px) {
  .gallery-thumbs {
    flex-direction: row;
    width: 100%;
    overflow-x: auto;
    gap: 6px;
    padding-bottom: 4px;
  }

  .thumb {
    width: 80px;
    height: 100px;
    flex-shrink: 0;
  }
}

/* Мобильные миниатюры */
.mobile-thumbs {
  display: none;
}

@media (max-width: 768px) {
  .mobile-thumbs {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 8px 0 4px;
    width: 100%;
    max-width: 100%;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .mobile-thumbs::-webkit-scrollbar {
    display: none;
  }

  .mobile-thumb {
    width: 72px;
    min-width: 72px;
    height: 90px;
    flex-shrink: 0;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s;
    overflow: hidden;
  }

  .mobile-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .mobile-thumb.active {
    border-color: #000;
  }
}
</style>