<template>
  <app-level-menu
    class="app-dashboards-head"
    ref="navigation"
    :level="1"
    @select="navigation">
    <el-menu-item
      v-for="dashboard in dashboards"
      :key="dashboard.id"
      :index="'dashboard-' + dashboard.id"
      :title="dashboard.description">
      {{ dashboard.name }}
    </el-menu-item>

    <el-menu-item index="add-dashboard">
      <i class="el-icon-circle-plus"/>
    </el-menu-item>
  </app-level-menu>
</template>

<script>
import AppLevelMenu from '@/components/levelMenu';

export default {
  name: 'AppDashboardsHead',
  components: {
    AppLevelMenu
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
        console.log(name);
      }
      else {
        this.$router.push({ name: 'dashboards', params: { dashboard: name.substr(('dashboard-').length) } });
      }
    },
    updateActiveIndex() {
      this.$refs.navigation.activeIndex = 'dashboard-' + this.$route.params.dashboard;
    }
  },
  watch: {
    $route() {
      this.updateActiveIndex();
    }
  }
};
</script>
