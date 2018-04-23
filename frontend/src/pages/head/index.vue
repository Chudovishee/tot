<template>
  <app-navigation class="app-head"
    :level="0"
    @navigate="navigate">

    <el-menu-item
      v-if="$store.getters.isUser"
      index="dashboards">
      Dashboards
    </el-menu-item>
    <el-menu-item
      v-if="$store.getters.isAdmin"
      index="admin">
      Administration
    </el-menu-item>
    <el-menu-item index="logout" no-route>Log out</el-menu-item>
  </app-navigation>
</template>

<script>
import AppNavigation from '@/components/navigation';
import { LOGOUT } from '@/store/users';

export default {
  name: 'AppHead',
  components: {
    AppNavigation
  },
  methods: {
    navigate(index) {
      if (index === 'logout') {
        this.$store.dispatch(LOGOUT);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
