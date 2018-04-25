<template>
  <tot-navigation class="tot-admin-head" :level="1">

    <el-menu-item index="users">Users</el-menu-item>
  </tot-navigation>
</template>

<script>
import TotNavigation from '@/components/navigation';

export default {
  name: 'TotAdminHead',
  components: {
    TotNavigation
  }
};
</script>
