<template>
  <div class="app-dashboards">
    <app-dashboards-head/>
  </div>
</template>

<script>
import { FETCH_DASHBOARDS } from '@/store/dashboards';
import store from '@/store';

import AppDashboardsHead from './head';

export default {
  name: 'AppDashboards',
  components: {
    AppDashboardsHead
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch(FETCH_DASHBOARDS)
      .then(() => {
        next((vm) => {
          vm.$router.push({ name: 'dashboards', params: { dashboard: vm.firstDashboard.id } });
        });
      });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.dashboard === undefined) {
      next({ name: 'dashboards', params: { dashboard: this.firstDashboard.id } });
    }
    else {
      next();
    }
  },
  computed: {
    firstDashboard() {
      return this.$store.state.dashboards.list[0];
    }
  }
};
</script>
