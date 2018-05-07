<template>
  <div class="tot-plot"></div>
</template>

<script>
import Plotly from 'plotly.js';

export default {
  name: 'TotPlot',
  props: {
    size: Object
  },
  mounted() {
    const trace1 = {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: 'scatter'
    };

    const trace2 = {
      x: [1, 2, 3, 4],
      y: [16, 5, 11, 9],
      type: 'scatter'
    };

    const layout = {
      autosize: true,
      // margin: { l: 0, r: 0, t: 0, b: 0 }
    };
    const options = {
      scrollZoom: true,
      displayModeBar: false,
    };


    const data = [trace1, trace2];

    Plotly.newPlot(this.$el, data, layout, options);
    Plotly.Plots.resize(this.$el);
  },
  methods: {
    resize() {
      Plotly.Plots.resize(this.$el);
    }
  }
};
</script>

<style lang="scss" scoped>
.tot-plot {
  width: 100%;
  height: 100%;
}
</style>
