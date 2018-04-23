<template>
  <div class="app-admin">
    <app-admin-head/>
    <router-view/>
  </div>
</template>

<script>
import AppAdminHead from './head';

export default {
  name: 'AppAdmin',
  components: {
    AppAdminHead
  }
};
</script>
