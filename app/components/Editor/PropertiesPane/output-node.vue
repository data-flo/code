<template>
  <v-layout column>
    <v-subheader>
      Output Details
    </v-subheader>
    <section>
      <v-layout column>
        <v-text-field
          v-model="name"
          hide-details
          outline
          class="dense"
          label="Name"
        />

        <v-select
          v-model="datatype"
          v-bind:disabled="true"
          v-bind:items="dataTypeNames"
          hide-details
          outline
          class="dense"
          label="Data type"
        />

        <v-textarea
          v-model="description"
          dense
          hide-details
          inline
          outline
          label="Description"
          rows="2"
        />
      </v-layout>
    </section>

    <v-divider />

    <v-subheader>
      UI
    </v-subheader>

    <section>
      <v-layout
        row
        wrap
      >
        <v-flex xs6>
          <v-text-field
            v-model="positionX"
            hide-details
            outline
            class="dense"
            label="X"
            type="number"
          />
        </v-flex>
        <v-flex xs6>
          <v-text-field
            v-model="positionY"
            hide-details
            outline
            class="dense"
            label="Y"
            type="number"
          />
        </v-flex>
      </v-layout>
    </section>

    <v-divider />

    <section>
      <v-btn
        block
        outline
        small
        v-on:click="onRemoveStage"
      >
        <v-icon left>
          mdi-delete
        </v-icon>
        Remove
      </v-btn>
    </section>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      dataTypeNames: "types/names",
      node: "editor/selectedTransformation",
    }),
    datatype: {
      get() {
        return this.node.data.type;
      },
      set(value) {
        this.$store.commit(
          "editor/updateOutputDatatype",
          {
            name: this.node.data.name,
            type: value,
          }
        );
      },
    },
    description: {
      get() {
        return this.node.data.description;
      },
      set(value) {
        this.$store.commit(
          "editor/updateOutputDescription",
          {
            name: this.node.data.name,
            description: value,
          }
        );
      },
    },
    name: {
      get() {
        return this.node.data.name;
      },
      set(value) {
        this.$store.commit(
          "editor/updateOutputName",
          {
            name: this.node.data.name,
            newName: value,
          }
        );
      },
    },
    positionX: {
      get() {
        return this.node.x;
      },
      set(value) {
        const x = parseInt(value, 10);
        if (!Number.isNaN(x)) {
          this.$store.commit(
            "editor/moveOutputNode",
            {
              name: this.node.data.name,
              x,
            }
          );
        }
      },
    },
    positionY: {
      get() {
        return this.node.y;
      },
      set(value) {
        const y = parseInt(value, 10);
        if (!Number.isNaN(y)) {
          this.$store.commit(
            "editor/moveOutputNode",
            {
              name: this.node.data.name,
              y,
            }
          );
        }
      },
    },
  },
  methods: {
    onRemoveStage() {
      this.$store.commit("editor/removeOutput", this.name);
    },
  },
};
</script>
