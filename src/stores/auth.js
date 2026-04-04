import { defineStore } from 'pinia'
import { login as loginApi, register as registerApi } from '@/services/auth'
import api from '@/services/api'

const ADMIN_EMAIL = 'kewamal@icloud.com'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    email: localStorage.getItem('email') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
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
      this.user = res.data.user
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('email', email)
      localStorage.setItem('user', JSON.stringify(res.data.user))
    },

    async register(email, password, extraData = {}) {
      await registerApi(email, password, extraData)
    },

    async fetchProfile() {
      try {
        const res = await api.get('/auth/profile')
        this.user = res.data
        localStorage.setItem('user', JSON.stringify(res.data))
      } catch (err) {
        console.error(err)
      }
    },

    async updateProfile(data) {
      const res = await api.put('/auth/profile', data)
      this.user = res.data
      localStorage.setItem('user', JSON.stringify(res.data))
      return res.data
    },

    logout() {
      this.token = null
      this.email = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      localStorage.removeItem('user')
    }
  }
})