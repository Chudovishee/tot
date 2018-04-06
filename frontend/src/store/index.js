import Vue from 'vue';
import Vuex from 'vuex';

import user from './user';
import users from './users';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false
  },
  modules: {
    user,
    users
  },
  plugins: [],
  strict: (process.env.NODE_ENV !== 'production'),
});
