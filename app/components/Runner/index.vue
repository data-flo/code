<template>
  <div>
    <v-stepper
      v-model="step"
      vertical
    >
      <v-stepper-step
        v-bind:complete="step > 1"
        class="step-title"
        step="1"
      >
        Inputs
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-form v-model="isFormValid">
          <input-control
            v-for="(arg, index) in dataflow.input"
            v-bind:key="index"
            v-model="formValues[arg.name]"
            v-bind:description="arg.description"
            v-bind:enum-values="arg.enum"
            v-bind:label="arg.name"
            v-bind:name="arg.name"
            v-bind:required="arg.required"
            v-bind:type="arg.type"
          />
        </v-form>
        <v-btn
          v-bind:disabled="!isFormValid"
          color="primary"
          v-on:click="submitForm"
        >
          Run
        </v-btn>
      </v-stepper-content>

      <v-stepper-step
        v-bind:complete="step > 2"
        v-bind:rules="[ () => !hasErrors ]"
        class="step-title"
        step="2"
      >
        Run
        <small v-if="hasErrors">An error has occurred</small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-layout
          v-if="isRunning"
          align-center
          fill-height
          justify-center
          row
        >
          <v-progress-circular
            v-bind:size="70"
            v-bind:width="7"
            indeterminate
            color="purple"
          />
        </v-layout>
        <div v-if="hasErrors">
          <p>{{ errorMessage }}</p>
          <v-btn
            color="primary"
            v-on:click="resetForm"
          >
            Try again
          </v-btn>
        </div>
      </v-stepper-content>

      <v-stepper-step
        class="step-title"
        step="3"
      >
        Outputs
      </v-stepper-step>

      <v-stepper-content
        v-bind:complete="step === 3"
        step="3"
      >
        <p>
          <v-btn
            color="primary"
            v-on:click="resetForm"
          >
            Run again
          </v-btn>
        </p>
        <div
          v-for="arg in dataflow.output"
          v-bind:key="arg.name"
          class="output"
        >
          <span>
            <strong>{{ arg.name }}</strong>. {{ arg.description }}
          </span>
          <output-control
            v-bind:description="arg.description"
            v-bind:name="arg.name"
            v-bind:type="arg.type"
            height="70vh"
            v-bind:value="results[arg.name]"
          />
        </div>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
import InputControl from "~/components/InputControl/index.vue";
import OutputControl from "~/components/OutputControl/index.vue";

export default {
  components: {
    InputControl,
    OutputControl,
  },
  props: {
    dataflow: Object,
  },
  data() {
    return {
      formValues: {},
      hasErrors: false,
      isFormValid: false,
      isRunning: false,
      results: {},
      step: 1,
    };
  },
  methods: {
    submitForm() {
      this.step = 2;
      this.isRunning = true;
      this.hasErrors = false;
      const formData = new FormData();
      for (const argument of this.dataflow.input) {
        const value = this.formValues[argument.name];
        if (typeof value !== "undefined" && value !== "") {
          formData.append(argument.name, value);
        }
      }
      this.$axios.$post(`/api/dataflows/run/${this.dataflow.id}`, formData)
        .then((response) => {
          this.isRunning = false;
          this.results = response;
          this.step = 3;
        })
        .catch((err) => {
          this.isRunning = false;
          this.hasErrors = true;
          this.errorMessage = err.response.data.error;
        });
    },
    resetForm() {
      this.step = 1;
      this.isRunning = false;
      this.hasErrors = false;
      this.errorMessage = null;
      this.results = {};
    },
  },
};
</script>

<style scoped>
.step-title {
  font-family: 'Saira Semi Condensed', sans-serif !important;
}
.output {
  margin-bottom: 16px;
}
</style>
