import { addUser } from './api';

export const ADD_USER = 'ADD_USER';

export const SECURE_ALL = 0;
export const SECURE_USER = 1;
export const SECURE_CONFIGURE = 2;
export const SECURE_ADMIN = 3;

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    [ADD_USER](store, data) {
      return addUser(data);
    }
  }
};
