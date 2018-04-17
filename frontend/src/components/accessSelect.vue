<template>
  <el-select
    :value="value"
    @input="input"
    placeholder="Select access level">
    <el-option
      v-for="level in accessLevels"
      :key="level.value"
      :label="level.label"
      :value="level.value">
    </el-option>
  </el-select>
</template>
<script>
import {
  SECURE_USER,
  SECURE_CONFIGURE,
  SECURE_ADMIN
} from '@/store/users';

export default {
  name: 'AppAccessSelect',
  props: {
    value: Number
  },
  data() {
    return {
      accessLevels: [
        { value: SECURE_USER, label: 'Read access' },
        { value: SECURE_CONFIGURE, label: 'Configure access' },
        { value: SECURE_ADMIN, label: 'Administrator access' }
      ]
    };
  },
  methods: {
    input(value) {
      this.$emit('input', value);
    }
  }
};
</script>
