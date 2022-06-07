<template>
  <div v-if="!!value">
    <a
      v-if="value.data"
      v-bind:download="value.name"
      v-bind:href="href"
      title="Click to save"
    >
      {{ value.name }}
      &nbsp;
      ({{ formattedBytes }})
    </a>
    <span v-else>
      File name: {{ value.name }}
    </span>
  </div>
</template>

<script>
/* eslint no-restricted-properties: 0 */

export default {
  props: {
    description: String,
    value: Object,
  },
  computed: {
    href() {
      return `data:${this.value.mediaType};base64,${this.value.data}`;
    },
    formattedBytes() {
      return this.formatBytes(this.value.size);
    },
  },
  methods: {
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    },
  },
};
</script>
