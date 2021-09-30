<template>
  <div>
    <page-title
      title="Transformations"
    >
      <template slot="actions">
        <v-text-field
          v-show="showSearch"
          ref="search-textfield"
          clearable
          color="white"
          v-bind:value="searchTerm"
          v-on:input="onSearchChange"
        />
        <v-btn
          icon
          title="Search"
          v-on:click="toggleShowSearch"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </template>
      <template slot="tabs">
        <div class="v-tabs">
          <div class="v-tabs__bar theme--dark primary">
            <div class="v-tabs__wrapper">
              <div class="v-tabs__container">
                <div
                  class="v-tabs__slider-wrapper"
                  style="left: 0px; width: 126px;"
                >
                  <div class="v-tabs__slider white" />
                </div>
                <div class="v-tabs__div primary--text">
                  <nuxt-link
                    class="v-tabs__item v-tabs__item--active"
                    to="/transformations/dataflows"
                  >
                    <i class="v-icon mdi mdi-animation-play-outline theme--dark" />
                    &nbsp;
                    Dataflows
                  </nuxt-link>
                </div>
                <div class="v-tabs__div primary--text">
                  <nuxt-link
                    class="v-tabs__item"
                    to="/transformations/adaptors"
                  >
                    <i class="v-icon mdi mdi-play-box-outline theme--dark" />
                    &nbsp;
                    Adaptors
                  </nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </page-title>

    <v-container>
      <template v-if="dataflowGroups.length === 0">
        No Dataflows.
      </template>
      <template v-else-if="dataflowGroups.length">
        <sort-by-menu
          v-model="sortDataflowsBy"
          v-bind:items="dataflowSorts"
        />
        <template v-for="group in dataflowGroups">
          <v-subheader v-bind:key="`header-${group.label}`">
            {{ group.label }}
          </v-subheader>
          <v-list v-bind:key="`list-${group.label}`">
            <v-list-tile
              v-for="item in group.items"
              v-bind:key="item.id"
              avatar
              tag="div"
            >
              <v-list-tile-avatar>
                <v-icon v-bind:title="item.public ? 'Public' : 'Private'">
                  {{ item.public ? 'mdi-earth' : 'mdi-lock' }}
                </v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title>Created: {{ item.localeCreated }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn
                  v-if="item.editable"
                  v-bind:to="{ path: '/edit', query: { [item.id]: null } }"
                  class="v-btn v-btn--icon theme--light"
                  title="Edit"
                  v-on:click.stop=""
                >
                  <v-icon color="grey lighten-1">
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-list-tile-action>

              <nuxt-link
                v-bind:to="{ path: '/run', query: { [item.id]: null } }"
                class="overlay-link"
                title="Details"
              />
            </v-list-tile>
          </v-list>
        </template>
      </template>
    </v-container>

    <v-btn
      dark
      fab
      bottom
      right
      fixed
      color="primary"
      to="/create"
    >
      <v-icon>mdi-plus</v-icon>
      <v-icon>close</v-icon>
    </v-btn>

    <v-speed-dial
      v-model="fab"
      fab
      bottom
      right
      fixed
      xopen-on-hover
      transition="slide-y-reverse-transition"
    >
      <v-btn
        slot="activator"
        v-model="fab"
        dark
        fab
        color="primary"
      >
        <v-icon>mdi-plus</v-icon>
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-btn
        dark
        fab
        small
        data-label="New Dataflow"
        to="/create"
      >
        <v-icon>mdi-pipe</v-icon>
      </v-btn>
      <v-btn
        dark
        fab
        small
        data-label="Import"
        to="/import"
      >
        <v-icon>mdi-upload</v-icon>
      </v-btn>
    </v-speed-dial>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import PageTitle from "~/components/PageTitle/index.vue";
import SortByMenu from "~/components/SortByMenu/index.vue";

export default {
  layout: "page",
  head() {
    return {
      title: "Dataflows",
    };
  },
  components: {
    PageTitle,
    SortByMenu,
  },
  data() {
    return {
      adaptorSorts: [
        { label: "Name", value: "name" },
        { label: "Category", value: "category" },
      ],
      fab: false,
      dataflowSorts: [
        { label: "Folder", value: "folder" },
        { label: "Name", value: "name" },
        { label: "Creation date/time", value: "created" },
        { label: "Modification date/time", value: "updated" },
        { label: "Access type", value: "access" },
      ],
      tabs: null,
      showSearch: false,
    };
  },
  computed: {
    ...mapGetters({
      dataflowGroups: "transformations/groupedDataflows",
    }),
    ...mapState("transformations", {
      searchTerm: "searchTerm",
    }),
    sortDataflowsBy: {
      get() {
        return this.$store.state.transformations.sortDataflowsBy;
      },
      set(value) {
        this.$store.commit("transformations/sortDataflowsBy", value);
      },
    },
  },
  fetch({ store, error }) {
    return store.dispatch("transformations/fetchDataflows")
      .catch(({ message }) => error({ statusCode: 500, message }));
  },
  methods: {
    onSearchChange(value) {
      this.$store.commit("transformations/setSearchTerm", value);
    },
    toggleShowSearch() {
      this.showSearch = !this.showSearch;
      if (this.showSearch) {
        this.$nextTick(() => this.$refs["search-textfield"].focus());
      }
    },
  },
};
</script>

<style scoped>
.v-menu.v-menu--inline {
  float: right;
}

.v-list {
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.24);
}
.v-list >>> .v-list__tile:hover {
  background: rgba(0,0,0,.04);
}
.v-list >>> a,
.v-list >>> [title] {
  z-index: 1;
}
.overlay-link {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  text-indent: 200%;
  white-space: nowrap;
  background: rgba(0, 0, 0, 0);
}
a.overlay-link {
  position: absolute;
  z-index: 0 !important;
  opacity: 0;
}

.v-btn--floating {
  overflow: visible;
}
.v-btn--floating::after {
  text-align: right;
  position: absolute;
  right: 48px;
  top: 0;
  height: 40px;
  width: 100px;
  content: attr(data-label);
  color: rgba(0,0,0,0.87);
  opacity: 1;
  line-height: 40px;
}
</style>
