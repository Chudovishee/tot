<template>
  <tot-error class="tot-dashboards-empty">
    <template slot="head">
      <i class="el-icon-warning"/>
    </template>
    <template slot="title">Dashboards not found.</template>
    <template slot="message">
      <el-button type="text" @click="create">Create new dashboard</el-button>
    </template>
  </tot-error>
</template>

<script>
import TotPage from '@/components/page';
import TotError from '@/components/error';

export default {
  name: 'TotDashboardsEmpty',
  components: {
    TotPage,
    TotError
  },
  methods: {
    create() {
      this.$emit('addDashboard');
    }
  }
};
</script>
