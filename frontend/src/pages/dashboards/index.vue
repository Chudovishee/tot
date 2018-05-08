<template>
  <div class="tot-dashboards">
    <tot-dashboards-head
      v-if="firstDashboard"
      @addDashboard="openAddDashboard"/>

    <tot-dashboards-empty
      v-if="!firstDashboard"
      @addDashboard="openAddDashboard"/>

    <tot-dashboard
      v-if="firstDashboard && $route.params.dashboard"
      :dashboard="$route.params.dashboard"
      @editDashboard="openEditDashboard"
      @removeDashboard="removeDashboard"/>

    <tot-dashboards-edit
      :dashboard="editDashboard"
      :visible.sync="editVisible"/>
  </div>
</template>

<script>
import {
  FETCH_DASHBOARDS,
  FETCH_DASHBOARD,
  REMOVE_DASHBOARD
} from '@/store/dashboards';
import store from '@/store';

import TotDashboardsHead from './head';
import TotDashboardsEmpty from './empty';
import TotDashboardsEdit from './edit';
import TotDashboard from './dashboard';

export default {
  name: 'TotDashboards',
  components: {
    TotDashboardsHead,
    TotDashboardsEmpty,
    TotDashboardsEdit,
    TotDashboard
  },
  data() {
    return {
      editVisible: false,
      editDashboard: null
    };
  },
  beforeRouteEnter(to, from, next) {
    store.dispatch(FETCH_DASHBOARDS)
      .then(() => {
        if (store.state.dashboards.list[0] && !to.params.dashboard) {
          return next({ name: 'dashboards', params: { dashboard: store.state.dashboards.list[0].name } });
        }

        if (to.params.dashboard) {
          return store.dispatch(FETCH_DASHBOARD, to.params.dashboard)
            .then(() => next());
        }

        return next();
      })
      .catch((error) => {
        next();
        throw error;
      });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.dashboard === undefined && this.firstDashboard) {
      next({ name: 'dashboards', params: { dashboard: this.firstDashboard.name } });
    }
    else {
      store.dispatch(FETCH_DASHBOARD, to.params.dashboard)
        .then(() => next())
        .catch((error) => {
          next();
          throw error;
        });
    }
  },
  computed: {
    firstDashboard() {
      return this.$store.state.dashboards.list[0];
    }
  },
  methods: {
    openAddDashboard() {
      this.editVisible = true;
      this.editDashboard = null;
    },
    openEditDashboard() {
      this.editVisible = true;
      this.editDashboard = this.$route.params.dashboard;
    },
    removeDashboard() {
      this.$store.dispatch(REMOVE_DASHBOARD, this.$route.params.dashboard)
        .then(() => this.$router.push({ name: 'dashboards' }))
        .catch((error) => {
          this.$notify.error({
            title: 'Fail to delete dashboard',
            message: error.toString()
          });
          throw error;
        });
    }
  }
};
</script>
