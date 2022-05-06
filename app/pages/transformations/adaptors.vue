<template>
  <div>
    <page-title title="Transformations">
      <template slot="tabs">
        <div class="v-tabs">
          <div class="v-tabs__bar theme--dark primary">
            <div class="v-tabs__wrapper">
              <div class="v-tabs__container">
                <div
                  class="v-tabs__slider-wrapper"
                  style="left: 126px; width: 119px;"
                >
                  <div class="v-tabs__slider white" />
                </div>
                <div class="v-tabs__div primary--text">
                  <nuxt-link
                    class="v-tabs__item"
                    to="/transformations/dataflows"
                  >
                    <i class="v-icon mdi mdi-animation-play-outline theme--dark" />
                    &nbsp;
                    Dataflows
                  </nuxt-link>
                </div>
                <div class="v-tabs__div primary--text">
                  <nuxt-link
                    class="v-tabs__item v-tabs__item--active"
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
      <template v-if="adaptorGroups.length === 0">
        No Adaptors.
      </template>
      <template v-else-if="adaptorGroups.length">
        <template v-for="group in adaptorGroups">
          <v-subheader v-bind:key="`header-${group.label}`">
            {{ group.label }}
          </v-subheader>
          <v-list v-bind:key="`list-${group.label}`">
            <v-list-tile
              v-for="item in group.items"
              v-bind:key="item.id"
              avatar
            >
              <v-list-tile-avatar>
                <v-icon>{{ categoryIcons[item.category] }}</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.description }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action />
            </v-list-tile>
          </v-list>
        </template>
      </template>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import PageTitle from "~/components/PageTitle/index.vue";

export default {
  layout: "page",
  head() {
    return {
      title: "Adaptors",
    };
  },
  components: {
    PageTitle,
  },
  computed: {
    ...mapGetters({
      categoryIcons: "transformations/categoryIcons",
      adaptorGroups: "transformations/getGroupedAdaptors",
    }),
  },
  fetch({ store, error }) {
    return (
      store.dispatch("transformations/fetchAdaptors")
        .catch(({ message }) => error({ statusCode: 500, message }))
    );
  },
};
</script>

<style scoped>
.v-list {
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.24);
}
.v-list >>> .v-list__tile {
  height: unset;
}
.v-list >>> .v-list__tile__sub-title {
  white-space: unset;
  padding-bottom: 4px;
}
</style>
