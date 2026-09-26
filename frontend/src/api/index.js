import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

// Attach JWT on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export const userAPI = {
  getUser: (id) => API.get(`/users/${id}`),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  getAddresses: (id) => API.get(`/users/${id}/addresses`),
  addAddress: (id, data) => API.post(`/users/${id}/addresses`, data),
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
};

export const brandAPI = {
  getAll: () => API.get('/brands'),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
  getRelated: (id) => API.get(`/products/${id}/related`),
};

export const cartAPI = {
  getCart: (userId) => API.get(`/cart/${userId}`),
  addItem: (userId, data) => API.post(`/cart/${userId}/items`, data),
  updateItem: (userId, itemId, data) => API.put(`/cart/${userId}/items/${itemId}`, data),
  removeItem: (userId, itemId) => API.delete(`/cart/${userId}/items/${itemId}`),
};

export const orderAPI = {
  placeOrder: (data) => API.post('/orders', data),
  getOrders: (userId) => API.get(`/orders/user/${userId}`),
  getOrder: (id) => API.get(`/orders/${id}`),
  cancelOrder: (id) => API.put(`/orders/${id}/cancel`),
};

export const paymentAPI = {
  processPayment: (data) => API.post('/payments', data),
  getPayment: (id) => API.get(`/payments/${id}`),
};

export const recommendationAPI = {
  getRecommendations: (userId) => API.get(`/recommendations/${userId}`),
};

export default API;
