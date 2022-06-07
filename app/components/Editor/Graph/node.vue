<template>
  <component
    v-bind:is="dynamicComponent"
    v-bind:node-id="nodeId"
    v-bind:scale="scale"
    v-bind:status="status"
    v-bind="data"
    v-bind:x="x"
    v-bind:y="y"
  />
</template>

<script>
import InputNode from "./input-node.vue";
import OutputNode from "./output-node.vue";
import TransformationNode from "./transformation-node.vue";

export default {
  props: {
    data: Object,
    kind: String,
    nodeId: String,
    scale: Number,
    status: String,
    x: Number,
    y: Number,
  },
  computed: {
    dynamicComponent() {
      switch (this.kind) {
        case "input":
          return InputNode;
        case "output":
          return OutputNode;
        case "transformation":
          return TransformationNode;
      }
      throw new Error("Invalid node");
    },
  },
};
</script>
