<template>
  <g
    class="argument"
    v-bind:class="[ status, { inverted: isInverted } ]"
    v-bind:transform="`translate(${x}, ${y})`"
    v-on:mouseup="bodyUp($event)"
    v-on:touchstop="bodyUp($event)"
  >
    <circle
      v-bind:cx="isInverted ? -0 : 0"
      class="socket"
      cy="0"
      fill="#e5e5e5"
      r="8"
      stroke-width="2"
      stroke="#a0a0a0"
    />
    <circle
      v-if="hasBinding"
      v-bind:cx="isInverted ? -0 : 0"
      class="plug"
      cy="0"
      r="6"
      fill="#a386bd"
    />
    <!-- <text
      v-bind:text-anchor="isInverted ? 'end' : 'start'"
      v-bind:x="isInverted ? -12 : 12"
      class="heading"
      dominant-baseline="central"
      fill="#a0a0a0"
      font-family="Roboto, 'Helvetica Neue', Arial, Helvetica, sans-serif"
      font-size="13"
      style="user-select: none"
      y="0"
    >
      {{ label }}
    </text> -->
    <foreignObject
      height="32"
      v-bind:width="width - 8"
      v-bind:x="isInverted ? -width : 8"
      y="-16"
    >
      <text>
        {{ label }}
      </text>
    </foreignObject>
  </g>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    argument: String,
    direction: String,
    input: String,
    kind: String,
    label: String,
    output: String,
    socketId: String,
    socketType: String,
    status: String,
    transformation: String,
    width: Number,
    x: Number,
    y: Number,
  },
  computed: {
    ...mapGetters({
      allBindings: "editor/boundSockets",
      selection: "editor/selection",
    }),
    isInverted() {
      return this.direction === "out";
    },
    hasBinding() {
      return this.allBindings.has(this.socketId);
    },
  },
  methods: {
    onSelect() {
      switch (this.kind) {
        case "transformation":
          this.$store.commit(
            "editor/selectTransformationArgument",
            {
              transformation: this.transformation,
              direction: this.direction,
              argument: this.argument,
            }
          );
          break;

        case "input":
          this.$store.commit("editor/selectInputNode", this.input);
          break;

        case "output":
          this.$store.commit("editor/selectOutputNode", this.output);
          break;
      }
    },
    bodyUp(event) {
      this.onSelect();
      event.stopDragSelect = true;
    },
  },
};
</script>

<style scoped>
g, text {
  cursor: pointer;
}

circle, text {
  transition: 0.3s cubic-bezier(.25,.8,.5,1);
  transition-property: fill, stroke;
}

text {
  fill: var(--grey-neutral-750);
  font-weight: 500;
}
text {
  display: block;
  font-family: 'Roboto', 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 500;
  height: 100%;
  overflow: hidden;
  padding: 6px 4px 0 4px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}
.inverted text {
  text-align: right;
}

.argument.highlighted circle.socket {
  stroke: var(--cgps-purple-primary);
}
.argument.highlighted text {
  color: var(--cgps-purple-primary);
  fill: var(--cgps-purple-primary);
}

.argument.dehighlighted circle.socket {
  fill: var(--grey-cool-100);
  stroke: var(--grey-cool-200);
}

.argument.argument.linkable circle.plug,
.argument.dehighlighted circle.plug {
  fill: var(--grey-cool-200);
}
.argument.dehighlighted text {
  color: var(--grey-cool-200);
  fill: var(--grey-cool-200);
}

.argument.has-errors circle.socket {
  stroke: rgb(255, 82, 82);
}

.argument.linkable text {
  color: var(--grey-cool-400);
  fill: var(--grey-cool-400);
}

.argument:not(.highlighted):hover text {
  color: #a285bc;
  fill: #a285bc;
}
</style>
