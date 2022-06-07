<template>
  <div>
    <textarea
      ref="text"
      v-model="valueAsJson"
      readonly
      rows="8"
    />
    <button
      title="Copy to clipboard"
      v-on:click="copyTextArea"
    >
      <v-icon>mdi-clipboard-text-outline</v-icon>
    </button>
    <button
      title="Save content"
      v-on:click="saveAs"
    >
      <v-icon>mdi-content-save</v-icon>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    description: String,
    name: String,
    value: null,
  },
  computed: {
    valueAsJson() {
      return (
        this.value && this.value.entries ?
          JSON.stringify(this.value.entries, null, 2) :
          null
      );
    },
  },
  methods: {
    copyTextArea() {
      this.$refs.text.select();
      document.execCommand("copy");
    },
    saveAs() {
      const windowURL = window.URL || window.webkitURL;
      const blob = new Blob(
        [ this.value ],
        { type: "text/plain;charset=utf-8" }
      );
      const dataUrl = windowURL.createObjectURL(blob);
      const anchor = document.createElement("a");
      if (typeof anchor.download !== "undefined") {
        anchor.download = `dataflo-${this.name}.json`;
        anchor.href = dataUrl;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      } else {
        document.location.href = dataUrl;
      }
    },
  },
};
</script>

<style scoped>
div {
  position: relative;
}
textarea {
  resize: both;
  border-color: #000;
  border-style: solid;
  border-width: 2px;
  border-radius: 4px;
  padding: 8px;
  min-width: 100%;
  width: 100%;
  max-width: 100%;
  font-size: 11px;
  font-family: monospace;
}
button {
  position: absolute;
  top: 4px;
  right: 4px;
  display: none;
}
button + button {
  right: 28px;
}
div:hover > button {
  display: block;
}
</style>
