import {
  getCurrentUser,
  login,
  logout
} from './api';

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const FETCH_CURRENT_USER_SUCCESS = 'FETCH_CURRENT_USER_SUCCESS';
export const FETCH_CURRENT_USER_ERROR = 'FETCH_CURRENT_USER_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';

export default {
  state: {
    current: null
  },
  mutations: {
    [FETCH_CURRENT_USER_SUCCESS](state, payload) {
      state.current = payload;
    },
    [FETCH_CURRENT_USER_ERROR](state) {
      state.current = null;
    },
    [LOGOUT_SUCCESS](state) {
      state.current = null;
    },
    [LOGOUT_ERROR](state) {
      state.current = null;
    }
  },
  actions: {
    [FETCH_CURRENT_USER]({ commit }) {
      return getCurrentUser()
        .then((response) => {
          commit(FETCH_CURRENT_USER_SUCCESS, response);
        })
        .catch((error) => {
          commit(FETCH_CURRENT_USER_ERROR, error);
          throw error;
        });
    },
    [LOGIN]({ dispatch }, { name, password }) {
      return login(name, password)
        .then(() => dispatch(FETCH_CURRENT_USER));
    },
    [LOGOUT]({ commit }) {
      return logout()
        .then(() => {
          commit(LOGOUT_SUCCESS);
        })
        .catch((error) => {
          commit(LOGOUT_ERROR);
          throw error;
        });
    }
  }
};
