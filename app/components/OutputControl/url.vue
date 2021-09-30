<template>
  <a
    v-bind:href="value"
    v-bind:title="description"
    rel="noopener"
    target="_blank"
  >
    {{ value }}
  </a>
</template>

<script>
export default {
  props: {
    description: String,
    value: String,
  },
};
</script>
