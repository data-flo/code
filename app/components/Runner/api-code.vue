<template>
  <pre>{{ apiCode }}</pre>
</template>

<script>
export default {
  props: {
    dataflow: Object,
  },
  computed: {
    apiCode() {
      const code = [];
      code.push("curl --request POST \\\n");
      if (this.user && this.user.apiAccessToken) {
        code.push(`  --header "access-token: ${this.user.apiAccessToken}" \\\n`);
      }
      for (const arg of (this.dataflow.input || [])) {
        if (arg.type === "file") {
          code.push(`  --form "${arg.name}"=@path/to/file \\`);
        } else {
          code.push(`  --form "${arg.name}"="insert value" \\`);
        }
        code.push("\n");
      }
      code.push(`  ${this.$axios.defaults.baseURL}api/dataflows/run/${this.dataflow.id}`);
      return code.join("");
    },
    user() {
      return this.$store.state.user;
    },
  },
};
</script>

<style scoped>
pre {
  overflow: auto;
  white-space: pre-wrap;
}
</style>
