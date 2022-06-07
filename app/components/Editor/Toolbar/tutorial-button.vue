<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        v-bind:active="isVisible"
        v-bind:aria-valuetitle="tutorialState.title"
        flat
        v-on:click.stop="toggleTutorial"
        v-on="on"
      >
        <v-icon>{{ tutorialState.icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{ tutorialState.title }}</span>
  </v-tooltip>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "ToggleButton",
  computed: {
    ...mapState("tutorial", [
      "isVisible",
    ]),
    tutorialState() {
      if (this.isVisible) {
        return {
          icon: "mdi-help-rhombus",
          title: "Hide tutorial",
        };
      }
      return {
        icon: "mdi-help-rhombus-outline",
        title: "Show tutorial",
      };
    },
  },
  methods: {
    toggleTutorial() {
      this.$store.commit("tutorial/setIsVisible", !this.isVisible);
    },
  },
};
</script>
