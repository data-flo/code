<template>
  <div>
    <page-title title="Import Dataflow">
      <template slot="subtitle">
        Chose a Dataflow manifest file to import
      </template>
      <template slot="previous">
        <v-btn
          icon
          title="Edit"
          to="/transformations"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
    </page-title>

    <v-container>
      <v-form v-model="isFormValid">
        <input-control
          v-model="manifestFile"
          required
          label="file"
          name="file"
          type="file"
        />
      </v-form>
      <p>
        <v-btn
          v-bind:disabled="!isFormValid"
          color="primary"
          v-on:click="submitForm"
        >
          Import
        </v-btn>
      </p>
      <v-alert
        v-bind:value="hasErrors"
        outline
        color="error"
        icon="warning"
      >
        {{ errorMessage }}
      </v-alert>
    </v-container>
  </div>
</template>

<script>
import InputControl from "~/components/InputControl/index.vue";
import PageTitle from "~/components/PageTitle/index.vue";

export default {
  layout: "page",
  middleware: "authenticated",
  head() {
    return {
      title: "Data-flo - Import",
    };
  },
  components: {
    InputControl,
    PageTitle,
  },
  data() {
    return {
      manifestFile: null,
      isFormValid: false,
      isRunning: false,
      hasErrors: false,
      errorMessage: null,
    };
  },
  methods: {
    submitForm() {
      this.isRunning = true;
      this.hasErrors = false;
      const formData = new FormData();
      formData.append("manifest", this.manifestFile);
      this.$axios.$post("/api/dataflows/import", formData)
        .then((response) => {
          this.isRunning = false;
          this.$router.push(`/edit?${response.id}`);
        })
        .catch((err) => {
          this.isRunning = false;
          this.hasErrors = true;
          this.errorMessage = err.response.data.error.message;
        });
    },
  },
};
</script>

<style scoped>
.v-btn {
  margin: 0;
}
</style>
