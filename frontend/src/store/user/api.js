import axios from '@/utils/axios';

export function getCurrentUser() {
  return axios.get('/api/user');
}

export function login(name, password) {
  return axios.post(`/api/user/${name}/login`, { password });
}

export function logout() {
  return axios.post('/api/user/logout', {});
}
