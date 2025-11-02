import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:9090/api/v1',
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const profileService = {
  // Get user profile
  getProfile: () => api.get('/user/profile/'),

  // Update name
  updateName: (data) => api.put('/user/profile/name', data),

  // Update email
  updateEmail: (data) => api.put('/user/profile/email', data),

  // Update password
  updatePassword: (data) => api.put('/user/profile/password', data),

  // Upload profile image
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('profile', file);
    return api.post('/user/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // KYC verification
  kycVerification: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.post('/user/kyc/verification', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};