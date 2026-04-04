import api from './api'

export const register = (email, password, extraData = {}) =>
  api.post('/auth/register', { email, password, ...extraData })

export const login = (email, password) =>
  api.post('/auth/login', { email, password })