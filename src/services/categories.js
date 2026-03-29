import api from './api'

export const getCategories = () => api.get('/categories')
export const getCategoriesTree = () => api.get('/categories/tree')