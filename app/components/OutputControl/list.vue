<template>
  <ol>
    <li
      v-for="(item, index) in value"
      v-bind:key="index"
    >
      {{ item }}
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    description: String,
    value: Array,
  },
};
</script>

<style scoped>
ol {
  padding-left: 48px;
}
</style>
