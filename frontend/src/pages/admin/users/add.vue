<template>
  <el-card class="app-admin-add-user">
    <div slot="header">
      Add new user
    </div>

    <el-form
      :model="addUserForm"
      :rules="rules"
      ref="addUserForm"
      label-width="120px"
      class="app-admin-add-user__form">

      <el-form-item label="Name" prop="name" :error="errors.name">
        <el-input v-model="addUserForm.name"/>
      </el-form-item>

      <el-form-item label="Password" prop="password" :error="errors.password">
        <el-input type="password" v-model="addUserForm.password" auto-complete="off"/>
      </el-form-item>

      <el-form-item label="Access level" prop="access" :error="errors.access">
         <el-select v-model="addUserForm.access" placeholder="Select access level">
          <el-option
            v-for="level in accessLevels"
            :key="level.value"
            :label="level.label"
            :value="level.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item :error="otherErrors">
        <el-button type="primary" @click="addUser">Add</el-button>
      </el-form-item>

    </el-form>
  </el-card>
</template>

<script>
import { each } from 'lodash';
import {
  SECURE_USER,
  SECURE_CONFIGURE,
  SECURE_ADMIN,
  ADD_USER
} from '@/store/users';

export default {
  name: 'AppAdminAddUser',
  data() {
    return {
      addUserForm: {
        name: '',
        password: '',
        access: SECURE_USER
      },
      accessLevels: [
        { value: SECURE_USER, label: 'Read access' },
        { value: SECURE_CONFIGURE, label: 'Configure access' },
        { value: SECURE_ADMIN, label: 'Administrator access' }
      ],
      rules: {
        name: {
          required: true,
          pattern: /^[\w]{4,20}$/,
          message: 'User name must be string with 4-20 characters'
        },
        password: {
          required: true
        }
      },
      errors: {
        name: null,
        password: null,
        access: null
      },
      otherErrors: null
    };
  },
  methods: {
    addUser() {
      this.clearErrors();
      this.$refs.addUserForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch(ADD_USER, this.addUserForm)
            .catch(error => this.handleError(error));
        }
      });
    },
    clearErrors() {
      each(this.errors, (value, field) => {
        this.errors[field] = null;
      });
      this.otherErrors = null;
    },
    handleError(error) {
      let other = [];
      if (error.response && error.response.data) {
        each(error.response.data, (errors, field) => {
          if (this.errors[field] !== undefined) {
            this.errors[field] = errors.join('; ');
          }
          else {
            other = other.concat(errors);
          }
        });
        if (other.length) {
          this.otherErrors = other.join('; ');
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>

.app-admin-add-user {
}
</style>
