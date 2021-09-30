<template>
  <v-toolbar-items>
    <v-btn
      flat
      v-on:click="toggleShareDialog"
    >
      Share
    </v-btn>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title primary-title>
          <h2 class="title">
            Share
          </h2>
        </v-card-title>
        <v-list subheader>
          <v-list-tile
            avatar
            ripple
            v-on:click="copyToClipboard('runUrl')"
          >
            <v-list-tile-avatar>
              <v-icon>
                mdi-content-copy
              </v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Run URL</v-list-tile-title>
              <v-list-tile-sub-title>{{ runUrl }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            avatar
            ripple
            v-on:click="copyToClipboard('apiCode')"
          >
            <v-list-tile-avatar>
              <v-icon>
                mdi-content-copy
              </v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Curl command</v-list-tile-title>
              <v-list-tile-sub-title>{{ apiCode }}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            v-on:click="toggleShareDialog"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar-items>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    ...mapState("editor", {
      dataflowId: "id",
      dataflowManifest: "manifest",
    }),
    apiCode() {
      return this.curlGenerator(this.dataflowId, this.dataflowManifest.input);
    },
    runUrl() {
      return `${this.$axios.defaults.baseURL}run?${this.dataflowId}`;
    },
  },
  methods: {
    toggleShareDialog() {
      this.dialog = !this.dialog;
    },
    async copyToClipboard(target) {
      if (process.client) {
        const permission = await navigator.permissions.query({ name: "clipboard-write" });
        if (permission.state === "granted" || permission.state === "prompt") {
          await navigator.clipboard.writeText(this[target]);
        } else {
          console.warn("Unable to copy due to permissions error.");
        }
      }
    },
  },
};
</script>
