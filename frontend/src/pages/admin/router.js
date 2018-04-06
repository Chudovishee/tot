export default {
  path: '/admin',
  name: 'admin',
  redirect: '/admin/users',
  component: () => import(/* webpackChunkName: 'admin' */ './index'),
  children: [
    {
      path: 'users',
      name: 'users',
      component: () => import(/* webpackChunkName: 'admin' */ './users/index')
    }
  ]
};
