<template>
  <g>
    <graph-node
      v-for="(item) in graph.nodes"
      v-bind:key="item.ref"
      v-bind:data="item.data"
      v-bind:kind="item.kind"
      v-bind:status="item.status"
      v-bind:x="item.x"
      v-bind:y="item.y"
    />
  </g>
</template>

<script>
import { mapGetters } from "vuex";

import GraphNode from "./node.vue";

export default {
  components: {
    GraphNode,
  },
  computed: {
    ...mapGetters({
      graph: "editor/graphElements",
    }),
  },
};
</script>
