<template>
  <div class="datatable-viewer">
    <component
      v-if="VueVirtualTable"
      :is="VueVirtualTable"
      v-bind::config="tableConfig"
      v-bind::data="tableData"
          :height="800"
    :itemHeight="55"
    :minWidth="1000"
    :selectable="true"
    :enableExport="true"
    />
  </div>
</template>

<script>
export default {
  props: {
    description: String,
    value: Object,
  },
  data() {
    return {
      VueVirtualTable: null,
      tableConfig: [{ prop: 'user' }, { prop: 'age' }],
      tableData: [{ user: 'a1', age: 20 }, { user: 'a2', age: 21 }, { user: 'a3', age: 23 }],
    };
  },
  // computed: {
  //   tableConfig() {
  //     if (this.value) {
  //       return this.value.columns.map((x) => ({ prop: x }));
  //     }
  //     return [];
  //   },
  //   tableData() {
  //     if (this.value) {
  //       return this.value.rows;
  //     }
  //     return [];
  //   },
  // },
  mounted() {
    import("vue-virtual-table").then((VueVirtualTable) => {
      this.VueVirtualTable = VueVirtualTable.default;
    });
  },
};
</script>

<style scoped>
/* .datatable-viewer {
  width: 300px;
  height: 300px;
} */
</style>
