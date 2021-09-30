<template>
  <v-toolbar
    v-bind:clipped-left="$vuetify.breakpoint.lgAndUp"
    app
    dark
    dense
    fixed
    class="editor toolbar"
  >
    <v-toolbar-items>
      <nuxt-link
        class="v-btn v-btn--flat logo"
        title="Dataflow list"
        to="/transformations"
      >
        <img
          class="logo"
          src="~/static/images/data-flo-icon-logo-white.svg"
        >
      </nuxt-link>

      <v-btn
        title="Show/hide data transformations"
        v-bind:class="{ 'v-btn--active': hasSidePane }"
        flat
        v-on:click.stop="toggleSidePaneView"
      >
        <v-icon>
          mdi-plus
        </v-icon>
      </v-btn>

      <v-btn
        v-bind:disabled="!selectionRemovable"
        flat
        title="Delete selection"
        v-on:click="onRemoveSelection"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <!--
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-bind:href="`/api/dataflows/clone/${dataflowId}`"
            flat
            rel="noopener noreferrer"
            target="_blank"
            aria-valuetitle="Clone this Dataflow"
            v-on="on"
          >
            <v-icon>mdi-content-duplicate</v-icon>
          </v-btn>
        </template>
        <span>Clone this Dataflow</span>
      </v-tooltip>
      -->

      <save-button />

      <v-btn
        v-bind:active="isDebugButtonActive"
        v-bind:class="{ 'v-btn--active' : isDebugButtonActive }"
        flat
        title="Show/hide debugger"
        v-on:click.stop="toggleDebuggerMode"
      >
        <v-icon>
          {{ isDebugButtonActive ? 'mdi-bug' : 'mdi-bug-outline' }}
        </v-icon>
      </v-btn>

      <v-btn
        flat
        target="_blank"
        title="Go to Dataflow Info/Run page"
        v-bind:to="{ path: '/run', query: { [dataflowId]: null } }"
      >
        <v-icon>
          mdi-information-outline
        </v-icon>
      </v-btn>

      <Tutorial-button v-if="tutorial" />
    </v-toolbar-items>

    <v-spacer />

    <v-toolbar-title style="width: 240px">
      <v-text-field
        v-model="name"
        outline
        single-line
        placeholder="Untitled dataflow"
        title="Rename Dataflow"
      />
    </v-toolbar-title>

    <v-spacer />

    <v-text-field
      v-model="filter"
      clearable
      flat
      hide-details
      solo-inverted
      class="hidden-sm-and-down"
      label="Search"
      prepend-inner-icon="mdi-magnify"
    />

    <v-spacer />

    <help-menu />

    <v-toolbar-items>
      <v-btn
        v-if="isAuthenticated"
        flat
        href="/auth/signout"
      >
        Sign Out
      </v-btn>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
/* eslint vue/multiline-html-element-content-newline: 0 */

import { mapGetters, mapMutations, mapState } from "vuex";

import HelpMenu from "./help-menu.vue";
import SaveButton from "./save-button.vue";
import TutorialButton from "./tutorial-button.vue";

export default {
  components: {
    HelpMenu,
    SaveButton,
    TutorialButton,
  },
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$store.state.editor.description,
        },
      ],
    };
  },
  props: {
    tutorial: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    title() {
      const page = (this.tutorial) ? "Tutorial" : "Edit";
      const id = this.name || `Untitled Dataflow (${this.dataflowId})`;
      return `Data-flo - ${page}: ${id}`;
    },
    tutorialButton() {
      if (this.tutorial === true) {
        return () => import("./tutorial-button.vue");
      } else {
        return null;
      }
    },
    ...mapState("editor", {
      dataflowId: "id",
      hasSidePane: "hasSidePane",
      isDebugButtonActive: (state) => state.debugger.active,
      selection: "selection",
    }),
    ...mapGetters({
      isAuthenticated: "isAuthenticated",
      isAnonymous: "isAnonymous",
      selectionRemovable: "editor/selectionRemovable",
    }),
    name: {
      get() {
        return this.$store.state.editor.name;
      },
      set(value) {
        this.$store.commit("editor/updateName", value);
      },
    },
    filter: {
      get() {
        return this.$store.state.editor.filter;
      },
      set(value) {
        this.$store.commit("editor/updateFilter", value);
      },
    },
  },
  methods: {
    ...mapMutations({
      removeTransformation: "editor/removeTransformation",
      toggleDebuggerMode: "editor/toggleDebuggerMode",
      toggleSidePaneView: "editor/toggleSidePaneView",
    }),
    onRemoveSelection() {
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
  },
};
</script>

<style>
.editor.toolbar.v-toolbar {
  padding: 0 !important;
}
.editor.toolbar .v-toolbar__content {
  padding: 0 16px 0 0;
}
.editor.toolbar .v-toolbar__items:first-child .v-btn {
  min-width: 48px;
  padding: 0;
}
.editor.toolbar .logo.v-btn {
  align-items: center;
  background-color: #673C90;
  display: flex;
}
.editor.toolbar .logo.v-btn img {
  height: 32px;
}

.editor.toolbar .v-input__control {
  height: 32px;
  min-height: auto;
}

.editor.toolbar .v-toolbar__title input {
  height: 32px;
  margin: 0;
}
.editor.toolbar .v-toolbar__title .v-input__slot {
  margin: 0;
  height: 32px;
  min-height: 32px;
  border-width: 1px;
}
.editor.toolbar .v-toolbar__title .v-input:not(.v-input--is-focused) .v-input__slot {
  border-color: transparent;
}
.editor.toolbar .v-toolbar__title .v-input:not(.v-input--is-focused) .v-input__slot:hover {
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.7);
}
.editor.toolbar .v-toolbar__title .v-text-field__slot {
  height: 32px;
}
</style>

