<template>
  <v-toolbar-items>
    <v-menu
      bottom
      left
      offset-y
    >
      <template v-slot:activator="{ on }">
        <v-btn
          aria-valuetitle="Help"
          flat
          v-on="on"
        >
          Help
        </v-btn>
      </template>
      <v-list>
        <v-list-tile
          v-if="$device.isDesktop"
          v-on:click="toggleDialog"
        >
          <v-list-tile-title>
            Keyboard shortcuts
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          target="_blank"
          rel="noopener noreferrer"
          href="/create?tutorial"
        >
          <v-list-tile-title>
            Start Tutorial
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          target="_blank"
          rel="noopener noreferrer"
          href="https://gitlab.com/cgps/data-flo-io/issues/new"
        >
          <v-list-tile-title>
            Report an Issue
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title primary-title>
          <h2 class="title">
            Cheat Sheet
          </h2>
        </v-card-title>

        <v-card-title>
          <dl
            v-for="(item, index) in shortcuts"
            v-if="item.label"
            v-bind:key="index"
          >
            <dt>
              <kbd v-if="item.modifier">{{ item.modifier === 'ctrlOrCmdKey' ? ctrlOrCmdKey : item.modifier }}</kbd>
              <p v-if="item.modifier">+</p>
              <kbd>{{ item.keyLabel || item.key }}</kbd>
            </dt>
            <dd>
              {{ item.label }}
            </dd>
          </dl>
        </v-card-title>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            v-on:click="toggleDialog"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar-items>
</template>

<script>
/* eslint vue/no-use-v-if-with-v-for: 0 */
/* eslint vue/singleline-html-element-content-newline: 0 */

import { mapGetters, mapState } from "vuex";

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
    ...mapGetters({
      shortcuts: "editor/shortcuts",
    }),
    ctrlOrCmdKey() {
      return this.$device.isMacOS ? "Cmd" : "Ctrl";
    },
  },
  methods: {
    toggleDialog() {
      this.dialog = !this.dialog;
    },
  },
};
</script>

<style scoped>
dl {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 3px auto;
}

dl dt {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
}

dl dt p {
  margin: 0 5px;
}

kbd {
  padding: 0px 5px;
  border-radius: 3px;
  background: rgb(243, 243, 243);
  border: 1px solid #ccc;
  color: #242729;
}
</style>
