<template>
  <tot-error class="tot-dashboard-empty">
    <template slot="head">
      <i class="el-icon-warning"/>
    </template>
    <template slot="title">Dashboard is empty.</template>

    <template
      v-if="$store.getters.isConfigure"
      slot="message">
      <el-button type="text" @click="create">Create new plot</el-button>
    </template>

    <template
      v-else
      slot="message">
      <p>Please contact your administrator or configurator for create new plot</p>
    </template>
  </tot-error>
</template>

<script>
import TotPage from '@/components/page';
import TotError from '@/components/error';

export default {
  name: 'TotDashboardEmpty',
  components: {
    TotPage,
    TotError
  },
  methods: {
    create() {
      this.$emit('addPlot');
    }
  }
};
</script>
