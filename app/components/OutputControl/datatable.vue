<template>
  <div class="datatable">
    <client-only>
      <q-resize-observer
        v-if="!height"
        v-on:resize="onResize"
      />
      <q-virtual-scroll
        type="table"
        v-bind:style="{ 'max-height': height || `${size.height}px` }"
        v-bind:virtual-scroll-item-size="48"
        v-bind:virtual-scroll-sticky-size-start="48"
        v-bind:virtual-scroll-sticky-size-end="32"
        v-bind:items="rows"
      >
        <template v-slot:before>
          <thead class="thead-sticky text-left">
            <tr>
              <th>#</th>
              <th
                v-for="(col, index) in columns"
                v-bind:key="'1--' + col"
              >
                {{ transpose ? index : col }}
              </th>
            </tr>
          </thead>
        </template>

        <template v-slot="{ item, index }">
          <tr v-bind:key="index">
            <td>{{ transpose ? item : index + 1 }}</td>
            <td
              v-for="col in columns"
              v-bind:key="index + '-' + col"
            >
              {{ transpose ? col[item] : item[col] }}
            </td>
          </tr>
        </template>
      </q-virtual-scroll>
    </client-only>
  </div>
</template>

<script>
import { QResizeObserver, QVirtualScroll } from "quasar";

export default {
  components: {
    QResizeObserver,
    QVirtualScroll,
  },
  props: {
    description: String,
    height: String,
    value: Object,
  },
  data() {
    return {
      size: { width: 1, height: 100 },
      transpose: false,
    };
  },
  computed: {
    columns() {
      if (this.value) {
        return this.transpose ? this.value.rows : this.value.columns;
      }
      return [];
    },
    rows() {
      if (this.value) {
        return this.transpose ? this.value.columns : this.value.rows;
      }
      return [];
    },
  },
  methods: {
    onResize(size) {
      this.size = size;
    },
  },
};
</script>

<style scoped>
.datatable {
  height: 100%;
  width: 100%;
}

.q-markup-table {
  border: 1px solid #ededed;
}

.datatable >>> .q-table th {
  user-select: auto;
}

.datatable >>> .thead-sticky tr > *,
.datatable >>> .tfoot-sticky tr > * {
  position: sticky;
  opacity: 1;
  z-index: 1;
  background: #ededed;
}

.datatable >>> .thead-sticky tr:last-child > * {
  top: 0;
}

.datatable >>> tbody tr td:first-child {
  background: #ededed;
}
</style>
