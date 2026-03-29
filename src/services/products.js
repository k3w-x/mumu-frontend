import api from './api'

export const getProducts = (category) =>
  api.get('/products', { params: category ? { category } : {} })