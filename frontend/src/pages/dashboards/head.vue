<template>
  <tot-level-menu
    class="tot-dashboards-head"
    ref="navigation"
    :level="1"
    @select="navigation">
    <el-menu-item
      v-for="dashboard in dashboards"
      :key="dashboard.name"
      :index="'dashboard-' + dashboard.name"
      :title="dashboard.description">
      {{ dashboard.name }}
    </el-menu-item>

    <el-menu-item
      v-if="$store.getters.isConfigure"
      index="add-dashboard">
      <i class="el-icon-circle-plus"/>New
    </el-menu-item>
  </tot-level-menu>
</template>

<script>
import TotLevelMenu from '@/components/levelMenu';

export default {
  name: 'TotDashboardsHead',
  components: {
    TotLevelMenu
  },
  mounted() {
    this.updateActiveIndex();
  },
  computed: {
    dashboards() {
      return this.$store.state.dashboards.list;
    }
  },
  methods: {
    navigation(name) {
      if (name === 'add-dashboard') {
        this.$emit('addDashboard');
      }
      else {
        this.$router.push({ name: 'dashboards', params: { dashboard: name.substr(('dashboard-').length) } });
      }
    },
    updateActiveIndex() {
      this.$refs.navigation.activeIndex = `dashboard-${this.$route.params.dashboard}`;
    },
  },
  watch: {
    $route() {
      this.updateActiveIndex();
    }
  }
};
</script>
