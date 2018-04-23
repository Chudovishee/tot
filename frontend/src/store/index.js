import Vue from 'vue';
import Vuex from 'vuex';

import users from './users';
import dashboards from './dashboards';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  modules: {
    users,
    dashboards
  },
  plugins: [],
  strict: (process.env.NODE_ENV !== 'production'),
});
