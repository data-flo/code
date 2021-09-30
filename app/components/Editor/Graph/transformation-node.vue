<template>
  <VueDrag
    v-bind:parent-scale-x="scale"
    v-bind:parent-scale-y="scale"
    v-bind:class="[status, debugStatus]"
    v-bind:x="x"
    v-bind:y="y"
    class="transformation node"
    v-on:dragging="onPositionChange($event, false)"
    v-on:dragselect="onSelect"
    v-on:dragstop="onPositionChange($event, true)"
    v-on:contextmenu.native="onSelect"
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
    <!-- <text
      dominant-baseline="central"
      fill="#5c4077"
      font-family="'Roboto', 'Helvetica Neue', Arial, Helvetica, sans-serif"
      font-size="13"
      style="user-select: none"
      text-anchor="middle"
      x-alignment-baseline="central"
      x="80"
      y="15"
    >
      {{ description }}
    </text> -->
    <foreignObject
      height="32"
      width="160"
    >
      <text>
        {{ description }}
      </text>
    </foreignObject>
    <Socket
      v-for="(socket) in nodeSockets"
      v-bind:key="socket.id"
      v-bind:kind="socket.kind"
      v-bind:label="socket.data.argument"
      v-bind:socket-id="socket.id"
      v-bind:socket-type="socket.type"
      v-bind:status="socket.status"
      v-bind="socket.data"
      v-bind:width="socket.full ? 160 : 80"
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
    numberOfArguments: Number,
    scale: Number,
    status: String,
    x: Number,
    y: Number,
  },
  computed: {
    ...mapGetters({
      sockets: "editor/graphSockets",
    }),
    nodeSockets() {
      return this.sockets[this.nodeId];
    },
    debugStatus() {
      return this.$store.state.editor.debugger.info[this.name];
    },
  },
  created() {
    this.onPositionChange = throttle(
      (event, isFinal) => {
        const x = Math.floor(event.left / 10) * 10;
        const y = Math.floor(event.top / 10) * 10;
        if (x !== this.x || y !== this.y) {
          this.$store.commit(
            "editor/moveTransformationNode",
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
      this.$store.commit(
        "editor/selectTransformationNode",
        { transformation: this.name }
      );
    },
  },
};
</script>

<style scoped>
.transformation.node {
  cursor: pointer;
}
.transformation.node.dragging {
  cursor: move;
}

path, text {
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  transition-property: fill, stroke, stroke-width;
}

text {
  color: #5c4077;
  cursor: pointer;
  display: block;
  font-family: 'Roboto', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 500;
  height: 100%;
  overflow: hidden;
  padding: 8px 4px 0 4px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
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
  color: #ffffff;
}

.dehighlighted path.border {
  stroke: var(--grey-cool-300);
}
</style>
