<template>
  <grid-item
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :i="item.i">
    <el-card>{{item.i}}</el-card>
  </grid-item>
</template>

<script>
import { GridItem } from 'vue-grid-layout';

export default {
  name: 'TotDashboardPlot',
  components: {
    GridItem
  },
  props: {
    item: Object
  }
};
</script>
