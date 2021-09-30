<template>
  <g v-bind:class="status">
    <path
      v-bind:d="`
        M ${startX} ${startY}
        C ${middleX} ${startY} ${middleX} ${endY} ${endX} ${endY}
      `"
      fill="none"
      stroke-linecap="round"
      stroke-width="3"
      stroke="#a386bd"
    />
    <circle
      v-if="status === 'highlighted'"
      v-bind:cx="startX"
      v-bind:cy="startY"
      r="6"
      fill="#a386bd"
    />
    <circle
      v-if="status === 'highlighted'"
      v-bind:cx="endX"
      v-bind:cy="endY"
      r="6"
      fill="#a386bd"
    />
    <polygon
      v-bind:points="`-6,-8 10,0 -6,8`"
      v-bind:transform="arrowTransform"
      fill="#a386bd"
      v-on:click="onSelectBinding"
      v-on:contextmenu.prevent="onSelectBinding"
    />
  </g>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    data: Object,
    endX: Number,
    endY: Number,
    kind: String,
    startX: Number,
    startY: Number,
    status: String,
  },
  computed: {
    ...mapState("editor", {
      selection: "selection",
    }),
    angle() {
      const dx = this.bezierTangent(this.startX, this.middleX, this.middleX, this.endX);
      const dy = this.bezierTangent(this.startY, this.middleY, this.endY, this.endY);
      return Math.atan2(dy, dx) / Math.PI * 180;
    },
    arrowTransform() {
      return `
        translate(
          ${this.bezierPoint(this.startX, this.middleX, this.middleX, this.endX)},
          ${this.bezierPoint(this.startY, this.startY, this.endY, this.endY)}
        )
        rotate(${this.angle})
      `;
    },
    middleX() {
      return (this.startX + this.endX) / 2;
    },
    middleY() {
      return (this.startY + this.endY) / 2;
    },
  },
  methods: {
    bezierPoint(p0, p1, p2, p3)
    {
      return (
        0.5 * 0.5 * 0.5 * p0 +
        3.0 * 0.5 * 0.5 * 0.5 * p1 +
        3.0 * 0.5 * 0.5 * 0.5 * p2 +
        0.5 * 0.5 * 0.5 * p3
      );
    },
    bezierTangent(p0, p1, p2, p3)
    {
      return (
        3.0 * 0.5 * 0.5 * (p1 - p0) +
        6.0 * 0.5 * 0.5 * (p2 - p1) +
        3.0 * 0.5 * 0.5 * (p3 - p2)
      );
    },
    onSelectBinding() {
      if (this.kind === "output") {
        this.$store.commit(
          "editor/selectOutputNode",
          this.data.targetOutput
        );
      } else {
        this.$store.commit(
          "editor/selectTransformationArgument",
          {
            transformation: this.data.targetTransformation,
            direction: "in",
            argument: this.data.targetArgument,
          }
        );
      }
    },
  },
};
</script>

<style scoped>
polygon, path {
  transition: 0.3s cubic-bezier(.25,.8,.5,1);
  transition-property: fill, stroke;
}

polygon {
  cursor: pointer;
  fill: var(--cgps-purple-secondary);
}
path {
  stroke: var(--cgps-purple-secondary);
  pointer-events: none;
}
circle {
  pointer-events: none;
}

.highlighted > polygon {
  fill: var(--cgps-purple-primary);
}
.highlighted > path {
  stroke: var(--cgps-purple-secondary);
}

.dehighlighted > polygon {
  fill: var(--grey-cool-200);
}
.dehighlighted > path {
  stroke: var(--grey-cool-200);
}
</style>
