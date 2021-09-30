<template>
  <g
    v-bind:transform="`translate(${x + xCorrection}, ${y - 12})`"
    v-on:click="onCreateLink"
  >
    <!-- <path fill="none" d="M0 0h24v24H0V0z"/> -->
    <path
      fill="hsl(271, 20%, 83%)"
      d="M5 19h14V5H5v14zm2-8h4V7h2v4h4v2h-4v4h-2v-4H7v-2z"
    />
    <path
      fill="hsl(271, 41%, 40%)"
      d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-8-2h2v-4h4v-2h-4V7h-2v4H7v2h4z"
    />
  </g>
</template>

<script>
export default {
  props: {
    data: Object,
    kind: String,
    x: Number,
    y: Number,
  },
  computed: {
    xCorrection() {
      switch (this.data.direction) {
        case "in":
          return -32;
        case "out":
          return 8;
      }
      return 0;
    },
  },
  methods: {
    onCreateLink() {
      this.$store.commit(
        "editor/addBinding",
        {
          kind: this.kind,
          ...this.data,
        }
      );
    },
  },
};
</script>

<style scoped>
g {
  cursor: pointer;
}
g:hover > path:first-child {
  fill: hsl(271, 20%, 66%);
}
</style>
