<template>
  <app-page class="app-admin-users">
    <app-admin-add-user/>
    <app-admin-users-list/>
  </app-page>
</template>

<script>
import AppPage from '@/components/page';
import AppAdminAddUser from './add';
import AppAdminUsersList from './list';

export default {
  name: 'AppAdminUsers',
  components: {
    AppAdminAddUser,
    AppPage,
    AppAdminUsersList
  }
};
</script>

<style lang="scss" scoped>
.app-admin-users {
  /deep/ .el-card {
    &:not(:last-child) {
      margin-bottom: 24px;
    }
  }
}
</style>
