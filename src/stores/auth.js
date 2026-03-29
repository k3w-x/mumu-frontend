import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi } from '@/services/auth'

const ADMIN_EMAIL = 'kewamal@icloud.com' // ← сюда вставь свой email

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.email === ADMIN_EMAIL,
  },

  actions: {
    async login(email, password) {
      const res = await loginApi(email, password)
      this.token = res.data.token
      this.email = email
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('email', email)
    },

    async register(email, password) {
      await registerApi(email, password)
    },

    logout() {
      this.token = null
      this.email = null
      localStorage.removeItem('token')
      localStorage.removeItem('email')
    }
  }
})