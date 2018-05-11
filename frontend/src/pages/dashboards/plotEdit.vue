<template>
  <el-dialog
    class="tot-plot-edit"
    :title="plot ? 'Edit plot' : 'Add plot'"
    :visible="visible"
    @update:visible="updateVisible"
    @open="open">

    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="120px"
      class="tot-plot-edit__form">

      <el-form-item label="Type" prop="type" :error="errors.type">
        <el-select v-model="form.type" placeholder="Select plot type">
          <el-option value="graph" label="Graph"/>
          <el-option value="value" label="Value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="Sources" prop="sources" :error="errors.sources">
        <div v-for="stat in availableStat" :key="stat.key">
          <el-checkbox
            :value="stat.key"
            v-model="form.sources[stat.key]">{{ stat.name }}
          </el-checkbox>
        </div>
      </el-form-item>

      <el-form-item :error="otherErrors">
        <el-button type="primary" @click="saveDashboard">Save</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>
<script>
import { reduce, find } from 'lodash';

import FormErrors from '@/mixins/formErrors';

import { FETCH_STAT_AVAILABLE } from '@/store/stat';

export default {
  name: 'TotPlotEdit',
  mixins: [FormErrors],
  props: {
    visible: Boolean,
    dashboard: String,
    plot: {
      type: String,
      default() {
        return null;
      }
    }
  },
  data() {
    return {
      form: {
        type: null,
        sources: {}
      },
      rules: {
        type: {
          required: true
        },
        sources: {validator(rule, value, callback) {
          const f = find;
          if (find(value, v => v) === undefined) {
            callback(['Select at least one source']);
          }
          else {
            callback([]);
          }
        }}
      }
    };
  },
  computed: {
    availableStat() {
      return this.$store.state.stat.available;
    }
  },
  methods: {
    updateVisible(val) {
      this.$emit('update:visible', val);
    },
    open() {
      this.$store.dispatch(FETCH_STAT_AVAILABLE)
        .then(() => this.clear());
    },
    clear() {
      if (this.plot) {

      }
      else {
        this.form.type = null;
        this.form.sources = reduce(this.availableStat, (memo, stat) => {
          return { ...memo, [stat.key]: false };
        }, {});
      }
    },
    saveDashboard() {
      this.clearErrors();
      this.$refs.form.validate((valid) => {
        debugger;
      });
    }
  }
};
</script>
