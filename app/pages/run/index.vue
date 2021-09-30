<template>
  <div>
    <page-title
      v-bind:title="title"
    >
      <template slot="subtitle">
        <span>
          Created: {{ createdAt }}
        </span>
        <span>
          Updated: {{ updatedAt }}
        </span>
      </template>
      <template slot="previous">
        <v-btn
          icon
          title="Edit"
          to="/transformations"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
      <template slot="actions">
        <v-btn
          v-if="dataflow.editable"
          icon
          title="Edit"
          v-bind:to="{ path: '/edit', query: { [dataflow.id]: null } }"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn
          v-if="isAuthenticated"
          v-bind:href="`/api/dataflows/clone/${dataflow.id}`"
          icon
          title="Make a copy"
        >
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
        <v-btn
          download
          v-bind:href="`/api/dataflows/export/${dataflow.id}`"
          icon
          target="_blank"
          title="Export"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </template>
      <template slot="tabs">
        <v-tabs
          v-model="tabs"
          color="primary"
        >
          <v-tabs-slider color="white" />

          <v-tab
            class="primary--text"
            href="#dataflow-info"
          >
            <v-icon>mdi-information-outline</v-icon>&nbsp;Info
          </v-tab>

          <v-tab
            class="primary--text"
            href="#dataflow-run"
          >
            <v-icon>mdi-play-circle-outline</v-icon>&nbsp;Run
          </v-tab>

          <v-tab
            class="primary--text"
            href="#dataflow-api"
          >
            <v-icon>mdi-code-tags</v-icon>&nbsp;API
          </v-tab>
        </v-tabs>
      </template>
    </page-title>

    <v-container>
      <v-alert
        v-bind:value="!isReady"
        outline
        color="error"
        icon="warning"
      >
        This Dataflow is incomplete.
      </v-alert>
      <v-tabs-items
        v-if="isReady"
        v-model="tabs"
      >
        <v-tab-item
          value="dataflow-info"
        >
          <v-card v-if="dataflow.description">
            <v-card-title>
              <h3 class="headline">
                Description
              </h3>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <div
                class="markdown"
                v-html="$md.render(dataflow.description)"
              />
            </v-card-text>
          </v-card>
          <p />
          <v-card>
            <v-card-title>
              <h3 class="headline">
                Inputs
              </h3>
            </v-card-title>
            <v-divider />
            <v-list two-line>
              <v-list-tile
                v-for="arg in dataflow.input"
                v-bind:key="arg.name"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ arg.name }} (<code>{{ arg.type }}</code>)</v-list-tile-title>
                  <v-list-tile-sub-title>{{ arg.description }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
          <p />
          <v-card>
            <v-card-title>
              <h3 class="headline">
                Outputs
              </h3>
            </v-card-title>
            <v-divider />
            <v-list two-line>
              <v-list-tile
                v-for="arg in dataflow.output"
                v-bind:key="arg.name"
              >
                <v-list-tile-content>
                  <v-list-tile-title>{{ arg.name }} (<code>{{ arg.type }}</code>)</v-list-tile-title>
                  <v-list-tile-sub-title>{{ arg.description }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item
          value="dataflow-run"
        >
          <dataflow-runner v-bind:dataflow="dataflow" />
        </v-tab-item>
        <v-tab-item
          value="dataflow-api"
        >
          <v-card>
            <v-card-title>
              <h3 class="headline">
                cURL + bash
              </h3>
            </v-card-title>
            <v-divider />
            <v-card-text>
              <api-code
                v-bind:dataflow="dataflow"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import ApiCode from "~/components/Runner/api-code.vue";
import DataflowRunner from "~/components/Runner/index.vue";
import PageTitle from "~/components/PageTitle/index.vue";

export default {
  layout: "page",
  head() {
    return {
      title: `Data-flo - Run: ${this.title}`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.dataflow.description || "",
        },
      ],
    };
  },
  components: {
    ApiCode,
    DataflowRunner,
    PageTitle,
  },
  data() {
    return {
      tabs: null,
    };
  },
  computed: {
    ...mapGetters({
      dataflow: "runner/get",
      isAuthenticated: "isAuthenticated",
    }),
    createdAt() {
      return new Date(this.dataflow.createdAt).toLocaleString();
    },
    isReady() {
      return (
        this.dataflow.output && this.dataflow.output.length > 0
      );
    },
    title() {
      return this.dataflow.name || `Untitled Dataflow (${this.dataflow.id})`;
    },
    updatedAt() {
      return new Date(this.dataflow.updatedAt).toLocaleString();
    },
  },
  fetch({ store, query, error }) {
    return store.dispatch("runner/fetch", Object.keys(query)[0])
      .catch(({ message }) => {
        error({ statusCode: 500, message });
      });
  },
};
</script>

<style scoped>
.headline {
  font-family: 'Saira Semi Condensed', sans-serif !important;
}
.subtitle {
  display: inline;
}
pre.api {
  overflow: auto;
  white-space: pre-wrap;
}
</style>
