<template>
  <v-navigation-drawer
    v-bind:value="hasSidePane"
    clipped
    fixed
    app
    stateless
    width="255"
  >
    <transformations-list 
      ref="transformations-list"
    />
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import TransformationsList from "./transformations-list.vue";

export default {
  components: {
    TransformationsList,
  },
  computed: {
    ...mapState(
      "editor",
      { hasSidePane: "hasSidePane" }
    ),
  },
  updated() {
    if (this.hasSidePane) {
      this.$nextTick(() => {
        this.$refs["transformations-list"]
          .$refs["filter-text-field"]
          .$refs.input.focus();
      });
    }
  },
};
</script>
