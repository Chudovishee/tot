<template>
  <div class="tot-admin">
    <tot-admin-head/>
    <router-view/>
  </div>
</template>

<script>
import TotAdminHead from './head';

export default {
  name: 'TotAdmin',
  components: {
    TotAdminHead
  }
};
</script>
