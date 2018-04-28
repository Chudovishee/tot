import Vue from 'vue';
import { AUTH_API_CALL } from '@/store/users';

import {
  getDashboards,
  addDashboard,
  editDashboard,
  getDashboard
} from './api';

export const FETCH_DASHBOARDS = 'FETCH_DASHBOARDS';
export const ADD_DASHBOARD = 'ADD_DASHBOARD';
export const FETCH_DASHBOARD = 'FETCH_DASHBOARD';
export const EDIT_DASHBOARD = 'EDIT_DASHBOARD';

export const FETCH_DASHBOARDS_SUCCESS = 'FETCH_DASHBOARDS_SUCCESS';
export const FETCH_DASHBOARDS_ERROR = 'FETCH_DASHBOARDS_ERROR';
export const FETCH_DASHBOARD_SUCCESS = 'FETCH_DASHBOARD_SUCCESS';
export const FETCH_DASHBOARD_ERROR = 'FETCH_DASHBOARD_ERROR';

export default {
  state: {
    list: [],
    open: {}
  },
  mutations: {
    [FETCH_DASHBOARDS_SUCCESS](state, payload) {
      state.list = payload;
    },
    [FETCH_DASHBOARDS_ERROR](state) {
      state.list = [];
    },
    [FETCH_DASHBOARD_SUCCESS](state, { name, data }) {
      Vue.set(state.open, name, data);
    },
    [FETCH_DASHBOARD_ERROR](state, { name }) {
      Vue.set(state.open, name, null);
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
    [FETCH_DASHBOARD]({ dispatch, commit }, name) {
      return dispatch(AUTH_API_CALL, getDashboard(name))
        .then((response) => {
          commit(FETCH_DASHBOARD_SUCCESS, {
            name,
            data: response.data
          });
        })
        .catch((error) => {
          commit(FETCH_DASHBOARD_ERROR, { name, error });
          throw error;
        });
    },
    [EDIT_DASHBOARD]({ dispatch }, { name, data }) {
      const newName = (data.name && name !== data.name) ? data.name : name;
      return dispatch(AUTH_API_CALL, editDashboard(name, data))
        .then(() => dispatch(FETCH_DASHBOARDS))
        .then(() => dispatch(FETCH_DASHBOARD, newName))
        .catch((error) => {
          dispatch(FETCH_DASHBOARD, newName);
          throw error;
        });
    }
  }
};
