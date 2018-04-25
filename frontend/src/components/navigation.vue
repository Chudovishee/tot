<script>
import TotLevelMenu from './levelMenu';

export default {
  name: 'TotNavigation',
  extends: TotLevelMenu,
  mounted() {
    this.$on('select', this.navigate);
    this.activeIndex = this.getActiveIndex();
  },
  watch: {
    $route() {
      this.activeIndex = this.getActiveIndex();
    }
  },
  methods: {
    navigate(name, tree, item) {
      if (item.$attrs['no-route'] === undefined) {
        this.$router.push({ name });
      }
      this.$emit('navigate', name, tree, item);
    },
    getActiveIndex() {
      return this.$route.matched[this.level] && this.$route.matched[this.level].name;
    }
  }
};
</script>
