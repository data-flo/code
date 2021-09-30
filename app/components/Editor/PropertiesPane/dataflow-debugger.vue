<template>
  <v-layout
    class="debugger"
    column
  >
    <close-button
      v-bind:icon="(info && info.status) ? 'mdi-refresh' : 'mdi-close'"
      v-on:click="toggleDebuggerMode"
    />
    <v-subheader>
      Dataflow Debugger
    </v-subheader>

    <section
      v-show="info === null"
    >
      <v-form v-model="isFormValid">
        <input-control
          v-for="(arg, index) in dataflowManifest.input"
          v-bind:key="index"
          v-model="formValues[arg.name]"
          v-bind:enum-values="arg.enum"
          v-bind:label="arg.description"
          v-bind:name="arg.name"
          v-bind:required="typeof (arg.default) === 'undefined'"
          v-bind:type="arg.type"
        />
      </v-form>
      <p>
        <v-btn
          v-bind:disabled="!isFormValid"
          outline
          small
          style="margin: 0;"
          v-on:click="submitForm"
        >
          Run
        </v-btn>
      </p>
    </section>

    <section
      v-if="info && info.running === true"
      class="text-xs-center"
    >
      <v-progress-circular
        v-bind:size="70"
        v-bind:width="7"
        indeterminate
        color="purple"
      />
    </section>

    <template v-else-if="info && info.status">
      <template
        v-if="selection && selection.argument && selectedArgumentValue"
      >
        <output-control
          v-bind:description="argument.description"
          v-bind:name="argument.name"
          v-bind:type="argument.type"
          v-bind:value="selectedArgumentValue"
        />
      </template>

      <div v-else-if="selection && selection.transformation">
        <p v-if="selectedStep && selectedStep.error">
          Step failed with error: {{ info.error }}.
        </p>
        <p v-else-if="selectedStep && selectedStep.duration">
          Step ran successfully in: {{ formatDuration(selectedStep.duration) }}.
        </p>
        <p v-else>
          Step did not run.
        </p>
      </div>

      <div
        v-else-if="info.error"
      >
        Dataflow failed with error: {{ info.error }}.
      </div>

      <div v-else>
        Dataflow ran successfully in: {{ formatDuration(info.duration) }}.
      </div>

    </template>
  </v-layout>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import CloseButton from "~/components/CloseButton.vue";
import InputControl from "~/components/InputControl/index.vue";
import OutputControl from "~/components/OutputControl/index.vue";

export default {
  components: {
    CloseButton,
    InputControl,
    OutputControl,
  },
  data() {
    return {
      formValues: {},
      isFormValid: false,
      results: {},
      info: null,
    };
  },
  computed: {
    ...mapState("editor", {
      dataflowId: "id",
      dataflowManifest: "manifest",
    }),
    ...mapGetters({
      nodeDescriptions: "editor/transformationNodeDescriptions",
      selection: "editor/selection",
      node: "editor/selectedTransformation",
      argument: "editor/selectedArgument",
    }),
    selectedStep() {
      if (this.selection.transformation) {
        return this.info.steps.find((x) => x.transformation === this.selection.transformation);
      }
      else {
        return null;
      }
    },
    selectedArgumentValue() {
      if (this.selectedStep) {
        if (this.selection.direction === "out") {
          return this.selectedStep.outputs[this.selection.argument];
        }
        if (this.selection.direction === "in") {
          return this.selectedStep.inputs[this.selection.argument];
        }
      }
      return null;
    },
  },
  methods: {
    toggleDebuggerMode() {
      if (this.info && this.info.status) {
        this.info = null;
      }
      else {
        this.$store.commit("editor/toggleDebuggerMode");
      }
    },
    formatDuration(duration) {
      if (duration < 1) {
        return "< 1 ms";
      }
      else if (duration < 1000) {
        return `${Math.round(duration)} ms`;
      }
      else if (duration < 60000) {
        return `${(duration / 1000).toFixed(1)} s`;
      }
      else {
        return `${(duration / 60000).toFixed(1)} s`;
      }
    },
    submitForm() {
      const formData = new FormData();
      for (const argument of this.dataflowManifest.input) {
        const value = this.formValues[argument.name];
        if (value !== undefined) {
          formData.append(argument.name, value);
        }
      }

      this.info = { running: true };
      this.$store.dispatch("editor/updateManifest")
        .then(() => this.$axios.$post(`/api/dataflows/run/${this.$store.state.editor.id}/?debug=true`, formData))
        .then((response) => {
          this.info = response;
          const dict = {};
          if (this.info && this.info.steps) {
            for (const item of this.info.steps) {
              dict[item.transformation] = item.status;
            }
          }
          this.$store.commit("editor/setDebugInfo", dict);
        })
        .catch((err) => console.error(err));
    },
  },
};
</script>

<style scoped>
.debugger {
  height: 100%;
  padding: 0 16px 16px 16px;
  position: relative;
  width: 100%;
}
.v-subheader {
  height: 40px;
  padding: 0;
}
code {
  min-width: 100%;
  box-shadow: none;
}
</style>
