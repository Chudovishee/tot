import Vue from 'vue';
import { map, each } from 'lodash';

import { AUTH_API_CALL } from '@/store/users';

import {
  getAvailableStat,
  getStat
} from './api';

export const FETCH_STAT_PACK = 'FETCH_STAT_PACK';
export const FETCH_STAT_AVAILABLE = 'FETCH_STAT_AVAILABLE';

export const FETCH_STAT_SUCCESS = 'FETCH_STAT_SUCCESS';
export const FETCH_STAT_ERROR = 'FETCH_STAT_ERROR';
export const FETCH_STAT_AVAILABLE_SUCCESS = 'FETCH_STAT_AVAILABLE_SUCCESS';
export const FETCH_STAT_AVAILABLE_ERROR = 'FETCH_STAT_AVAILABLE_ERROR';

export default {
  state: {
    available: [],
    values: {},
  },
  mutations: {
    [FETCH_STAT_AVAILABLE_SUCCESS](state, list) {
      state.available = list;
    },
    [FETCH_STAT_AVAILABLE_ERROR](state) {
      state.available = [];
    },
    [FETCH_STAT_SUCCESS](state, { name, data, start, end }) {
      Vue.set(state.values, name, {
        start,
        end,
        data,
        error: null,
        status: 'success'
      });
    },
    [FETCH_STAT_ERROR](state, { name, error, start, end }) {
      Vue.set(state.values, name, {
        start,
        end,
        data: null,
        error,
        status: 'error'
      });
    }
  },
  actions: {
    [FETCH_STAT_AVAILABLE]({ commit, dispatch }) {
      return dispatch(AUTH_API_CALL, getAvailableStat())
        .then((response) => {
          commit(FETCH_STAT_AVAILABLE_SUCCESS, response.data);
          return response;
        })
        .catch((error) => {
          commit(FETCH_STAT_AVAILABLE_ERROR, error);
          throw error;
        });
    },
    [FETCH_STAT_PACK]({ commit, dispatch }, { pack, start, end }) {
      dispatch(AUTH_API_CALL, Promise.all(map(pack, name => getStat(name, start, end))))
        .then((responses) => {
          each(pack, (name, index) => {
            commit(FETCH_STAT_SUCCESS, { data: responses[index], name, start, end });
          });

          return responses;
        })
        .catch((error) => {
          const queryError = error.data ? error.data : { status: error.statusText };

          each(pack, (name) => {
            commit(FETCH_STAT_ERROR, { error: queryError, name, start, end });
          });

          throw error;
        });
    }
  }
};
