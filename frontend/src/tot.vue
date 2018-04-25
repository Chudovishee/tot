<template>
  <div id="tot">
    <tot-login v-if="unauthorized"/>
    <template v-else>
      <tot-head/>
      <div class="tot-body">
        <router-view/>
      </div>
    </template>
  </div>
</template>

<script>
import '@/assets/styles/tot.scss';

import TotLogin from '@/pages/login';
import TotHead from '@/pages/head';

export default {
  name: 'Tot',
  components: {
    TotLogin,
    TotHead
  },
  computed: {
    unauthorized() {
      return !this.$store.state.users.current;
    }
  }
};
</script>

<style lang="scss" scoped>
#tot {
  height: 100%;
}
.tot-head {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
.tot-body {
  padding-top: 61px;
  height: 100%;
}
</style>
