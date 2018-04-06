import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

import store from '@/store';
import { FETCH_CURRENT_USER } from '@/store/user';

import adminRouter from '@/pages/admin/router';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    adminRouter
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

export default router;
