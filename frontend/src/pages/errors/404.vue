<template>
  <app-error class="app-error-404">
    <template slot="head">404</template>
    <template slot="title">The page you're looking for could not be found.</template>
  </app-error>
</template>

<script>
import AppError from '@/components/error';

export default {
  name: 'AppError404',
  components: {
    AppError
  }
};
</script>
