<template>
  <div class="tot-dashboard">
    <template v-if="dashboardData">
      <div class="tot-dashboard__head">
        <div class="tot-dashboard__name">{{ dashboardData.name }}</div>
        <div v-if="dashboardData.description" class="tot-dashboard__description">
          {{ dashboardData.description }}
        </div>
        <i class="el-icon-edit"/>
      </div>

      <grid-layout
        class="tot-dashboard__grid"
        :layout="grid"
        :col-num="8"
        :row-height="128"
        :is-draggable="true"
        :is-resizable="true"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[16, 16]"
        :use-css-transforms="true">

        <grid-item v-for="item in grid"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i">

          <el-card>{{item.i}}</el-card>
        </grid-item>
      </grid-layout>
    </template>
  </div>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout';

import { OPEN_DASHBOARD } from '@/store/dashboards';

export default {
  name: 'TotDashboardsGrid',
  components: {
    GridLayout,
    GridItem
  },
  props: {
    dashboard: String
  },
  data() {
    return {
      grid: [
        { i: '0', x: 0, y: 0, w: 4, h: 2 },
        { i: '1', x: 1, y: 0, w: 4, h: 2 }
      ]
    };
  },
  mounted() {
    this.openDashboard();
  },
  computed: {
    dashboardData() {
      return this.$store.state.dashboards.open;
    }
  },
  watch: {
    dashboard() {
      this.openDashboard();
    }
  },
  methods: {
    openDashboard() {
      if (this.dashboard) {
        this.$store.dispatch(OPEN_DASHBOARD, this.dashboard);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tot-dashboard {
  /deep/ .el-card {
    width: 100%;
    height: 100%;
  }
  /deep/ .vue-grid-placeholder {
    background: #ccc;
  }

  &__head {
    margin: 16px 16px 0 16px;
  }

  &__name {
    display: inline-block;
    color: #303133;
    font-size: 24px;
    line-height: 32px;
    margin-right: 8px;
  }

  &__description {
    display: inline-block;
    color: #909399;
    line-height: 32px;
    margin-right: 8px;
  }
}
</style>
