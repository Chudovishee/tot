<template>
  <div id="app">
    <app-login/>
    <router-view/>
  </div>
</template>

<script>
import '@/assets/styles/app.scss';

import AppLogin from '@/pages/login';

export default {
  name: 'App',
  components: {
    AppLogin
  }
};
</script>

<style>
#app {
  height: 100%;
}
</style>
