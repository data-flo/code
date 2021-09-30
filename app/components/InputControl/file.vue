<template>
  <v-text-field
    ref="file-text-field"
    v-bind:hide-details="inline ? true : false"
    v-bind:hint="inline ? undefined : description"
    v-bind:label="label"
    v-bind:name="name"
    v-bind:required="required"
    v-bind:rules="rules"
    outline
    type="file"
    v-on:input="onFileInput"
  />
</template>

<script>
export default {
  props: {
    description: String,
    inline: Boolean,
    label: String,
    name: String,
    required: Boolean,
    rules: Array,
  },
  methods: {
    onFileInput() {
      const target = this.$refs["file-text-field"].$refs.input;
      if (target.files && target.files.length) {
        this.$emit("input", target.files[0]);
      }
    },
  },
};
</script>
