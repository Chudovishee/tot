import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

import store from '@/store';
import { FETCH_CURRENT_USER } from '@/store/users';

import adminRouter from '@/pages/admin/router';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    adminRouter,
    {
      path: '/404',
      name: '404',
      component: () => import(/* webpackChunkName: 'errors' */ '@/pages/errors/404')
    },
    {
      path: '/403',
      name: '403',
      component: () => import(/* webpackChunkName: 'errors' */ '@/pages/errors/403')
    },
    { path: '*', redirect: '/404' },
  ]
});

router.beforeEach((to, from, next) => {
  if (!from.name) {
    store.dispatch(FETCH_CURRENT_USER)
      .then(() => {
        next();
      });
  }
  else {
    next();
  }
});
router.beforeEach((to, from, next) => {
  if ((to.meta && to.meta.access <= store.getters.accessLevel) || !to.meta || !to.meta.access) {
    next();
  }
  else {
    next({ path: '/403' });
  }
});

export default router;
