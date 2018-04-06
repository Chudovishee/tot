<template>
  <app-page class="app-admin-users">
    <app-admin-add-user/>
    Admin users
  </app-page>
</template>

<script>
import AppPage from '@/components/page';
import AppAdminAddUser from './add';

export default {
  name: 'AppAdminUsers',
  components: {
    AppAdminAddUser,
    AppPage
  }
};
</script>

<style lang="scss" scoped>
.app-admin-users {
}
</style>
