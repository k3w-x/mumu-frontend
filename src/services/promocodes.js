import api from './api'

export const checkPromocode = (code) =>
  api.post('/promocodes/check', { code })

export const getPromocodes = () => api.get('/promocodes')

export const createPromocode = (code, discount_percent) =>
  api.post('/promocodes', { code, discount_percent })

export const deletePromocode = (id) =>
  api.delete(`/promocodes/${id}`)