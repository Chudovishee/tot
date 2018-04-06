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
  name: 'AppNavigation',
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
  mounted() {
    this.$on('select', this.navigate);
    this.activeIndex = this.getActiveIndex();
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
  },
  watch: {
    $route() {
      this.activeIndex = this.getActiveIndex();
    }
  },
  methods: {
    navigate(name) {
      this.$router.push({ name });
    },
    getActiveIndex() {
      return this.$route.matched[this.level] && this.$route.matched[this.level].name;
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
