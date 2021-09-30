<template>
  <div class="minimap elevation-2">
    <svg
      v-bind:viewBox="graphBoundary.viewBox"
      height="100%"
      width="100%"
    >
      <mini-graph />
    </svg>
    <div class="blinder">
      <svg
        v-bind:viewBox="graphBoundary.viewBox"
        height="100%"
        width="100%"
      >
        <mask id="myMask">
          <rect
            v-bind:height="graphBoundary.height"
            v-bind:width="graphBoundary.width"
            fill="white"
            x="0"
            y="0"
          />
          <rect
            v-bind:height="offsetsScaleHeight"
            v-bind:width="offsetsScaleWidth"
            v-bind:x="offsetsScaleX"
            v-bind:y="offsetsScaleY"
            fill="black"
          />
        </mask>
        <rect
          v-bind:height="graphBoundary.height"
          v-bind:width="graphBoundary.width"
          fill="rgba(255, 255, 255, 0.07)"
          mask="url(#myMask)"
          x="0"
          y="0"
        />
        <rect
          v-bind:width="viewPort.width"
          v-bind:height="viewPort.height"
          v-bind:stroke-width="viewPort.strokeWidth"
          v-bind:x="offsetsScaleX"
          v-bind:y="offsetsScaleY"
          fill="transparent"
          stroke-opacity="0.8"
          stroke="#5e4396"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import MiniGraph from "../MiniGraph/index.vue";

export default {
  components: {
    MiniGraph,
  },
  data() {
    return {
      isRefitting: false,
    };
  },
  computed: {
    ...mapGetters({
      graphBounds: "editor/graphBounds",
      scalePercentage: "editor/scalePercentage",
    }),
    ...mapState("editor", {
      offsets: "offsets",
    }),
    graphBoundary() {
      const width = (this.graphBounds.width > 0) ? this.graphBounds.width : 0;
      const height = (this.graphBounds.height > 0) ? this.graphBounds.height : 0;
      return {
        width: `${width}px`,
        height: `${height}px`,
        viewBox: `0 0 ${width} ${height}`,
      };
    },
    viewPort() {
      const width = Math.max(0, Math.min(this.offsetsScaleWidth, this.graphBounds.width) || 0);
      const height = Math.max(0, Math.min(this.offsetsScaleHeight, this.graphBounds.height) || 0);
      const strokeWidth = Math.max(0, 2 * Math.max(this.graphBounds.width, this.graphBounds.height) / 160);
      return {
        width: `${width}px`,
        height: `${height}px`,
        strokeWidth: `${strokeWidth}px`,
      };
    },
    offsetsScaleX() {
      const temp = this.offsets.x / this.scalePercentage;
      return (Number.isNaN(temp)) ? 0 : temp;
    },
    offsetsScaleY() {
      const temp = this.offsets.y / this.scalePercentage;
      return (Number.isNaN(temp)) ? 0 : temp;
    },
    offsetsScaleHeight() {
      const temp = this.offsets.height / this.scalePercentage;
      return (Number.isNaN(temp)) ? 0 : temp;
    },
    offsetsScaleWidth() {
      const temp = this.offsets.width / this.scalePercentage;
      return (Number.isNaN(temp)) ? 0 : temp;
    },
    windowX() {
      return 160 * this.offsets.x / this.graphBounds.width;
    },
    windowY() {
      return 160 * this.offsets.y / this.graphBounds.height;
    },
  },
};
</script>

<style scoped>
.minimap {
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 160px;
  height: 160px;
  background: #fff;
}
.blinder {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: transparent;
}
</style>
