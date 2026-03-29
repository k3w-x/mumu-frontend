import { defineStore } from 'pinia'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('wishlist')) || []
  }),

  getters: {
    isInWishlist: (state) => (productId) =>
      state.items.some(i => i.id === productId),
    count: (state) => state.items.length
  },

  actions: {
    toggle(product) {
      const index = this.items.findIndex(i => i.id === product.id)
      if (index >= 0) {
        this.items.splice(index, 1)
      } else {
        this.items.push(product)
      }
      localStorage.setItem('wishlist', JSON.stringify(this.items))
    },

    remove(productId) {
      this.items = this.items.filter(i => i.id !== productId)
      localStorage.setItem('wishlist', JSON.stringify(this.items))
    }
  }
})