<template>
  <div class="app-admin-edit-user">
    <el-form
      :model="editUserForm"
      label-width="120px"
      class="app-admin-edit-user__form">

      <el-form-item label="Password" prop="password" :error="errors.password">
        <el-input type="password" v-model="editUserForm.password" auto-complete="off"/>
      </el-form-item>

      <el-form-item label="Access level" prop="access" :error="errors.access">
        <app-access-select v-model="editUserForm.access"/>
      </el-form-item>

      <el-form-item :error="otherErrors">
        <el-button type="primary" @click="saveUser">Save</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import AppAccessSelect from '@/components/accessSelect';
import FormErrors from '@/mixins/formErrors';
import {
  EDIT_USER
} from '@/store/users';

export default {
  name: 'AppAdminEditUser',
  mixins: [FormErrors],
  components: {
    AppAccessSelect
  },
  props: {
    value: Object
  },
  data() {
    return {
      editUserForm: {
        access: this.value.access,
        password: ''
      },
      errors: {
        password: null,
        access: null
      },
      otherErrors: null
    };
  },
  methods: {
    saveUser() {
      this.clearErrors();
      this.$store.dispatch(EDIT_USER, { name: this.value.name, ...this.editUserForm })
        .catch(error => this.handleError(error.response));
    }
  },
  watch: {
    value(value) {
      this.editUserForm.access = value.access;
      this.editUserForm.password = '';
    }
  }
};
</script>
