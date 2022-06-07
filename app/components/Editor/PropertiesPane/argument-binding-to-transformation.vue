<template>
  <div>
    <v-subheader>
      Source value
    </v-subheader>

    <section v-if="!binding.transformation">
      Select an output argument from another adaptor to create a connection.
    </section>

    <section v-else>
      Value of
      <strong>{{ binding.argument }}</strong> in
      <strong>{{ selectedStageManifest.data.description }}</strong>.
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "StageArgumentInfo",
  computed: {
    ...mapGetters({
      binding: "editor/selectedArgumentBinding",
      selectedStageManifest: "editor/selectedTransformation",
    }),
  },
};
</script>
