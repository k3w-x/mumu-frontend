<template>
  <div class="catalog">
    <div class="catalog-header">
      <div class="catalog-title-row">
        <h1 class="catalog-title">{{ catalog.activeCategory || 'Все товары' }}</h1>
        <span class="catalog-count" v-if="!catalog.loading">{{ filtered.length }} товаров</span>
      </div>

      <!-- Фильтры в одну строку -->
      <div class="catalog-filters">
        <input
          v-model="search"
          class="filter-search"
          placeholder="Поиск..."
        />

        <div class="filter-group">
          <input v-model.number="priceFrom" type="number" class="filter-price" placeholder="Цена от" />
          <span class="filter-sep">—</span>
          <input v-model.number="priceTo" type="number" class="filter-price" placeholder="до" />
        </div>

        <div class="filter-sizes" v-if="availableSizes.length">
          <button
            v-for="size in availableSizes"
            :key="size"
            :class="['size-btn', selectedSizes.includes(size) ? 'active' : '']"
            @click="toggleSize(size)"
          >
            {{ size }}
          </button>
        </div>

        <button v-if="hasFilters" class="filter-reset" @click="resetFilters">
          Сбросить
        </button>
      </div>
    </div>

    <LoadingSpinner v-if="catalog.loading" />
    <div v-else-if="filtered.length === 0" class="empty">Товары не найдены</div>
    <ProductGrid v-else :products="filtered" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { getCategoriesTree } from '@/services/categories'
import ProductGrid from '@/components/catalog/ProductGrid.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const catalog = useCatalogStore()
const route = useRoute()

const search = ref('')
const priceFrom = ref('')
const priceTo = ref('')
const selectedSizes = ref([])

const availableSizes = computed(() => {
  const sizes = new Set()
  catalog.products.forEach(p =>
    p.variants?.forEach(v => { if (v.stock > 0) sizes.add(v.size) })
  )
  return [...sizes].sort()
})

const hasFilters = computed(() =>
  search.value || priceFrom.value !== '' || priceTo.value !== '' || selectedSizes.value.length > 0
)

const filtered = computed(() => {
  let list = catalog.products
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    )
  }
  if (priceFrom.value !== '') list = list.filter(p => Number(p.price) >= priceFrom.value)
  if (priceTo.value !== '') list = list.filter(p => Number(p.price) <= priceTo.value)
  if (selectedSizes.value.length > 0) {
    list = list.filter(p =>
      p.variants?.some(v => selectedSizes.value.includes(v.size) && v.stock > 0)
    )
  }
  return list
})

const toggleSize = (size) => {
  const idx = selectedSizes.value.indexOf(size)
  if (idx >= 0) selectedSizes.value.splice(idx, 1)
  else selectedSizes.value.push(size)
}

const resetFilters = () => {
  search.value = ''
  priceFrom.value = ''
  priceTo.value = ''
  selectedSizes.value = []
}

onMounted(async () => {
  await catalog.fetchCategories()
  await getCategoriesTree()
  const category = route.query.category || null
  const q = route.query.q || ''
  if (q) search.value = q
  await catalog.fetchProducts(category)
})

watch(() => route.query.category, (category) => {
  resetFilters()
  catalog.fetchProducts(category || null)
})
</script>

<style scoped>
.catalog { display: flex; flex-direction: column; gap: 24px; }

.catalog-header {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 16px;
}

.catalog-title-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.catalog-title {
  font-size: 22px;
  font-weight: 300;
  letter-spacing: -0.01em;
}

.catalog-count {
  font-size: 12px;
  color: #999;
}

.catalog-filters {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-search {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 0;
  font-size: 12px;
  outline: none;
  width: 180px;
}

.filter-search:focus { border-color: #000; }

.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-price {
  width: 80px;
  padding: 6px 10px;
  border: 1px solid #ddd;
  font-size: 12px;
  outline: none;
}

.filter-price:focus { border-color: #000; }
.filter-sep { font-size: 12px; color: #999; }

.filter-sizes {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.size-btn {
  padding: 4px 10px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
  letter-spacing: 0.03em;
}

.size-btn:hover { border-color: #000; }
.size-btn.active { background: #000; border-color: #000; color: #fff; }

.filter-reset {
  font-size: 11px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.filter-reset:hover { color: #000; }

.empty {
  padding: 80px 0;
  text-align: center;
  color: #999;
  font-size: 13px;
}
</style>