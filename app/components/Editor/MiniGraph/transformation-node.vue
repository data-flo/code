<template>
  <g
    v-bind:class="status"
    v-bind:transform="`translate(${x}, ${y})`"
    class="transformation node"
  >
    <path
      v-bind:d="`
        M 0,4
        a 4,4 0 0 1 4,-4
        h 152
        a 4,4 0 0 1 4,4
        v ${32 + 24 * numberOfArguments}
        a 4,4 0 0 1 -4,4
        h -152
        a 4,4 0 0 1 -4,-4
        z`"
      class="border"
      fill="#fff"
      stroke-width="1"
      stroke="#a0a0a0"
    />
    <path
      class="header"
      d="M 0,4
         a 4,4 0 0 1 4,-4
         h 152
         a 4,4 0 0 1 4,4
         v 28
         h -160
         z"
      fill="#ede9f0"
    />
  </g>
</template>

<script>
export default {
  props: {
    numberOfArguments: Number,
    status: String,
    x: Number,
    y: Number,
  },
};
</script>

<style scoped>
path, text {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition-property: fill, stroke, stroke-width;
}

text {
  cursor: pointer;
  font-weight: 500;
}

.highlighted path.border {
  stroke: var(--cgps-purple-primary);
  stroke-width: 2;
}

.success path.border {
  stroke: #4caf50;
}
.success path.header {
  fill: #4caf50;
}

.error path.border {
  stroke: #ff5252;
}
.error path.header {
  fill: #ff5252;
}

.highlighted path.header {
  fill: var(--cgps-purple-primary);
}
.highlighted text {
  fill: #ffffff;
}

.dehighlighted path.border {
  stroke: var(--grey-cool-300);
}
</style>
