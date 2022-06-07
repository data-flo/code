<template>
  <v-layout column>
    <v-subheader>
      Input Details
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
          v-model="typeName"
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

    <section v-if="typeDef.hasEnum">
      <input-control
        v-model="enumValues"
        type="list"
        inline
        name="Allowed Values"
      />
    </section>

    <v-divider />

    <v-subheader>Default Value</v-subheader>

    <section>
      <v-radio-group
        v-model="requiredValue"
        hide-details
      >
        <v-radio value="required">
          <div slot="label">
            A value is <strong>required</strong>
          </div>
        </v-radio>
        <v-radio value="optional">
          <div slot="label">
            <strong>Optional</strong> without a default
          </div>
        </v-radio>
        <v-radio
          v-bind:disabled="!typeDef.assignable"
          value="default"
        >
          <div slot="label">
            Optional with a <strong>default value</strong>
          </div>
        </v-radio>
      </v-radio-group>
    </section>

    <section v-if="hasDefaultValue">
      <input-control
        v-model="defaultValue"
        v-bind:type="node.data.type"
        inline
        name="Default value"
      />
    </section>

    <section v-if="hasDefaultValue">
        <v-checkbox
          v-model="isSecret"
          label="Treat default value as secret"
        ></v-checkbox>
    </section>

    <v-divider />

    <v-subheader>UI</v-subheader>

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
import InputControl from "~/components/InputControl/index.vue";

export default {
  components: {
    InputControl,
  },
  computed: {
    ...mapGetters({
      dataTypeNames: "types/names",
      node: "editor/selectedTransformation",
      typesByName: "types/byName",
    }),
    defaultValue: {
      get() {
        return this.node.data.defaultValue;
      },
      set(value) {
        this.$store.commit(
          "editor/updateInputDefaultValue",
          {
            name: this.node.data.name,
            value,
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
          "editor/updateInputDescription",
          {
            name: this.node.data.name,
            description: value,
          }
        );
      },
    },
    enumValues: {
      get() {
        return this.node.data.enum;
      },
      set(value) {
        this.$store.commit(
          "editor/updateInputEnum",
          {
            name: this.node.data.name,
            value,
          }
        );
      },
    },
    isSecret: {
      get() {
        return this.node.data.isSecret;
      },
      set(value) {
        this.$store.commit(
          "editor/updateInputSecret",
          {
            name: this.node.data.name,
            value,
          }
        );
      },
    },
    hasDefaultValue() {
      return this.typeDef.assignable && this.requiredValue === "default";
    },
    name: {
      get() {
        return this.node.data.name;
      },
      set(value) {
        this.$store.commit(
          "editor/updateInputName",
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
            "editor/moveInputNode",
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
            "editor/moveInputNode",
            {
              name: this.node.data.name,
              y,
            }
          );
        }
      },
    },
    requiredValue: {
      get() {
        if (this.node.data.isRequired) {
          return "required";
        } else if (this.node.data.defaultValue === null) {
          return "optional";
        } else {
          return "default";
        }
      },
      set(value) {
        this.$store.commit(
          "editor/updateInputRequiredValue",
          {
            name: this.node.data.name,
            isRequired: (value === "required"),
            defaultValue: (value === "optional") ? null : this.typeDef.default,
          }
        );
      },
    },
    typeDef() {
      return this.typesByName[this.node.data.type];
    },
    typeName: {
      get() {
        return this.node.data.type;
      },
      set(value) {
        this.$store.commit(
          "editor/updateInputDatatype",
          {
            name: this.node.data.name,
            value,
          }
        );
      },
    },
  },
  methods: {
    onRemoveStage() {
      this.$store.commit("editor/removeInput", this.name);
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
