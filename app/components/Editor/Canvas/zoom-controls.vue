<template>
  <v-text-field
    v-model="scale"
    outline
    append-icon="mdi-magnify-plus"
    class="small"
    prepend-icon="mdi-magnify-minus"
    suffix="%"
    title="Zoom"
    v-on:click:append="zoomIn"
    v-on:click:prepend="zoomOut"
  />
</template>

<script>
export default {
  computed: {
    scale: {
      get() {
        return this.$store.state.editor.scale;
      },
      set(value) {
        const number = parseFloat(value);
        if (!Number.isNaN(number)) {
          this.setScale(value);
        }
      },
    },
  },
  methods: {
    setScale(value) {
      this.$store.commit("editor/setScale", value);
    },
    zoomIn() {
      this.$store.commit("editor/zoomIn");
    },
    zoomOut() {
      this.$store.commit("editor/zoomOut");
    },
  },
};
</script>

<style scoped>
.v-text-field {
  position: absolute;
  bottom: 16px;
  left: 8px;
  width: 100px;
}
</style>
