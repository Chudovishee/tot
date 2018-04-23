import { SECURE_ADMIN } from '@/store/users';

export default {
  path: '/admin',
  name: 'admin',
  redirect: '/admin/users',
  meta: {
    access: SECURE_ADMIN
  },
  component: () => import(/* webpackChunkName: 'admin' */ './index'),
  children: [
    {
      path: 'users',
      name: 'users',
      meta: {
        access: SECURE_ADMIN
      },
      component: () => import(/* webpackChunkName: 'admin' */ './users/index')
    }
  ]
};
