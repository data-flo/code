<template>
  <div class="edit page">
    <dataflow-editor />
  </div>
</template>

<script>
import DataflowEditor from "~/components/Editor/index.vue";

export default {
  middleware: [
    "authenticated",
  ],
  components: {
    DataflowEditor,
  },
  fetch({ store, query, error }) {
    const identifier = Object.keys(query)[0];
    return Promise.all([
      store.dispatch("transformations/fetchManifests", identifier),
      store.dispatch("editor/fetchManifest", identifier),
    ])
      .catch(({ message }) => error({ statusCode: 500, message }));
  },
};
</script>

<style scoped>
  .edit.page {
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
  }
</style>
