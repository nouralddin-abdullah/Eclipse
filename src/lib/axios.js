import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const TOKEN_KEY = 'eclipse_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      setToken(null)
    }
    return Promise.reject(err)
  }
)

export const apiOrigin = baseURL

export default api
