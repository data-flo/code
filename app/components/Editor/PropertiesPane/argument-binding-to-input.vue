<template>
  <div>
    <v-subheader>
      Input Argument
      <v-btn
        v-tutorial-anchor.arrow.left="{
          key: 'add-input-node',
          id: anchorId,
        }"
        icon
        ripple
        v-on:click="onAddInputArgument"
      >
        <v-icon color="grey lighten-1">
          mdi-plus
        </v-icon>
      </v-btn>
    </v-subheader>
    <section v-if="!binding.input">
      Select an input argument to create a connection, or
      click on the <v-icon small>
        mdi-plus
      </v-icon> button to add one.
    </section>

    <!--
    <section v-else>
      Value of input
      <strong>{{ binding.input }}</strong>.
    </!--<section>
    -->

    <v-list
      color="primary"
      dense
    >
      <v-list-tile
        v-for="item in selectableArguments"
        v-bind:key="item.name"
        v-on:click="onSelectedSourceChange(item)"
      >
        <v-list-tile-action>
          <v-icon v-if="item.name === binding.input">
            mdi-check
          </v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <!--
          <v-text-field
            class="inline"
            outline
            placeholder="Argument name"
            single-line
            title="Rename input argument"
            v-bind:value="item.name"
            v-on:blur="onInputArgumentNameChange(item.name, $event.target.value)"
          >
          </v-text-field>
          -->
          <v-list-tile-title>
            {{ item.name }}
          </v-list-tile-title>
        </v-list-tile-content>

        <!--
        <v-list-tile-action>
          <v-btn
            icon
            ripple
            v-on:click.stop="onRemoveInputArgument(item)"
          >
            <v-icon color="grey lighten-1">
              mdi-minus
            </v-icon>
          </v-btn>
        </v-list-tile-action>
        -->
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState("editor", {
      manifest: "manifest",
      selection: "selection",
    }),
    ...mapGetters({
      argument: "editor/selectedArgument",
      binding: "editor/selectedArgumentBinding",
    }),
    anchorId() {
      return this.$store.getters["tutorial/stepAnchor"];
    },
    selectableArguments() {
      return this.manifest.input.filter((x) => x.type === this.argument.type);
    },
  },
  methods: {
    onAddInputArgument() {
      this.$store.commit(
        "editor/addInputVariable",
        {
          transformation: this.selection.transformation,
          argument: this.selection.argument,
          type: this.argument.type,
          description: this.argument.description,
        }
      );
    },
    onSelectedSourceChange(item) {
      this.$store.commit(
        "editor/addBinding",
        {
          transformation: this.selection.transformation,
          argument: this.selection.argument,
          kind: "input",
          input: item.name,
        }
      );
    },
  },
};
</script>

<style scoped>
.v-list {
  margin-top: -12px;
}
.v-list__tile__action {
  min-width: 40px;
}
</style>
