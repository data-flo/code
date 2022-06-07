<template>
  <v-menu
    v-model="contextMenu.state"
    v-bind:position-x="contextMenu.x"
    v-bind:position-y="contextMenu.y"
    absolute
    transition="slide-y-transition"
  >
    <v-list dense>
      <!--
      <v-list-tile>
        <v-list-tile-action class="thin-action">
          <v-btn
            flat
            small
            v-on:click.stop="zoomOut"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title class="scale noselect">
            {{ scale }}%
          </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action class="thin-action">
          <v-btn
            flat
            small
            v-on:click.stop="zoomIn"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-list-tile-action>
        <v-divider
          v-if="supportFullScreen"
          vertical
          light
          class="divider"
        />
        <v-list-tile-action
          v-if="supportFullScreen"
          class="thin-action"
        >
          <v-btn
            flat
            small
            v-on:click.stop="toggleFullscreen()"
          >
            <v-icon v-if="isFullscreen">
              mdi-fullscreen-exit
            </v-icon>
            <v-icon v-else>
              mdi-fullscreen
            </v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>

      <v-divider
        v-if="selectionRemovable || allowDuplication"
        light
        class="divider"
      />
      -->

      <v-list-tile
        v-show="hasSelection"
        v-on:click="copySelection"
      >
        <v-list-tile-action>
          <v-icon >mdi-content-copy</v-icon>
        </v-list-tile-action>
        Copy
      </v-list-tile>

      <v-list-tile
        v-if="allowDuplication"
        v-on:click="duplicateSelection"
      >
        <v-list-tile-action>
          <v-icon >mdi-content-duplicate</v-icon>
        </v-list-tile-action>
        Duplicate
      </v-list-tile>

      <v-list-tile
        v-if="selectionRemovable"
        v-on:click="deleteSelection"
      >
        <v-list-tile-action>
          <v-icon >mdi-delete</v-icon>
        </v-list-tile-action>
        Delete
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import { mapMutations, mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      isFullscreen: false,
      contextMenu: {
        state: false,
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    ...mapState("editor", {
      scale: "scale",
      selection: "selection",
    }),
    ...mapGetters("editor", {
      selectionKind: "selectionKind",
      selectedArgumentBinding: "selectedArgumentBinding",
      selectionRemovable: "selectionRemovable",
    }),
    hasSelection() {
      return this.selectionKind !== "dataflow";
    },
    allowDuplication() {
      return this.selectionKind === "transformation";
    },
    supportFullScreen() {
      const doc = document.documentElement;
      return (
        ("requestFullscreen" in doc) ||
        ("mozRequestFullScreen" in doc && document.mozFullScreenEnabled) ||
        ("msRequestFullscreen" in doc && document.msFullscreenEnabled) ||
        ("webkitRequestFullScreen" in doc)
      );
    },
  },
  methods: {
    ...mapMutations({
      copySelection: "editor/copySelection",
    }),
    enterFullscreen(ele = document.documentElement) {
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.webkitRequestFullscreen) {
        ele.webkitRequestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      } else {
        console.warn("Fullscreen API is not supported.");
        return;
      }
      this.isFullscreen = true;
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else {
        console.warn("Fullscreen API is not supported.");
        return;
      }
      this.isFullscreen = false;
    },
    fullscreenCheck() {
      /*
       * Note:
       * 1 -
       * this should be a computed property
       * however document.fullscreen doesnt update
       * 2 -
       * I'm using both the old and new fullscreen API
       * this is due to the new one not working fully
       * and the old still working as expected
      */
      this.isFullscreen = (
        document.fullscreen ||
        document.mozFullScreen ||
        document.fullscreenElement ||
        document.msFullscreenElement ||
        document.webkitIsFullScreen
      );
    },
    deleteSelection() {
      if (this.selection.argument) {
        this.$store.commit("editor/removeArgumentBinding", this.selection);
      } else if (this.selection.input) {
        this.$store.commit("editor/removeInput", this.selection.input);
      } else if (this.selection.output) {
        this.$store.commit("editor/removeOutput", this.selection.output);
      } else if (this.selection.transformation) {
        this.$store.commit("editor/removeTransformation", this.selection.transformation);
      }
    },
    duplicateSelection() {
      this.$store.commit("editor/duplicateTransformation", this.selection.transformation);
      this.$nextTick(() => {
        this.contextMenu.state = false;
      });
    },
    showMenu($event) {
      this.fullscreenCheck();
      this.contextMenu = {
        state: false,
        x: $event.clientX,
        y: $event.clientY,
      };
      this.$nextTick(() => {
        this.contextMenu.state = true;
      });
    },
    toggleFullscreen() {
      if (this.isFullscreen) {
        this.exitFullscreen();
      } else {
        this.enterFullscreen();
      }
    },
  },
};
</script>

<style scoped>
.v-list__tile__action {
  min-width: 40px;
}

.scale {
  min-width:44px !important;
  text-align: center;
}
.noselect {
  user-select: none;
}
.divider {
  margin: 0 4px;
}
.thin-action {
  width: 44px !important;
  min-width: auto !important;
}
.thin-action .v-btn {
  width: inherit !important;
  min-width: auto !important;
}
</style>
