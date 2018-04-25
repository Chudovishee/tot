import axios from '@/utils/axios';

export function getDashboards() {
  return axios.get('/api/dashboards');
}

export function addDashboard(payload) {
  return axios.post('/api/dashboards', payload);
}
