import {
  getCurrentUser,
  getUsers,
  login,
  logout,
  addUser,
  deleteUser
} from './api';

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const ADD_USER = 'ADD_USER';
export const FETCH_USERS = 'FETCH_USERS';
export const DELETE_USER = 'DELETE_USER';

export const FETCH_CURRENT_USER_SUCCESS = 'FETCH_CURRENT_USER_SUCCESS';
export const FETCH_CURRENT_USER_ERROR = 'FETCH_CURRENT_USER_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_ERROR = 'FETCH_USERS_ERROR';

export const SECURE_ALL = 0;
export const SECURE_USER = 1;
export const SECURE_CONFIGURE = 2;
export const SECURE_ADMIN = 3;

export default {
  state: {
    current: null,
    list: [],
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
    },
    [FETCH_USERS_SUCCESS](state, payload) {
      state.list = payload;
    },
    [FETCH_USERS_ERROR](state) {
      state.list = [];
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
    },
    [ADD_USER]({ dispatch }, data) {
      return addUser(data)
        .then(() => {
          dispatch(FETCH_USERS);
        })
        .catch((error) => {
          dispatch(FETCH_USERS);
          throw error;
        });
    },
    [FETCH_USERS]({ commit }) {
      return getUsers()
        .then((response) => {
          if (response && Array.isArray(response.data)) {
            commit(FETCH_USERS_SUCCESS, response.data);
          }
          else {
            throw Error('Unable to parse users list');
          }
        })
        .catch((error) => {
          commit(FETCH_USERS_ERROR, error);
          throw error;
        });
    },
    [DELETE_USER]({ dispatch }, name) {
      return deleteUser(name)
        .then(() => {
          dispatch(FETCH_USERS);
        })
        .catch((error) => {
          dispatch(FETCH_USERS);
          throw error;
        });
    }
  }
};
