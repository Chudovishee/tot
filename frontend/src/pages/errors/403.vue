<template>
  <tot-error class="tot-error-403">
    <template slot="head">403</template>
    <template slot="title">The page you're looking for is unavailable for you.</template>
    <template slot="message">
      <p>Make sure the address is correct and that the page hasn't moved.</p>
      <p>Try to log out and log in again.</p>
        <p>Please contact your administrator if you think this is a mistake.</p>
    </template>
  </tot-error>
</template>

<script>
import TotError from '@/components/error';

export default {
  name: 'TotError403',
  components: {
    TotError
  }
};
</script>
