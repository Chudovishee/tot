<template>
  <el-dialog
    class="tot-dashboards-edit"
    :title="dashboard ? 'Edit dashboard' : 'Add dashboard'"
    :visible="visible"
    @update:visible="updateVisible"
    @open="clear">

    <el-form
      :model="dashboardForm"
      :rules="rules"
      ref="dashboardForm"
      label-width="120px"
      class="tot-dashboards-add__form">

      <el-form-item label="Name" prop="name" :error="errors.name">
        <el-input v-model="dashboardForm.name"/>
      </el-form-item>

      <el-form-item label="Description" prop="description" :error="errors.description">
        <el-input v-model="dashboardForm.description"/>
      </el-form-item>

      <el-form-item :error="otherErrors">
        <el-button type="primary" @click="saveDashboard">Save</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>
<script>
import FormErrors from '@/mixins/formErrors';

import {
  ADD_DASHBOARD,
  EDIT_DASHBOARD
} from '@/store/dashboards';

export default {
  name: 'TotDashboardsEdit',
  mixins: [FormErrors],
  props: {
    visible: Boolean,
    dashboard: {
      type: String,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      dashboardForm: {
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
  computed: {
    editDashboard() {
      return this.$store.state.dashboards.open[this.dashboard];
    }
  },
  methods: {
    clear() {
      if (!this.editDashboard) {
        this.dashboardForm.name = '';
        this.dashboardForm.description = '';
      }
      else {
        this.dashboardForm.name = this.editDashboard.name;
        this.dashboardForm.description = this.editDashboard.description;
      }
      this.clearErrors();
    },
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    saveDashboard() {
      this.clearErrors();
      this.$refs.dashboardForm.validate((valid) => {
        let request;
        if (valid) {
          if (this.dashboard) {
            request = this.$store.dispatch(EDIT_DASHBOARD, {
              name: this.dashboard,
              data: this.dashboardForm
            });
          }
          else {
            request = this.$store.dispatch(ADD_DASHBOARD, this.dashboardForm);
          }

          request
            .then(() => {
              this.$emit('update:visible', false);
              if (!this.dashboard || this.dashboard !== this.dashboardForm.name) {
                this.$router.push({ name: 'dashboards', params: { dashboard: this.dashboardForm.name } });
              }
            })
            .catch(error => this.handleError(error.response));
        }
      });
    }
  }
};
</script>
