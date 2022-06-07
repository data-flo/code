<script>
export default {
  middleware: "authenticated",
  async fetch({ redirect, error, query, $axios }) {
    const view = (Object.keys(query)[0] === "tutorial") ? "tutorial" : "edit";
    try {
      const { id } = await $axios.$post("api/dataflows/create");
      redirect(`/${view}?${id}`);
    }
    catch ({ message }) {
      error({ statusCode: 500, message });
    }
  },
};
</script>
