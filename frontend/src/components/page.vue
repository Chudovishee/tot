<template>
  <div class="app-page">
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'AppPage'
};
</script>
<style lang="scss" scoped>
.app-page {
  max-width: 1280px;
  padding: 24px;
  margin: 0 auto;
}
</style>
