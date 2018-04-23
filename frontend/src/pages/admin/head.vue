<template>
  <app-navigation class="app-admin-head" :level="1">

    <el-menu-item index="users">Users</el-menu-item>
  </app-navigation>
</template>

<script>
import AppNavigation from '@/components/navigation';

export default {
  name: 'AppAdminHead',
  components: {
    AppNavigation
  }
};
</script>
