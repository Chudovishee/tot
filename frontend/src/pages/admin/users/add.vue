<template>
  <el-card class="tot-admin-add-user">
    <div slot="header">
      Add new user
    </div>

    <el-form
      :model="addUserForm"
      :rules="rules"
      ref="addUserForm"
      label-width="120px"
      class="tot-admin-add-user__form">

      <el-form-item label="Name" prop="name" :error="errors.name">
        <el-input v-model="addUserForm.name"/>
      </el-form-item>

      <el-form-item label="Password" prop="password" :error="errors.password">
        <el-input type="password" v-model="addUserForm.password" auto-complete="off"/>
      </el-form-item>

      <el-form-item label="Access level" prop="access" :error="errors.access">
        <tot-access-select v-model="addUserForm.access"/>
      </el-form-item>

      <el-form-item :error="otherErrors">
        <el-button type="primary" @click="addUser">Add</el-button>
      </el-form-item>

    </el-form>
  </el-card>
</template>

<script>
import {
  SECURE_USER,
  ADD_USER
} from '@/store/users';
import TotAccessSelect from '@/components/accessSelect';
import FormErrors from '@/mixins/formErrors';

export default {
  name: 'TotAdminAddUser',
  mixins: [FormErrors],
  components: {
    TotAccessSelect
  },
  data() {
    return {
      addUserForm: {
        name: '',
        password: '',
        access: SECURE_USER
      },
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
      }
    };
  },
  methods: {
    addUser() {
      this.clearErrors();
      this.$refs.addUserForm.validate((valid) => {
        if (valid) {
          this.$store.dispatch(ADD_USER, this.addUserForm)
            .catch(error => this.handleError(error.response));
        }
      });
    }
  }
};
</script>
