import Vue from 'vue';
import Vuex from 'vuex';

import user from './user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  modules: {
    user
  },
  plugins: [],
  strict: (process.env.NODE_ENV !== 'production'),
});
