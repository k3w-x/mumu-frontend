import { defineStore } from 'pinia'
import { getProducts } from '@/services/products'
import { getCategories } from '@/services/categories'
import { getBrands } from '@/services/brands'

export const useCatalogStore = defineStore('catalog', {
  state: () => ({
    products: [],
    categories: [],
    brands: [],
    activeCategory: null,
    loading: false
  }),

  actions: {
    async fetchProducts(category = null) {
      this.loading = true
      try {
        const res = await getProducts(category)
        this.products = res.data
        this.activeCategory = category
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      const res = await getCategories()
      this.categories = res.data
    },

    async fetchBrands() {
      const res = await getBrands()
      this.brands = res.data
    }
  }
})


