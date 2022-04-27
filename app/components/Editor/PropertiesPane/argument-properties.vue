<template>
  <v-layout
    v-tutorial-anchor-value="{
      key: 'argument-selection',
      id: anchorValueId,
      value: argument.name,
    }"
    column
  >
    <v-subheader>
      Argument:&nbsp;<strong>{{ argument.name }}</strong>
    </v-subheader>

    <section>
      <p>
        Data type: <code>{{ argument.type }}</code>
      </p>
      <div
        v-if="argument.description"
        v-html="$md.render(argument.description)"
      />
    </section>

    <v-divider />

    <template v-if="selection.direction === 'in'">
      <v-subheader>
        Binding type
      </v-subheader>
      <section>
        <v-radio-group
          v-model="inputBindingType"
          v-tutorial-anchor-value="{
            key: 'binding-type',
            id: anchorValueId,
            value: inputBindingType,
          }"
          hide-details
        >
          <v-radio
            v-tutorial-anchor.arrow.left="{
              key: 'binding-type-input',
              id: anchorId,
            }"
            label="Bind to a Dataflow input"
            value="input"
          />
          <v-radio
            v-tutorial-anchor.arrow.left="{
              key: 'binding-type-value',
              id: anchorId,
            }"
            v-bind:disabled="argument.type === 'file'"
            label="Bind to a value"
            value="value"
          />
          <v-radio
            label="Bind to another transformation"
            value="transformation"
          />
        </v-radio-group>
      </section>


      <v-divider />

      <input-binding v-if="binding && binding.type === 'input'" />
      <value-binding v-else-if="binding && binding.type === 'value'" />
      <transformation-binding v-else-if="binding && binding.type === 'transformation'" />

      <v-divider />

      <section v-if="binding">
        <v-btn
          block
          outline
          small
          v-on:click="onRemoveBinding"
        >
          <v-icon left>
            mdi-delete
          </v-icon>
          Remove Binding
        </v-btn>
      </section>
    </template>

    <template v-else-if="selection.direction === 'out'">
      <section>
        <v-layout column>
          <v-checkbox
            v-model="markAsOutput"
            v-tutorial-anchor.arrow.left="{
              key: 'binding-type-output',
              id: anchorId,
            }"
            v-tutorial-anchor-value="{
              key: 'binding-type-output',
              id: anchorValueId,
              value: markAsOutput,
            }"
            hide-details
            label="Mark as a Dataflow output"
          />
        </v-layout>
      </section>
    </template>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import InputBinding from "./argument-binding-to-input.vue";
import TransformationBinding from "./argument-binding-to-transformation.vue";
import ValueBinding from "./argument-binding-to-value.vue";

export default {
  components: {
    InputBinding,
    TransformationBinding,
    ValueBinding,
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
    inputBindingType: {
      get() {
        return this.binding ? this.binding.type : null;
      },
      set(value) {
        this.$store.commit(
          "editor/updateArgumentBindingType",
          {
            transformation: this.selection.transformation,
            argument: this.selection.argument,
            type: value,
          }
        );
      },
    },
    markAsOutput: {
      get() {
        return this.binding;
      },
      set(value) {
        if (value) {
          this.$store.commit(
            "editor/addOutputVariable",
            {
              transformation: this.selection.transformation,
              argument: this.selection.argument,
              type: this.argument.type,
              description: this.argument.description,
            }
          );
        } else {
          this.$store.commit(
            "editor/removeOutput",
            this.binding.output
          );
        }
      },
    },
  },
  methods: {
    onRemoveBinding() {
      this.$store.commit(
        "editor/removeArgumentBinding",
        {
          transformation: this.selection.transformation,
          argument: this.selection.argument,
        }
      );
    },
  },
};
</script>

<style scoped>
.v-input.v-input--selection-controls {
  margin-top: 0;
  margin-right: -16px;
}
</style>
