import Vue from 'vue';
import ElementUI from 'element-ui';

import App from './App';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(ElementUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
