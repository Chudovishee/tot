import Vue from 'vue';
import ElementUI from 'element-ui';

import Tot from './tot';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#tot',
  router,
  store,
  components: { Tot },
  template: '<Tot/>'
});
