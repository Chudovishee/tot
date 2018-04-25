<template>
  <div class="tot-dashboards">
    <tot-dashboards-head
      v-if="firstDashboard"
      @addDashboard="addDashboard"/>

    <tot-dashboards-empty
      v-if="!firstDashboard"
      @addDashboard="addDashboard"/>

    <tot-dashboards-add :visible.sync="addDialogVisible"/>
  </div>
</template>

<script>
import { FETCH_DASHBOARDS } from '@/store/dashboards';
import store from '@/store';

import TotDashboardsHead from './head';
import TotDashboardsEmpty from './empty';
import TotDashboardsAdd from './add';

export default {
  name: 'TotDashboards',
  components: {
    TotDashboardsHead,
    TotDashboardsEmpty,
    TotDashboardsAdd
  },
  data() {
    return {
      addDialogVisible: false
    };
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch(FETCH_DASHBOARDS)
      .then(() => {
        next((vm) => {
          if (vm.firstDashboard) {
            vm.$router.push({ name: 'dashboards', params: { dashboard: vm.firstDashboard.name } });
          }
        });
      });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.dashboard === undefined && this.firstDashboard) {
      next({ name: 'dashboards', params: { dashboard: this.firstDashboard.name } });
    }
    else {
      next();
    }
  },
  computed: {
    firstDashboard() {
      return this.$store.state.dashboards.list[0];
    }
  },
  methods: {
    addDashboard() {
      this.addDialogVisible = true;
    }
  }
};
</script>
