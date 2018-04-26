import { pick } from 'lodash';
import {
  getCurrentUser,
  getUsers,
  login,
  logout,
  addUser,
  deleteUser,
  editUser
} from './api';

export const AUTH_API_CALL = 'AUTH_API_CALL';

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const ADD_USER = 'ADD_USER';
export const FETCH_USERS = 'FETCH_USERS';
export const DELETE_USER = 'DELETE_USER';
export const EDIT_USER = 'EDIT_USER';

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
  getters: {
    accessLevel(state) {
      return (state.current && state.current.access) || SECURE_ALL;
    },
    isAdmin(state) {
      return state.current && state.current.access >= SECURE_ADMIN;
    },
    isConfigure(state) {
      return state.current && state.current.access >= SECURE_CONFIGURE;
    },
    isUser(state) {
      return state.current && state.current.access >= SECURE_USER;
    }
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
    [AUTH_API_CALL]({ commit }, apiCall) {
      return apiCall.catch((error) => {
        if (error.response.status === 401) {
          commit(LOGOUT_SUCCESS);
        }
        throw error;
      });
    },
    [FETCH_CURRENT_USER]({ commit }) {
      return getCurrentUser()
        .then((response) => {
          commit(FETCH_CURRENT_USER_SUCCESS, response.data);
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
      return dispatch(AUTH_API_CALL, addUser(data))
        .then(() => dispatch(FETCH_USERS))
        .catch((error) => {
          dispatch(FETCH_USERS);
          throw error;
        });
    },
    [FETCH_USERS]({ commit, dispatch }) {
      return dispatch(AUTH_API_CALL, getUsers())
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
      return dispatch(AUTH_API_CALL, deleteUser(name))
        .then(() => dispatch(FETCH_USERS))
        .catch((error) => {
          dispatch(FETCH_USERS);
          throw error;
        });
    },
    [EDIT_USER]({ dispatch }, user) {
      return dispatch(AUTH_API_CALL, editUser(user.name, pick(user, ['password', 'access'])))
        .then(() => dispatch(FETCH_USERS))
        .catch((error) => {
          dispatch(FETCH_USERS);
          throw error;
        });
    }
  }
};
