<template>
  <el-dialog
    class="tot-dashboards-add"
    title="Add dashboard"
    :visible="visible"
    @update:visible="updateVisible"
    @open="clear">

    <el-form
      :model="addDashboardForm"
      :rules="rules"
      ref="addDashboardForm"
      label-width="120px"
      class="tot-dashboards-add__form">

      <el-form-item label="Name" prop="name" :error="errors.name">
        <el-input v-model="addDashboardForm.name"/>
      </el-form-item>

      <el-form-item label="Description" prop="description" :error="errors.description">
        <el-input v-model="addDashboardForm.description"/>
      </el-form-item>

      <el-form-item :error="otherErrors">
        <el-button type="primary" @click="addDashboard">Add</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>
<script>
import FormErrors from '@/mixins/formErrors';

export default {
  name: 'TotDashboardsAdd',
  mixins: [FormErrors],
  props: {
    visible: Boolean
  },
  data() {
    return {
      addDashboardForm: {
        name: '',
        description: ''
      },
      rules: {
        name: {
          required: true,
          pattern: /^[\w]{1,20}$/,
          message: 'Dashboard name must be string with 1-20 characters'
        },
        description: {
          pattern: /^[\w ]{0,64}$/,
          message: 'Dashboard description must be string with 0-64 characters'
        }
      },
      errors: {
        name: null,
        description: null
      }
    };
  },
  methods: {
    clear() {
      this.addDashboardForm.name = '';
      this.addDashboardForm.description = '';
      this.clearErrors();
    },
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    addDashboard() {
      this.clearErrors();
      this.$refs.addDashboardForm.validate((valid) => {
        if (valid) {
          // this.$store.dispatch(ADD_USER, this.addUserForm)
          //   .catch(error => this.handleError(error.response));
        }
      });
    }
  }
};
</script>
