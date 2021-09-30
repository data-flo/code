<template>
  <v-btn
    class="grey--text"
    icon
    v-on:click="$emit('click', $event)"
  >
    <v-icon>{{ icon || "mdi-close" }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  props: {
    icon: String,
  },
};
</script>

<style scoped>
.v-btn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
