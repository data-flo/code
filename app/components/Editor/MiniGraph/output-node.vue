<template>
  <g
    v-bind:transform="`translate(${x}, ${y})`"
    v-bind:class="status"
    class="output node"
  >
    <path
      class="drag-handle"
      d="
        M 0,4
        a 4,4 0 0 1 4,-4
        h 112
        a 4,4 0 0 1 4,4
        v 24
        a 4,4 0 0 1 -4,4
        h -112
        a 4,4 0 0 1 -4,-4
        z
      "
      fill="#fff"
      stroke-width="1"
      stroke="#a0a0a0"
    />
  </g>
</template>

<script>
export default {
  props: {
    name: String,
    status: String,
    x: Number,
    y: Number,
  },
};
</script>

<style scoped>
.highlighted path {
  stroke: var(--cgps-purple-primary);
  stroke-width: 2;
}
.highlighted text {
  fill: var(--cgps-purple-primary);
}
</style>
