<template>
  <div class="tot-dashboard">
    <template v-if="dashboardData">
      <div class="tot-dashboard__head">
        <div class="tot-dashboard__title">
          <div class="tot-dashboard__name">{{ dashboardData.name }}</div>
          <div v-if="dashboardData.description" class="tot-dashboard__description">
            {{ dashboardData.description }}
          </div>
          <i class="el-icon-edit" @click="edit"/>
        </div>

        <div class="tot-dashboard__actions">
          <el-button
            type="text"
            icon="el-icon-circle-plus"
            @click="addPlot">
            Add plot
          </el-button>

          <el-button
            type="text"
            icon="el-icon-delete"
            @click="remove">
            Remove dashboard
          </el-button>
        </div>
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
        :use-css-transforms="true"
        @layout-updated="layoutUpdatedEvent">

        <grid-item v-for="item in grid"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          @resized="resized">
          <tot-dashboard-plot :item="item" ref="items"/>
        </grid-item>
      </grid-layout>
    </template>

    <tot-error
      v-else
      class="tot-dashboard-error">
      <template slot="head">
        <i class="el-icon-warning"/>
      </template>
      <template slot="title">Dashboard not found.</template>

      <template slot="message">
        Please select other dashboard or create new
      </template>
    </tot-error>
  </div>
</template>

<script>
import { GridLayout, GridItem } from 'vue-grid-layout';
import { cloneDeep, isEqual, map, pick, findIndex } from 'lodash';

import randomHex from '@/utils/randomHex';
import { EDIT_DASHBOARD } from '@/store/dashboards';
import TotError from '@/components/error';

import TotDashboardPlot from './plot';

function pickGrid(grid) {
  return map(grid, item => pick(item, ['i', 'x', 'y', 'w', 'h']));
}

export default {
  name: 'TotDashboard',
  components: {
    GridLayout,
    GridItem,
    TotDashboardPlot,
    TotError
  },
  props: {
    dashboard: String
  },
  data() {
    return {
      grid: []
    };
  },
  mounted() {
    this.grid = this.dashboardData ? cloneDeep(this.dashboardData.grid) : [];
  },
  computed: {
    dashboardData() {
      return this.$store.state.dashboards.open[this.dashboard];
    }
  },
  methods: {
    edit() {
      this.$emit('editDashboard');
    },
    remove() {
      this.$emit('removeDashboard');
    },
    layoutUpdatedEvent(grid) {      
      if (!isEqual(pickGrid(grid), pickGrid(this.dashboardData.grid))) {
        this.saveDashboard();
      }
    },
    addPlot() {
      this.grid.push({ i: randomHex(8), x: 0, y: 0, w: 8, h: 2 });
      this.saveDashboard();
    },
    saveDashboard() {
      this.$nextTick(() => {
        this.$store.dispatch(EDIT_DASHBOARD, {
          name: this.dashboard,
          data: { grid: this.grid }
        })
          .catch((error) => {
            this.$notify.error({
              title: 'Fail to save dashboard grid',
              message: error.toString()
            });
          });
      });
    },
    resized(i, h, w, hpx, wpx) {
      const index = findIndex(this.grid, { i });
      this.$refs.items[index].resize();
    }
  },
  watch: {
    dashboardData(data) {
      this.grid = data ? cloneDeep(data.grid) : [];
    }
  }
};
</script>

<style lang="scss" scoped>
.tot-dashboard {
  /deep/ {
    .el-card {
      width: 100%;
      height: 100%;
    }

    .vue-grid-placeholder {
      background: #ccc;
    }

    .el-icon-edit {
      cursor: pointer;
    }
  }

  &__head {
    display: flex;
    margin: 16px 16px 0 16px;
  }

  &__title {
    flex: 1 0 auto;
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
