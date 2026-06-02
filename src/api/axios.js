import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://ats-backend-s69p.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance