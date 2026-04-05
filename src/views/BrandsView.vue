<template>
    <div class="brands-page">
        <div class="page-header">
            <h1 class="page-title">Бренды</h1>
            <p class="page-sub">Все представленные бренды в MUMU Store</p>
        </div>

        <LoadingSpinner v-if="loading" />

        <div v-else>
            <!-- Список брендов -->
            <div v-if="!activeBrand" class="brands-grid">
                <div v-for="brand in brands" :key="brand.id" class="brand-card" @click="selectBrand(brand)">
                    <div class="brand-logo-wrap">
                        <img v-if="brand.logo_url" :src="brand.logo_url" :alt="brand.name" class="brand-logo" />
                        <span v-else class="brand-initials">{{ brand.name[0] }}</span>
                    </div>
                    <div class="brand-footer">
                        <p class="brand-name">{{ brand.name }}</p>
                        <span class="brand-view">Смотреть →</span>
                    </div>
                </div>
            </div>

            <!-- Товары бренда -->
            <div v-else class="brand-products">
                <div class="brand-products-header">
                    <button class="back-btn" @click="activeBrand = null">← Все бренды</button>
                    <div class="brand-products-title">
                        <img v-if="activeBrand.logo_url" :src="activeBrand.logo_url" :alt="activeBrand.name"
                            class="brand-logo-sm" />
                        <h2>{{ activeBrand.name }}</h2>
                    </div>
                    <p class="brand-products-desc" v-if="activeBrand.description">{{ activeBrand.description }}</p>
                </div>

                <LoadingSpinner v-if="productsLoading" />
                <div v-else-if="brandProducts.length === 0" class="empty">
                    <p>Товаров этого бренда пока нет</p>
                </div>
                <ProductGrid v-else :products="brandProducts" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBrands } from '@/services/brands'
import { getProducts } from '@/services/products'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'

const brands = ref([])
const loading = ref(true)
const activeBrand = ref(null)
const brandProducts = ref([])
const productsLoading = ref(false)

onMounted(async () => {
    const res = await getBrands()
    brands.value = res.data
    loading.value = false
})

const selectBrand = async (brand) => {
    activeBrand.value = brand
    productsLoading.value = true
    try {
        const res = await getProducts({ brand_id: brand.id })
        brandProducts.value = res.data
    } catch (err) {
        console.error(err)
    } finally {
        productsLoading.value = false
    }
}
</script>

<style scoped>
.brands-page { display: flex; flex-direction: column; gap: 32px; }
.page-header { padding-bottom: 20px; border-bottom: 1px solid #e8e8e8; display: flex; flex-direction: column; gap: 4px; }
.page-title { font-size: 22px; font-weight: 300; }
.page-sub { font-size: 12px; color: #999; }

.brands-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
}

.brand-card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background: #fff;
  transition: background 0.2s;
}

.brand-card:hover { background: #f8f8f6; }

.brand-logo-wrap {
  width: 100%;
  aspect-ratio: 2/1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.brand-logo {
  max-width: 80%;
  max-height: 50px;
  object-fit: contain;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s;
}

.brand-card:hover .brand-logo {
  filter: grayscale(0%);
  opacity: 1;
}

.brand-initials {
  font-size: 28px;
  font-weight: 200;
  color: #ccc;
}

.brand-footer {
  padding: 10px 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid #e8e8e8;
}

.brand-name { font-size: 12px; font-weight: 500; letter-spacing: 0.03em; }
.brand-view { font-size: 11px; color: #aaa; }
.brand-card:hover .brand-view { color: #000; }

/* Товары бренда */
.brand-products { display: flex; flex-direction: column; gap: 24px; }
.brand-products-header { display: flex; flex-direction: column; gap: 12px; padding-bottom: 20px; border-bottom: 1px solid #e8e8e8; }
.back-btn { background: none; border: none; font-size: 12px; color: #999; cursor: pointer; text-align: left; padding: 0; align-self: flex-start; }
.back-btn:hover { color: #000; }
.brand-products-title { display: flex; align-items: center; gap: 12px; }
.brand-products-title h2 { font-size: 20px; font-weight: 300; }
.brand-logo-sm { width: 40px; height: 40px; object-fit: contain; border: 1px solid #eee; border-radius: 6px; padding: 2px; }
.brand-products-desc { font-size: 13px; color: #777; line-height: 1.6; }
.empty { padding: 60px 0; text-align: center; color: #999; font-size: 13px; }

@media (max-width: 768px) {
  .brands-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>