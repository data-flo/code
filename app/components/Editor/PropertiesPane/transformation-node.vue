<template>
  <v-layout column>
    <v-subheader>
      {{ node.data.type }}
    </v-subheader>

    <section>
      <nuxt-link
        v-if="node.data.type === 'dataflow'"
        v-bind:to="{ path: '/run', query: { [node.data.dataflow]: null } }"
        target="_blank"
      >
        {{ node.data.displayName }}
      </nuxt-link>
      <strong
        v-if="node.data.type === 'adaptor'"
      >
        {{ node.data.adaptor }}
      </strong>
      <div
        v-if="node.data.information"
        v-html="$md.render(node.data.information)"
      />
    </section>

    <v-divider />

    <v-subheader>UI</v-subheader>

    <section>
      <v-layout column>
        <v-text-field
          v-model="description"
          hide-details
          outline
          class="dense"
          label="Description"
        />

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
      node: "editor/selectedTransformation",
    }),
    description: {
      get() {
        return this.node.data.description;
      },
      set(value) {
        this.$store.commit(
          "editor/updateTransformationDescription",
          {
            transformation: this.node.data.name,
            description: value,
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
            "editor/moveTransformationNode",
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
            "editor/moveTransformationNode",
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
      this.$store.commit(
        "editor/removeTransformation",
        this.node.data.name
      );
    },
  },
};
</script>
