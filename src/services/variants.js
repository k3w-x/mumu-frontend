import api from './api'

export const getVariants = () =>
  api.get('/product-variants')

export const createVariant = (product_id, size, color, stock) =>
  api.post('/product-variants', { product_id, size, color, stock })

export const updateVariant = (id, stock) =>
  api.put(`/product-variants/${id}`, { stock })

export const deleteVariant = (id) =>
  api.delete(`/product-variants/${id}`)