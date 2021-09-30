<template>
  <v-btn
    v-bind:disabled="$nuxt.isOffline"
    flat
    title="Save changes"
    v-on:click="save"
  >
    <v-icon v-show="!isSaving">
      mdi-content-save
    </v-icon>
    <v-progress-circular
      v-show="isSaving"
      v-bind:size="24"
      indeterminate
      color="white"
    />
  </v-btn>
</template>

<script>
import { mapState } from "vuex";
import debounce from "lodash.debounce";

export default {
  data() {
    return {
      isSaving: false,
    };
  },
  computed: {
    ...mapState("editor", [
      "access",
      "description",
      "manifest",
      "name",
    ]),
  },
  watch: {
    description: {
      handler() {
        this.debouncedSave();
      },
    },
    access: {
      handler() {
        this.debouncedSave();
      },
    },
    manifest: {
      handler() {
        this.debouncedSave();
      },
      deep: true,
    },
    name: {
      handler() {
        this.debouncedSave();
      },
    },
  },
  created() {
    this.debouncedSave = debounce(this.save, 3000);
  },
  methods: {
    save() {
      if (this.$nuxt.isOffline) {
        return;
      }
      this.isSaving = true;
      this.$store.dispatch("editor/updateManifest")
        .then(() =>
          setTimeout(() => { this.isSaving = false; }, 500)
        );
    },
  },
};
</script>
