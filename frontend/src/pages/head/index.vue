<template>
  <app-navigation class="app-head"
    :level="0"
    @select="select">

    <el-menu-item index="1">Processing Center</el-menu-item>
    <el-menu-item index="3">Info</el-menu-item>
    <el-menu-item index="admin">Administration</el-menu-item>
    <el-menu-item index="logout">Log out</el-menu-item>
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
    select(index) {
      if (index === 'logout') {
        this.$store.dispatch(LOGOUT);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
