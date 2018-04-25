<template>
  <tot-error class="tot-error-404">
    <template slot="head">404</template>
    <template slot="title">The page you're looking for could not be found.</template>
  </tot-error>
</template>

<script>
import TotError from '@/components/error';

export default {
  name: 'TotError404',
  components: {
    TotError
  }
};
</script>
