import apiClient from './client';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data.data; // { user, accessToken }
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data.data; // { user }
  },

  verifySession: async () => {
    const response = await apiClient.get('/protected');
    return response.data;
  },
};
