import axios from '@/utils/axios';

export function getCurrentUser() {
  return axios.get('/api/users/current');
}

export function login(name, password) {
  return axios.post(`/api/users/${name}/login`, { password });
}

export function logout() {
  return axios.post('/api/users/current/logout', {});
}

export function addUser(payload) {
  return axios.post('/api/users', payload);
}

export function deleteUser(name) {
  return axios.delete(`/api/users/${name}`);
}

export function getUsers() {
  return axios.get('/api/users');
}
