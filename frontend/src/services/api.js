import axios from 'axios'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token only for protected APIs
api.interceptors.request.use(
  (config) => {
    const isAuthApi = config.url?.startsWith('/auth')
    if (!isAuthApi) {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// AUTH
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  adminRegister: (data) => api.post('/auth/admin/register', data),
  adminLogin: (data) => api.post('/auth/admin/login', data),
}

// CONTACTS
export const contactAPI = {
  getAll: () => api.get('/contacts'),
  create: (data) => api.post('/contacts', data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
  search: (keyword) =>
    api.get(`/contacts/search?keyword=${keyword}`),
}

// USER
export const userAPI = {
  getProfile: () => api.get('/user/profile'),

  uploadImage: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/user/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // REQUIRED BY UserDashboard.jsx
  getImageUrl: (imagePath) => {
    if (!imagePath) return null
    const filename = imagePath.replace('uploads/', '')
    return `${API_BASE_URL}/user/images/${filename}`
  },
}

// ADMIN
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getUserContacts: (userId) =>
    api.get(`/admin/users/${userId}/contacts`),
}

export default api
