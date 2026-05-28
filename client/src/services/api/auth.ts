import { apiClient } from './client';

export const authService = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (credentials: any) => apiClient.post('/auth/login', credentials),
  getMe: () => apiClient.get('/auth/me'),
};
