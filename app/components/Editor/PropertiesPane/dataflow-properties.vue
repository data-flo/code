<template>
  <v-layout column>
    <v-subheader>
      Dataflow Details
    </v-subheader>

    <section>
      <v-layout column>
        <v-text-field
          v-model="name"
          hide-details
          outline
          class="dense"
          label="Name"
        />

        <v-textarea
          v-model="description"
          hide-details
          outline
          label="Description"
        />

        <v-text-field
          v-model="folder"
          hide-details
          outline
          label="Folder"
        />

        <small>
          <a
            href="https://markdown-it.github.io/"
            target="_blank"
            rel="noopener noreferrer"
          >Markdown</a> is supported.
        </small>

        <v-checkbox
          v-model="showDetailedErrors"
          hide-details
          label="Show detailed errors"
        />
      </v-layout>
    </section>

    <v-divider />

    <v-subheader>Access Control</v-subheader>

    <v-radio-group
      v-model="accessMode"
      hide-details
    >
      <v-list
        subheader
        three-line
      >
        <v-list-tile>
          <v-list-tile-action>
            <v-radio
              value="private"
            />
          </v-list-tile-action>
          <v-list-tile-content v-on:click="accessMode = 'private'">
            <v-list-tile-title>Private</v-list-tile-title>
            <v-list-tile-sub-title>Access only by you</v-list-tile-sub-title>
            <!--
            <v-list-tile-sub-title>Access only by you and specific people.</v-list-tile-sub-title>
            -->
          </v-list-tile-content>
        </v-list-tile>
        <!--
        <v-list-tile>
          <v-list-tile-action>
            <v-radio
              value="shared"
            />
          </v-list-tile-action>
          <v-list-tile-content v-on:click="accessMode = 'shared'">
            <v-list-tile-title>Shared</v-list-tile-title>
            <v-list-tile-sub-title>Shared with specific people.</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        -->
        <v-list-tile>
          <v-list-tile-action>
            <v-radio
              value="protected"
            />
          </v-list-tile-action>
          <v-list-tile-content v-on:click="accessMode = 'protected'">
            <v-list-tile-title>Anyone with the link</v-list-tile-title>
            <v-list-tile-sub-title>Anyone who has the link can access.</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile>
          <v-list-tile-action>
            <v-radio
              value="public"
            />
          </v-list-tile-action>
          <v-list-tile-content v-on:click="accessMode = 'public'">
            <v-list-tile-title>Public on the web</v-list-tile-title>
            <v-list-tile-sub-title>Anyone on can find this and access it.</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-radio-group>

    <v-divider />

    <v-subheader>Danger Zone</v-subheader>

    <section>
      <v-dialog width="320">
        <v-btn
          slot="activator"
          block
          outline
          small
        >
          Delete Dataflow
        </v-btn>

        <v-card>
          <v-card-title
            primary-title
            class="headline"
          >
            Delete Confirmation
          </v-card-title>

          <v-card-text>
            This will permanently delete the Dataflow. This action cannot be undone.
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-spacer />
            <v-btn
              flat
              color="primary"
              v-on:click="onDelete"
            >
              Delete
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </section>
  </v-layout>
</template>

<script>
export default {
  computed: {
    accessMode: {
      get() {
        return this.$store.state.editor.access;
      },
      set(value) {
        this.$store.commit("editor/updateAccessControl", value);
      },
    },
    description: {
      get() {
        return this.$store.state.editor.description;
      },
      set(value) {
        this.$store.commit("editor/updateDescription", value);
      },
    },
    folder: {
      get() {
        return this.$store.state.editor.folder;
      },
      set(value) {
        this.$store.commit("editor/updateFolder", value);
      },
    },
    isPrivate: {
      get() {
        return true;
      },
      set(value) {
        if (value) {
          this.$store.commit("editor/updateAccessControl", "private");
        }
      },
    },
    isProtected: {
      get() {
        return this.$store.state.editor.access === "protected";
      },
      set(value) {
        if (value) {
          this.$store.commit("editor/updateAccessControl", "protected");
        }
      },
    },
    isPublic: {
      get() {
        return this.$store.state.editor.access === "public";
      },
      set(value) {
        if (value) {
          this.$store.commit("editor/updateAccessControl", "public");
        }
      },
    },
    showDetailedErrors: {
      get() {
        return this.$store.state.editor.showDetailedErrors;
      },
      set(value) {
        this.$store.commit("editor/updateDataflowProp", { showDetailedErrors: value });
      },
    },
    name: {
      get() {
        return this.$store.state.editor.name;
      },
      set(value) {
        this.$store.commit("editor/updateName", value);
      },
    },
  },
  methods: {
    onDelete() {
      this.$store.dispatch("editor/removeDataflow")
        .then(() => this.$router.push("/transformations"));
    },
  },
};
</script>

<style scoped>
.v-list__tile__content {
  cursor: pointer;
}
.v-list__tile__action {
  justify-content: center;
}
.v-list >>> .v-list__tile {
  height: 80px;
}
</style>

