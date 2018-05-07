<template>
  <div class="tot-admin-edit-user">
    <el-form
      :model="editUserForm"
      label-width="120px"
      class="tot-admin-edit-user__form">

      <el-form-item label="Password" prop="password" :error="errors.password">
        <el-input type="password" v-model="editUserForm.password" auto-complete="off"/>
      </el-form-item>

      <el-form-item label="Access level" prop="access" :error="errors.access">
        <tot-access-select v-model="editUserForm.access"/>
      </el-form-item>

      <el-form-item :error="otherErrors">
        <el-button type="primary" @click="saveUser">Save</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import TotAccessSelect from '@/components/accessSelect';
import FormErrors from '@/mixins/formErrors';
import {
  EDIT_USER
} from '@/store/users';

export default {
  name: 'TotAdminEditUser',
  mixins: [FormErrors],
  components: {
    TotAccessSelect
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
        .catch(error => this.handleError(error));
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
