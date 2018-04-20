<template>
  <div class="app-error">
    <div class="app-error__head">
      <slot name="head">Error</slot>
    </div>
    <div class="app-error__title">
      <slot name="title">The page you're looking for does not work.</slot>
    </div>
    <hr class="app-error__hr"/>
    <div class="app-error__message">
      <slot name="message">
        <p>Make sure the address is correct and that the page hasn't moved.</p>
        <p>Please contact your administrator if you think this is a mistake.</p>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppError'
};
</script>
<style lang="scss" scoped>
.app-error {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  text-align: center;
  margin: 0 auto;

  &__head {
    font-size: 100px;
    line-height: 164px;
    color: #456;
  }

  &__title {
    color: #456;
    font-size: 24px;
    line-height: 32px;
  }

  &__hr {
    width: 100%;
    max-width: 800px;
    margin: 18px auto;
    border: 0;
    border-top: 1px solid #EEE;
    border-bottom: 1px solid white;
  }
}
</style>
