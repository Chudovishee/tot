import axios from '@/utils/axios';

export function addUser(payload) {
  return axios.post('/api/user', payload);
}
