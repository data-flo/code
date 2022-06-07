<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>
            Key
          </th>
          <th>
            Value
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, rowIndex) in (value || [])"
          v-bind:key="`row-${rowIndex}`"
        >
          <td>
            {{ row.key }}
          </td>
          <td>
            {{ row.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    description: String,
    value: Array,
  },
};
</script>

<style scoped>
div {
  overflow-x: auto;
}
table {
  border: 1px solid #dee2e6;
  border-collapse: collapse;
}
table td, table th {
  margin: 0;
  padding: 2px 4px;
  border: 1px solid #dee2e6;
}
</style>
