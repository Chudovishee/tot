import { SECURE_USER } from '@/store/users';

export default {
  path: '/dashboards/:dashboard?',
  name: 'dashboards',
  meta: {
    access: SECURE_USER
  },
  component: () => import(/* webpackChunkName: 'dashboards' */ './index')
};
