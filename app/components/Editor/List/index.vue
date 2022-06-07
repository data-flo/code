<template>
  <section>
    <v-expansion-panel>
      <v-expansion-panel-content
        v-for="(item) in graph.nodes"
        v-bind:key="item.ref"
        v-bind:data="item.data"
        v-bind:kind="item.kind"
        v-bind:node-id="item.ref"
        v-bind:scale="scale"
        v-bind:status="item.status"
      >
        <template v-slot:header>
          <div>
            <v-icon>{{ icons[item.kind] }}</v-icon>
            {{ item.kind === "transformation" ? item.data.description : item.data.name }}
          </div>
        </template>
        <v-card>
          <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

const icons = {
  input: "mdi-import",
  output: "mdi-export",
  transformation: "mdi-cogs",
};

export default {
  components: {
  },
  props: {
    scale: Number,
  },
  computed: {
    ...mapGetters({
      graph: "editor/graphElements",
      links: "editor/linkableSockets",
    }),
    icons() {
      return icons;
    },
  },
};
</script>

<style scoped>
section {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  width: 100%;
}
</style>
