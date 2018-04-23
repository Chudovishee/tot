<template>
  <el-menu-collapse-transition>
    <ul class="el-menu"
      :key="+collapse"
      :class="classList"
    >
      <slot></slot>
    </ul>
  </el-menu-collapse-transition>
</template>

<script>
import { Menu as ElMenu } from 'element-ui';

export default {
  name: 'AppLevelMenu',
  extends: ElMenu,
  props: {
    level: {
      type: Number,
      default() {
        return 0;
      }
    },
    mode: {
      type: String,
      default: 'horizontal'
    }
  },
  computed: {
    classList() {
      const list = {
        'el-menu--horizontal': this.mode === 'horizontal',
        'el-menu--dark': this.theme === 'dark',
        'el-menu--collapse': this.collapse
      };
      list[`el-menu--level-${this.level}`] = true;
      return list;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-menu {
  display: flex;
  justify-content: center;

  /deep/ {
    &.el-menu--level-0 > .el-menu-item {
      font-size: 16px;
    }

    &.el-menu--level-1 > .el-menu-item {
      height: 40px;
      line-height: 40px;
      border: none;

      &.is-active{
        color: #409EFF;
      }
    }
  }
}
</style>
