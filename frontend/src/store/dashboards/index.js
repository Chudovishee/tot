import { AUTH_API_CALL } from '@/store/users';

import {
  getDashboards,
  addDashboard,
  getDashboard
} from './api';

export const FETCH_DASHBOARDS = 'FETCH_DASHBOARDS';
export const ADD_DASHBOARD = 'ADD_DASHBOARD';
export const OPEN_DASHBOARD = 'OPEN_DASHBOARD';

export const FETCH_DASHBOARDS_SUCCESS = 'FETCH_DASHBOARDS_SUCCESS';
export const FETCH_DASHBOARDS_ERROR = 'FETCH_DASHBOARDS_ERROR';
export const OPEN_DASHBOARD_SUCCESS = 'OPEN_DASHBOARD_SUCCESS';
export const OPEN_DASHBOARD_ERROR = 'OPEN_DASHBOARD_ERROR';

export default {
  state: {
    list: [],
    open: null
  },
  mutations: {
    [FETCH_DASHBOARDS_SUCCESS](state, payload) {
      state.list = payload;
    },
    [FETCH_DASHBOARDS_ERROR](state) {
      state.list = [];
    },
    [OPEN_DASHBOARD_SUCCESS](state, payload) {
      state.open = payload;
    },
    [OPEN_DASHBOARD_ERROR](state) {
      state.open = null;
    }
  },
  actions: {
    [FETCH_DASHBOARDS]({ commit, dispatch }) {
      return dispatch(AUTH_API_CALL, getDashboards())
        .then((response) => {
          if (response && Array.isArray(response.data)) {
            commit(FETCH_DASHBOARDS_SUCCESS, response.data);
          }
          else {
            throw Error('Unable to parse dashboards list');
          }
        })
        .catch((error) => {
          commit(FETCH_DASHBOARDS_ERROR, error);
          throw error;
        });
    },
    [ADD_DASHBOARD]({ dispatch }, data) {
      return dispatch(AUTH_API_CALL, addDashboard(data))
        .then(() => dispatch(FETCH_DASHBOARDS))
        .catch((error) => {
          dispatch(FETCH_DASHBOARDS);
          throw error;
        });
    },
    [OPEN_DASHBOARD]({ dispatch, commit }, dashboard) {
      return dispatch(AUTH_API_CALL, getDashboard(dashboard))
        .then((response) => {
          commit(OPEN_DASHBOARD_SUCCESS, response.data);
        })
        .catch((error) => {
          commit(OPEN_DASHBOARD_ERROR, error);
          throw error;
        });
    }
  }
};
