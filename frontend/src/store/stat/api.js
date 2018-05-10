import axios from '@/utils/axios';

export function getStat(name, start, end) {
  return axios.get(`/api/stat/${name}`, { params: { start, end } });
}

export function getAvailableStat() {
  return axios.get('/api/stat');
}
