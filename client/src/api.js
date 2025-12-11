import axios from 'axios';

// 🚀 Đã sửa: Sử dụng biến môi trường cho baseURL, có giá trị dự phòng cho local
// * Lưu ý: Vite sử dụng import.meta.env.VITE_... thay vì process.env
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
 (config) => {
 const token = localStorage.getItem('token');
 if (token) {
config.headers.Authorization = `Bearer ${token}`;
 }
 return config; },
(error) => Promise.reject(error)
);

export default api;