<template>
  <div class="home">
    <!-- Hero -->
    <div class="hero">
      <h1 class="hero-title">MUMU Store</h1>
      <p class="hero-sub">Новая коллекция доступна сейчас</p>
      <button class="hero-btn" @click="$router.push('/catalog')">
        Смотреть каталог →
      </button>
    </div>

    <!-- Категории -->
    <div class="section" v-if="tree.length">
      <div class="section-header">
        <span class="section-title">Категории</span>
      </div>
      <div class="cat-list">
        <div
          v-for="parent in tree"
          :key="parent.id"
          class="cat-item"
          @click="goCategory(parent.name)"
        >
          <span class="cat-name">{{ parent.name }}</span>
          <span class="cat-count" v-if="parent.children?.length">
            {{ parent.children.length }} подкатегорий
          </span>
        </div>
      </div>
    </div>

    <!-- Новинки -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Новинки</span>
        <RouterLink to="/catalog" class="section-link">Смотреть все →</RouterLink>
      </div>
      <LoadingSpinner v-if="catalog.loading" />
      <ProductGrid v-else :products="catalog.products.slice(0, 12)" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCatalogStore } from '@/stores/catalog'
import { getCategoriesTree } from '@/services/categories'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ProductGrid from '@/components/catalog/ProductGrid.vue'

const catalog = useCatalogStore()
const router = useRouter()
const tree = ref([])

onMounted(async () => {
  const [, treeRes] = await Promise.all([
    catalog.fetchCategories(),
    getCategoriesTree()
  ])
  tree.value = treeRes.data
  await catalog.fetchProducts()
})

const goCategory = (name) => {
  router.push({ path: '/catalog', query: { category: name } })
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.hero {
  padding: 80px 0 60px;
  border-bottom: 1px solid #e8e8e8;
  background: url('@/assets/home.webp') center/cover no-repeat;
}

.hero-title {
  font-size: 64px;
  font-weight: 300;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 16px;
  color: #fff;
  margin-left: 20px;
}

.hero-sub {
  font-size: 14px;
  color: #c9c9c9;
  margin-bottom: 32px;
  margin-left: 20px;
}

.hero-btn {
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 12px 28px;
  font-size: 13px;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: opacity 0.2s;
  margin-left: 20px;
}

.hero-btn:hover { opacity: 0.75; }

.section { display: flex; flex-direction: column; gap: 16px; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 10px;
}

.section-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.section-link {
  font-size: 11px;
  color: #999;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.section-link:hover { color: #000; }

.cat-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1px;
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
}

.cat-item {
  background: #fff;
  padding: 20px 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: background 0.15s;
}

.cat-item:hover { background: #000; }
.cat-item:hover .cat-name { color: #fff; }
.cat-item:hover .cat-count { color: #999; }

.cat-name {
  font-size: 13px;
  font-weight: 500;
  color: #000;
  transition: color 0.15s;
}

.cat-count {
  font-size: 11px;
  color: #aaa;
  transition: color 0.15s;
}



@media (max-width: 768px) {
  .hero {
    padding: 40px 0 32px;
  }

  .hero-title {
    font-size: 40px;
  }

  .cat-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 32px;
  }

  .cat-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

</style>