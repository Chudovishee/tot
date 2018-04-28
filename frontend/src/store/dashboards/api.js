import axios from '@/utils/axios';

export function getDashboards() {
  return axios.get('/api/dashboards');
}

export function addDashboard(payload) {
  return axios.post('/api/dashboards', payload);
}

export function getDashboard(dashboard) {
  return axios.get(`/api/dashboards/${dashboard}`);
}

export function editDashboard(dashboard, payload) {
  return axios.put(`/api/dashboards/${dashboard}`, payload);
}
