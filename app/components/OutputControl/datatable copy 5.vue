<template>
  <v-container fill-height>
    <v-layout column fill-height>
      <v-layout row style='flex: 1 1 50%; overflow: hidden'>
        <v-card height="100%" style='overflow:auto'>
    <v-data-table
      :headers="columns"
      :items="rows"
      class="elevation-1"
    >
      <template v-slot:items="props">
        <td
          v-for="(column) in columns"
          v-bind:key="column"
        >
          {{ props.item[column.value] }}
        </td>
      </template>
    </v-data-table>
        </v-card>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: {
    description: String,
    value: Object,
  },
  computed: {
    columns() {
      if (this.value) {
        return this.value.columns.map((x) => {
          return {
            text: x,
            value: x,
          };
        });
      }
      return [];
    },
    rows() {
      if (this.value) {
        return [ ...this.value.rows ];
      }
      return [];
    },
  },
};
</script>

<style scoped>
/* .datatable-viewer {
  width: 300px;
  height: 300px;
} */
</style>
