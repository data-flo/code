<template>
  <v-snackbar
    bottom
    left
    v-bind:timeout="0"
    v-bind:value="hasError"
  >
    {{ errorMessage }}
    <v-btn
      flat
      v-on:click="onHide"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import { mapMutations, mapState } from "vuex";

  export default {
    data () {
      return {
        snackbar: false,
        y: 'top',
        x: null,
        mode: '',
        timeout: 6000,
        text: 'Hello, I\'m a snackbar'
      }
    },
    computed: {
      ...mapState("editor", {
        errorMessage: "errorMessage",
      }),
      hasError() {
        return !!this.errorMessage;
      }
    },
    methods: {
      onHide() {
        this.$store.commit("editor/setErrorMessage");
      },
    },
  };
</script>

<style scoped>

</style>
