<template>
  <div>
    <v-subheader>
      Value
      <v-menu
        bottom
        left
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-bind:class="{ padded: menuButtonClassname }"
            icon
            v-on="on"
          >
            <v-icon color="grey">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-tile
            v-on:click="convertToInput"
          >
            Convert to input
          </v-list-tile>
          <v-list-tile
            v-on:click="convertToSecretInput"
          >
            Convert to secret input
          </v-list-tile>
        </v-list>
      </v-menu>      
    </v-subheader>

    <section>
      <input-control
        v-model="selectedSource"
        v-tutorial-anchor.arrow.left="{
          key: 'binding-value',
          id: anchorId,
        }"
        v-tutorial-anchor-value="{
          key: 'binding-value',
          id: anchorValueId,
          value: selectedSource,
        }"
        v-bind:name="label"
        v-bind:type="argument.type"
        inline
      />
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import InputControl from "~/components/InputControl/index.vue";

export default {
  components: {
    InputControl,
  },
  computed: {
    ...mapGetters({
      argument: "editor/selectedArgument",
      binding: "editor/selectedArgumentBinding",
      selection: "editor/selection",
    }),
    anchorId() {
      return this.$store.getters["tutorial/stepAnchor"];
    },
    anchorValueId() {
      return this.$store.getters["tutorial/stepValue"];
    },
    label() {
      return (this.argument.type !== "map" && this.argument.type !== "list") ? this.argument.name : "";
    },
    menuButtonClassname() {
      return (this.argument.type === "list" || this.argument.type === "map");
    },
    selectedSource: {
      get() {
        return this.binding.value;
      },
      set(value) {
        this.$store.commit("editor/updateArgumentBindingValue", {
          transformation: this.selection.transformation,
          argument: this.selection.argument,
          value,
        });
      },
    },
  },
  methods: {
    convertToInput() {
      this.$store.commit("editor/convertArgumentBindingToInput", {
        transformation: this.selection.transformation,
        argument: this.selection.argument,
        type: this.argument.type,
      });
    },
    convertToSecretInput() {
      this.$store.commit("editor/convertArgumentBindingToInput", {
        transformation: this.selection.transformation,
        argument: this.selection.argument,
        type: this.argument.type,
        isSecret: true,
      });
    },
  },
};
</script>

<style scoped>
.v-subheader + section .v-input.multiline {
  margin-top: -40px;
}
.properties-panel .v-subheader > .v-btn.padded {
  margin-right: 32px;
  z-index: 1;
}
</style>

