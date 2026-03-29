import api from './api'

export const uploadImages = (productId, files) => {
  const formData = new FormData()
  files.forEach(file => formData.append('images', file))
  formData.append('product_id', productId)
  return api.post('/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}