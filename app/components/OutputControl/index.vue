<template>
  <component
    v-bind:is="currentInputComponent"
    v-bind:description="description"
    v-bind:height="height"
    v-bind:name="name"
    v-bind:value="value"
  />
</template>

<script>
import collection from "./collection.vue";
import datatable from "./datatable.vue";
import file from "./file.vue";
import list from "./list.vue";
import map from "./map.vue";
import text from "./text.vue";
import url from "./url.vue";

const editors = {
  collection,
  datatable,
  file,
  list,
  map,
  text,
  url,
};

export default {
  name: "OutputControl",
  props: {
    description: String,
    height: String,
    name: String,
    type: String,
    value: null,
  },
  computed: {
    currentInputComponent() {
      return editors[this.type] || text;
    },
  },
};
</script>
