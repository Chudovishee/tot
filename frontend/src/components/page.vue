<template>
  <div class="tot-page">
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'TotPage'
};
</script>
<style lang="scss" scoped>
.tot-page {
  max-width: 1280px;
  padding: 24px;
  margin: 0 auto;
}
</style>
