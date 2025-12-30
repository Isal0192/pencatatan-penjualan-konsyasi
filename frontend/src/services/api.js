import axios from 'axios';

// Menggunakan URL absolut untuk API backend
const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  getPenitips: () => api.get('/auth/penitips'),
  getPenjuals: () => api.get('/auth/penjuals'),
};

export const itemService = {
  createItem: (data) => api.post('/items', data),
  getMyItems: () => api.get('/items/my'),
  getAllItems: () => api.get('/items'),
  getItemById: (id) => api.get(`/items/${id}`),
  updateItem: (id, data) => api.put(`/items/${id}`, data),
  deleteItem: (id) => api.delete(`/items/${id}`),
  getSoldItems: () => api.get('/items/sold/summary'),
  getSoldItemsDetail: (page, limit) => api.get('/items/sold/detail', { params: { page, limit } }),
  getSoldItemsStatistics: (year, month) => api.get('/items/sold/statistics', { params: { year, month } }),
};

// layanan penitip
export const saleService = {
  createSale: (data) => api.post('/sales', data),
  getMySales: () => api.get('/sales/my'),
  getPenitipSales: () => api.get('/sales/penitip'),
  // lapora n bulanan penitip atau penjual
  getMonthlyReport: (userRole, year, month) => {
    const path = userRole === 'penjual' ? '/sales/penjual/monthly-report' : '/sales/penitip/monthly-report';
    return api.get(path, { params: { year, month } });
  },
  deleteSale: (saleId) => api.delete(`/sales/${saleId}`),
  resetAllSales: () => api.delete('/sales/reset'),
};

export const informationService = {
  createInformation: (data) => api.post('/information', data),
  getInformation: () => api.get('/information'),
};

export const incomeService = {
  getIncomeByPenitipId: (id) => api.get(`/income/penitip/${id}`),
  getIncomeByPenjualId: (id) => api.get(`/income/penjual/${id}`),
};


export default api;
