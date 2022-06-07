<template>
  <VueDrag
    v-bind:parent-scale-x="scale"
    v-bind:parent-scale-y="scale"
    v-bind:class="status"
    v-bind:x="x"
    v-bind:y="y"
    class="output node"
    v-on:dragging="onPositionChange"
    v-on:dragselect="onSelect"
    v-on:dragstop="onPositionChange"
    v-on:contextmenu.native="onSelect"
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
    <Socket
      v-bind:kind="socket.kind"
      v-bind:label="socket.data.output"
      v-bind:socket-id="socket.id"
      v-bind:socket-type="socket.type"
      v-bind:status="socket.status"
      v-bind="socket.data"
      v-bind:width="120"
      v-bind:x="socket.nx"
      v-bind:y="socket.ny"
    />
  </VueDrag>
</template>

<script>
import throttle from "lodash.throttle";
import { mapGetters } from "vuex";
import Socket from "./socket.vue";

export default {
  components: {
    Socket,
  },
  props: {
    description: String,
    name: String,
    nodeId: String,
    scale: Number,
    status: String,
    type: String,
    x: Number,
    y: Number,
  },
  computed: {
    ...mapGetters({
      socketsByNode: "editor/graphSockets",
    }),
    socket() {
      return this.socketsByNode[this.nodeId][0];
    },
  },
  created() {
    this.onPositionChange = throttle(
      (event, isFinal) => {
        const x = Math.floor(event.left / 10) * 10;
        const y = Math.floor(event.top / 10) * 10;
        if (x !== this.x || y !== this.y) {
          this.$store.commit(
            "editor/moveOutputNode",
            {
              name: this.name,
              x,
              y,
              isFinal,
            }
          );
        }
      },
      32,
      {
        leading: true,
        trailing: false,
      }
    );
  },
  methods: {
    onSelect() {
      this.$store.commit("editor/selectOutputNode", this.name);
    },
  },
};
</script>

<style scoped>
.output.node {
  cursor: pointer;
}
.output.node.dragging {
  cursor: move;
}

.highlighted path {
  stroke: var(--cgps-purple-primary);
  stroke-width: 2;
}
.highlighted text {
  color: var(--cgps-purple-primary);
  fill: var(--cgps-purple-primary);
}
</style>
