<template>
  <g
    v-bind:transform="`scale(${scale})`"
  >
    <graph-node
      v-for="(item) in graph.nodes"
      v-bind:key="item.ref"
      v-bind:data="item.data"
      v-bind:kind="item.kind"
      v-bind:node-id="item.ref"
      v-bind:scale="scale"
      v-bind:status="item.status"
      v-bind:x="item.x"
      v-bind:y="item.y"
    />
    <graph-edge
      v-for="(item) in graph.edges"
      v-bind:key="item.ref"
      v-bind:data="item.data"
      v-bind:end-x="item.endX"
      v-bind:end-y="item.endY"
      v-bind:kind="item.kind"
      v-bind:start-x="item.startX"
      v-bind:start-y="item.startY"
      v-bind:status="item.status"
    />
    <create-link-button
      v-for="(item) in links"
      v-bind:key="item.ref"
      v-bind:data="item.data"
      v-bind:kind="item.kind"
      v-bind:x="item.x"
      v-bind:y="item.y"
    />
  </g>
</template>

<script>
import { mapGetters } from "vuex";

import CreateLinkButton from "./create-link-button.vue";
import GraphEdge from "./edge.vue";
import GraphNode from "./node.vue";

export default {
  components: {
    CreateLinkButton,
    GraphEdge,
    GraphNode,
  },
  props: {
    scale: Number,
  },
  computed: {
    ...mapGetters({
      graph: "editor/graphElements",
      links: "editor/linkableSockets",
    }),
  },
};
</script>
