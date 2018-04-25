<template>
  <tot-page class="tot-admin-users">
    <tot-admin-add-user/>
    <tot-admin-users-list/>
  </tot-page>
</template>

<script>
import TotPage from '@/components/page';
import TotAdminAddUser from './add';
import TotAdminUsersList from './list';

export default {
  name: 'TotAdminUsers',
  components: {
    TotAdminAddUser,
    TotPage,
    TotAdminUsersList
  }
};
</script>

<style lang="scss" scoped>
.tot-admin-users {
  /deep/ .el-card {
    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }
}
</style>
