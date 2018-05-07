<template>
  <el-card class="tot-dashboard-plot">
    <tot-plot ref="plot"/>
  </el-card>
</template>

<script>
import TotPlot from '@/components/plot';

export default {
  name: 'TotDashboardPlot',
  components: {
    TotPlot
  },
  data() {
    return {
    };
  },
  props: {
    item: Object
  },
  methods: {
    resize() {
      this.$refs.plot.resize();
    }
  }
};
</script>

<style lang="scss" scoped>
.tot-dashboard-plot {
  width: 100%;
  height: 100%;

  /deep/ {
    .el-card__body,
    .tot-plot {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
