<template>
  <div
    ref="canvas"
    v-dragscroll
    class="canvas"
    tabindex="0"
    v-on:click="$refs.canvas.focus()"
    v-on:click.self="onClearSelection"
    v-on:dragscrollstart="onScrollStart"
    v-on:scroll="onScroll"
    v-on:dragscrollend="onScroll"
    v-on:contextmenu.capture="onClearSelection"
    v-on:contextmenu.prevent="onContextMenu"
    v-on:keydown="handleKeyboardEvent"
    v-on:wheel="handleWheelEvent"
    v-on:mousedown="onMouseDown"
  >
    <svg
      v-bind:width="svg.width"
      v-bind:height="svg.height"
      v-bind:viewBox="svg.viewBox"
      v-on:click.self="onClearSelection"
    >
      <dataflow-graph v-bind:scale="scalePercentage" />
    </svg>
    <context-menu ref="contextmenu" />
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { dragscroll } from "vue-dragscroll";

import ContextMenu from "./context-menu.vue";
import DataflowGraph from "../Graph/index.vue";

export default {
  components: {
    ContextMenu,
    DataflowGraph,
  },
  directives: {
    dragscroll,
  },
  computed: {
    ...mapState("editor", {
      offsets: "offsets",
    }),
    ...mapGetters({
      graphBounds: "editor/graphBounds",
      scalePercentage: "editor/scalePercentage",
      shortcuts: "editor/shortcuts",
    }),
    svg() {
      const width = Math.max(0, this.graphBounds.width * this.scalePercentage);
      const height = Math.max(0, this.graphBounds.height * this.scalePercentage);
      return {
        width: `${width}px`,
        height: `${height}px`,
        viewBox: `0 0 ${width} ${height}`,
      };
    },
  },
  mounted() {
    this.$store.commit(
      "editor/setOffsets",
      {
        x: this.$refs.canvas.scrollLeft,
        y: this.$refs.canvas.scrollTop,
        width: this.$refs.canvas.clientWidth,
        height: this.$refs.canvas.clientHeight,
      }
    );
    this.$refs.canvas.focus();
    window.addEventListener("paste", this.handlePaste);
  },
  destroyed() {
    window.removeEventListener("paste", this.handlePaste);
  },
  methods: {
    handleKeyboardEvent(event) {
      event.ctrlOrCmdKey = this.$device.isMacOS ? event.metaKey : event.ctrlKey;
      const match = this.shortcuts.find((x) => x.key === event.key && (!x.modifier || event[x.modifier]));
      if (match && match.command) {
        event.preventDefault();
        this.$store.commit(match.command);
      }
    },
    handleWheelEvent(event) {
      if (this.$device.isMacOS ? event.metaKey : event.ctrlKey) {
        if (event.deltaY !== 0) {
          event.preventDefault();
          if (event.deltaY > 0) {
            this.$store.commit("editor/zoomOut");
          } else {
            this.$store.commit("editor/zoomIn");
          }
        }
      }
    },
    handlePaste(event) {
      if (event.target === this.$refs.canvas || event.target === window.document.body) {
        event.preventDefault();
        this.$store.commit(
          "editor/pasteData",
          (event.clipboardData || window.clipboardData).getData("text")
        );
      }
    },
    onClearSelection() {
      if (
        this.x === this.$refs.canvas.scrollLeft
        &&
        this.y === this.$refs.canvas.scrollTop
      ) {
        this.$store.commit("editor/clearSelection");
      } else {
        this.x = this.$refs.canvas.scrollLeft;
        this.y = this.$refs.canvas.scrollTop;
      }
    },
    onContextMenu($event) {
      this.$refs.contextmenu.showMenu($event);
    },
    onMouseDown($event) {
      $event.stopPropagation();
    },
    onScrollStart() {
      this.x = this.offsets.x;
      this.y = this.offsets.y;
    },
    onScroll($event) {
      this.$store.commit(
        "editor/setOffsets",
        {
          x: $event.target.scrollLeft,
          y: $event.target.scrollTop,
          width: $event.target.clientWidth,
          height: $event.target.clientHeight,
        }
      );
    },
  },
};
</script>

<style scoped>
.canvas {
  background-color: #dfdbe584;
  background-image: url("~static/images/graph-paper.svg");
  background-repeat: repeat;
  background-attachment: local;
  background-position: -6px -6px;
  bottom: 0;
  cursor : grab;
  left: 0;
  overflow: scroll;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>
