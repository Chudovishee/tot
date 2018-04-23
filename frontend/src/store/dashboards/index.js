import { AUTH_API_CALL } from '@/store/users';

import { getDashboards } from './api';

export const FETCH_DASHBOARDS = 'FETCH_DASHBOARDS';
export const FETCH_DASHBOARDS_SUCCESS = 'FETCH_DASHBOARDS_SUCCESS';
export const FETCH_DASHBOARDS_ERROR = 'FETCH_DASHBOARDS_ERROR';

export default {
  state: {
    list: []
  },
  mutations: {
    [FETCH_DASHBOARDS_SUCCESS](state, payload) {
      state.list = payload;
    },
    [FETCH_DASHBOARDS_ERROR](state) {
      state.list = [];
    }
  },
  actions: {
    [FETCH_DASHBOARDS]({ commit, dispatch }) {
      return dispatch(AUTH_API_CALL, getDashboards())
        .then((response) => {
          commit(FETCH_DASHBOARDS_SUCCESS, response.data);
        })
        .catch((error) => {
          commit(FETCH_DASHBOARDS_ERROR, error);
          throw error;
        });
    }
  }
};
