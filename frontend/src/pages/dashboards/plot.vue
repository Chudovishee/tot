<template>
  <el-card class="tot-dashboard-plot">
    <div class="tot-dashboard-plot__head">
      <el-button
        type="text"
        icon="el-icon-edit"/>
      <el-button
        type="text"
        icon="el-icon-delete"/>
    </div>

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
  height: 100%;

  /deep/ {
    .el-card__body {
      padding: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .tot-plot {
      flex: 1 0 0;
      overflow: hidden;
    }
  }

  &__head {
    text-align: right;
    padding: 0 3px;

    /deep/ .el-button {
      padding: 0;
    }
  }
}
</style>
