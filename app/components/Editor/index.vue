<template>
  <v-app color="primary">
    <side-pane />
    <editor-toolbar />
    <v-content>
      <client-only>
        <splitpanes
          v-bind:dbl-click-splitter="false"
          vertical
          v-on:resize="onResize"
        >
          <pane size="99">
            <splitpanes
              v-bind:dbl-click-splitter="false"
              horizontal
              v-on:resize="onResize"
            >
              <pane size="60">
                <editor-canvas v-if="viewmode === 'graph'" />
                <zoom-controls v-if="viewmode === 'graph'" />
                <graph-minimap v-if="viewmode === 'graph'" />
                <editor-list v-if="viewmode === 'list'" />
              </pane>
              <pane
                v-if="isDebuggerActive"
                size="40"
                v-bind:style="{ overflow: 'hidden scroll' }"
              >
                <dataflow-debugger />
              </pane>
            </splitpanes>
          </pane>
          <pane
            v-bind:style="{ 'min-width': '240px' }"
            size="1"
          >
            <properties-pane />
          </pane>
        </splitpanes>
      </client-only>
    </v-content>
    <ErrorMessage />
  </v-app>
</template>

<script>
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import EditorList from "./List/index.vue";
import EditorCanvas from "./Canvas/index.vue";
import EditorToolbar from "./Toolbar/index.vue";
import ErrorMessage from "./ErrorMessage/index.vue";
import GraphMinimap from "./Canvas/minimap.vue";
import PropertiesPane from "./PropertiesPane/index.vue";
import SidePane from "./SidePane/index.vue";
import ZoomControls from "./Canvas/zoom-controls.vue";
import DataflowDebugger from "./PropertiesPane/dataflow-debugger.vue";

export default {
  components: {
    EditorCanvas,
    EditorList,
    EditorToolbar,
    ErrorMessage,
    GraphMinimap,
    Splitpanes,
    Pane,
    PropertiesPane,
    SidePane,
    ZoomControls,
    DataflowDebugger,
  },
  computed: {
    isDebuggerActive() {
      return this.$store.state.editor.debugger.active;
    },
    viewmode() {
      return this.$store.state.editor.viewmode;
    },
  },
  methods: {
    onResize(e) {
      if (window.getSelection) {
        if (window.getSelection().empty) {
          window.getSelection().empty();
        }
        else if (window.getSelection().removeAllRanges) {
          window.getSelection().removeAllRanges();
        }
      }
      else if (document.selection) {
        document.selection.empty();
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 0;
}

.splitpanes {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}
.splitpanes--dragging {
  user-select: none !important;
}
.splitpanes >>> .splitpanes__pane {
  position: relative;
}
.splitpanes >>> .splitpanes__splitter {
  z-index: 100;
}
.splitpanes >>> .splitpanes__splitter:hover {
  background-color: hsl(0, 0%, 26%);
}
.splitpanes--vertical >>> .splitpanes__splitter {
  width: 8px;
  height: auto;
}
.splitpanes--horizontal >>> .splitpanes__splitter {
  height: 8px;
  width: auto;
}

.multipane {
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  top: 0;
}

</style>
