<template>
  <div id="app">
    <app-login v-if="unauthorized"/>
    <template v-else>
      <app-head/>
      <div class="app-body">
        <router-view/>
      </div>
    </template>
  </div>
</template>

<script>
import '@/assets/styles/app.scss';

import AppLogin from '@/pages/login';
import AppHead from '@/pages/head';

export default {
  name: 'App',
  components: {
    AppLogin,
    AppHead
  },
  computed: {
    unauthorized() {
      return !this.$store.state.users.current;
    }
  }
};
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}
.app-head {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
.app-body {
  padding-top: 61px;
}
</style>
