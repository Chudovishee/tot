import axios from '@/utils/axios';

export function getDashboards() {
  return axios.get('/api/dashboards');
}
