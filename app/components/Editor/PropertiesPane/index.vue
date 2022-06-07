<template>
  <div
    class="properties-panel"
  >
    <div class="properties-panel-view">
      <component
        v-bind:is="currentViewComponent"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ArgumentProperties from "./argument-properties.vue";
import DataflowProperties from "./dataflow-properties.vue";
import InputNode from "./input-node.vue";
import OutputNode from "./output-node.vue";
import TransformationNode from "./transformation-node.vue";

export default {
  computed: {
    ...mapGetters({
      viewName: "editor/sidePaneViewName",
    }),
    currentViewComponent() {
      switch (this.viewName) {
        case "argument":
          return ArgumentProperties;
        case "dataflow":
          return DataflowProperties;
        case "input":
          return InputNode;
        case "output":
          return OutputNode;
        case "transformation":
          return TransformationNode;
      }
      return null;
    },
  },
};
</script>

<style scoped>
.properties-panel {
  background-color: #fcfcfc;
  border-left: solid 1px #e5e5e5;
  height: 100%;
  min-width: 240px;
  overflow-x: hidden;
  overflow-y: auto;
}

.properties-panel-view {
  width: 100%;
}

/* Revert inline-block for dialog activators */
.properties-panel >>> .v-dialog__container {
  display: block !important;
}

/* Apply padding to section contents */
.properties-panel >>> section {
  margin: 8px 16px 8px 8px;
}
.properties-panel >>> .v-subheader + section {
  margin-top: 0;
}
.properties-panel >>> .v-subheader + .v-input--selection-controls {
  margin-top: 0;
  padding: 0;
}

/* Set font of section headers */
.properties-panel >>> .v-subheader {
  font-family: Inter, Roboto, sans-serif;
  font-size: 11px;
  font-weight: bold;
  min-height: 32px;
  height: auto;
  margin-top: 8px;
  padding: 0 8px;
  text-transform: uppercase;
}
.properties-panel >>> .v-subheader > strong {
  text-transform: initial;
}

/* Right-align buttons inside section headers */
.properties-panel >>> .v-subheader > .v-btn:first-of-type {
  margin-left: auto;
}

/* Hide a divider when no content follows it  */
.properties-panel >>> .v-divider:last-child {
  display: none;
}

/* Pad inputs inside row- and column-layouts  */
.properties-panel >>> section .row.layout > :not(:first-child) .v-input {
  margin-left: 8px;
}
.properties-panel >>> section .row.layout > :not(:last-child) .v-input {
  margin-right: 8px;
}
.properties-panel >>> section .column.layout > :not(:first-child).v-input,
.properties-panel >>> section .column.layout > :not(:first-child) .v-input {
  margin-top: 8px;
}
.properties-panel >>> section .column.layout > :not(:last-child).v-input,
.properties-panel >>> section .column.layout > :not(:last-child) .v-input {
  margin-bottom: 8px;
}

/* Remove tick borders from text fields */
.properties-panel >>> .v-input .v-input__slot {
  border-width: 1px !important;
}

/* Make dense text fields smaller by forcing height to be 44px instead of 56px */
.properties-panel >>> .v-input.dense input {
  margin-top: 16px;
}
.properties-panel >>> .v-label {
  font-size: 14px;
}
.properties-panel >>> .v-input.dense .v-label {
  top: 12px;
}
.properties-panel >>> .v-input.dense .v-input__slot {
  height: 46px;
  min-height: 46px;
  border-width: 1px;
}

/* Reset icon buttons */
.properties-panel >>> .v-btn--icon {
  width: 32px;
  height: 32px;
  border-radius: 0;
}
.properties-panel >>> .v-btn--icon {
  margin: 0;
  border: 1px solid transparent;
  border-radius: 3px;
}
.properties-panel >>> .v-btn--icon::before {
  border-radius: 0;
}

.properties-panel >>> .v-list--dense .v-list__tile {
  height: 32px;
}
.properties-panel >>> .v-list--dense.v-list--two-line .v-list__tile {
  height: 56px;
}
</style>
