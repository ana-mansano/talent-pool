import axios from 'axios'

// Desestrutura só a variável que você precisa
const { VITE_API_URL } = import.meta.env

const api = axios.create({
  baseURL: VITE_API_URL,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
