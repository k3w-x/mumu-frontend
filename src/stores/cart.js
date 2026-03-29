import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: JSON.parse(localStorage.getItem('cart')) || []
  }),

  getters: {
    totalCount: (state) => state.items.reduce((sum, i) => sum + i.quantity, 0),

    totalPrice: (state) => state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  },

  actions: {
    addItem(product, variant) {
      const existing = this.items.find(i => i.variant.id === variant.id)
      if (existing) {
        existing.quantity++
      } else {
        this.items.push({ product, variant, quantity: 1 })
      }
      this._save()
    },

    removeItem(variantId) {
      this.items = this.items.filter(i => i.variant.id !== variantId)
      this._save()
    },

    updateQuantity(variantId, quantity) {
      const item = this.items.find(i => i.variant.id === variantId)
      if (item) {
        item.quantity = quantity
        this._save()
      }
    },

    clearCart() {
      this.items = []
      this._save()
    },

    _save() {
      localStorage.setItem('cart', JSON.stringify(this.items))
    }
  }
})