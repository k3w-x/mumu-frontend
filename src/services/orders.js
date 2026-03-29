import api from './api'

export const createOrder = (items, address, phone, discount) =>
  api.post('/orders', { items, address, phone, discount })

export const getMyOrders = () => api.get('/orders/my')
export const getAllOrders = () => api.get('/orders/all')

export const updateOrderStatus = (id, status) =>
  api.put(`/orders/${id}/status`, { status })