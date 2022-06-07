<template>
  <section>
    <div>
      <v-text-field
        label="Filter by name"
        ref="filter-text-field"
        v-debounce:300ms="setFilter"
        class="hidden-sm-and-down"
        clearable
        flat
        hide-details
        prepend-inner-icon="mdi-magnify"
        solo
        v-bind:value="filter"
        v-on:click:clear="filter = ''"
      />
    </div>
    <v-list
      dense
      expand
    >
      <v-list-group
        v-for="([id, category, list]) in filteredGroups"
        v-bind:key="id"
        v-bind:prepend-icon="icon(category)"
        v-bind:value="!!filter || undefined"
        no-action
      >
        <v-list-tile slot="activator">
          <v-list-tile-content>
            <v-list-tile-title>
              {{ category }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile
          v-for="item in list"
          v-bind:key="item.id"
          ripple
          v-on:click="add(item)"
        >
          <v-list-tile-content>
            <v-list-tile-title
              v-text="item.name || item.id"
            />
          </v-list-tile-content>
          <v-list-tile-action>
            <v-tooltip
              v-bind:id="item.id"
              max-width="600"
              nudge-right="20"
              right
              lazy
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-bind:id="`${item.id}-add`"
                  v-bind:ripple="false"
                  icon
                  v-on="on"
                >
                  <v-icon color="primary">
                    mdi-information-outline
                  </v-icon>
                </v-btn>
              </template>
              <client-only>
                <div>
                  <p>
                    <strong>{{ item.name }}</strong>
                  </p>
                  <div
                    v-if="item.description"
                    v-html="$md.render(item.description)"
                  />

                  <p>
                    <strong>Inputs</strong>
                    <ul>
                      <li
                        v-for="arg in item.input"
                        v-bind:key="arg.name"
                      >
                        <strong>{{ arg.name }}</strong> <code>{{ arg.type }}</code>
                        <div
                          v-if="!!arg.description"
                          v-html="$md.render(arg.description)"
                        />
                      </li>
                    </ul>
                  </p>
                  <p>
                    <strong>Outputs</strong>
                    <ul>
                      <li
                        v-for="arg in item.output"
                        v-bind:key="arg.name"
                      >
                        <strong>{{ arg.name }}</strong> <code>{{ arg.type }}</code>
                        <div
                          v-if="!!arg.description"
                          v-html="$md.render(arg.description)"
                        />
                      </li>
                    </ul>
                  </p>
                </div>
              </client-only>
            </v-tooltip>
          </v-list-tile-action>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </section>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import escapeStringRegexpfrom from "escape-string-regexp";

export default {
  name: "TransformationsList",
  data() {
    return {
      filter: "",
      groupSet: [],
    };
  },
  computed: {
    ...mapState(
      "editor",
      {
        id: "id",
        offsets: "offsets",
      }
    ),
    ...mapGetters({
      allGroups: "transformations/transformationGroups",
      categoryIcons: "transformations/categoryIcons",
    }),
    filteredGroups() {
      if (!this.filter) {
        return this.allGroups;
      }
      const groups = [];
      const filter = new RegExp(escapeStringRegexpfrom(this.filter), "i");
      for (const [id, key, list] of this.allGroups) {
        const filteredList = (
          list.filter(
            (x) =>
              (x.name && filter.test(x.name))
              ||
              (x.id && filter.test(x.id))
              ||
              (x.decription && filter.test(x.decription))
          )
        );
        if (filteredList.length) {
          groups.push([id, key, filteredList]);
        }
      }
      return groups;
    },
  },
  methods: {
    add(item) {
      this.$store.commit(
        "editor/addTransformation",
        {
          type: item.type,
          name: item.id,
        }
      );
    },
    icon(name) {
      return this.categoryIcons[name] || "mdi-folder";
    },
    setFilter(value) {
      this.filter = value;
    },
  },
};
</script>

<style scoped>
.v-list {
  padding: 0;
}

.v-list__tile__content {
  margin-right: -16px;
}

.v-list__tile__action {
  display: none;
}

.v-list__group__items > div:hover .v-list__tile__action {
  display: flex;
}

.v-btn--active::before, .v-btn:focus::before, .v-btn:hover::before {
  background-color: transparent;
}

section {
  background-color: #f3f3f3;
  display: flex;
  flex-direction: column;
  height: 100%;
}

section > .v-list {
  flex-grow: 1;
  overflow: hidden;
  overflow-x: hidden;
  overflow-y: auto;
}

.v-text-field--solo >>> .v-input__slot {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  background: transparent !important;
}
.v-text-field >>> .v-input__prepend-inner {
  margin-left: 4px;
  padding: 0;
}
.v-text-field >>> .v-text-field__slot {
  margin-left: 32px;
}
.v-text-field >>> .v-label {
  font-size: 13px;
}
.v-input--is-focused >>> .v-label {
  color: rgb(103, 60, 144);
}
.v-text-field >>> .v-input__append-inner {
  display: none;
}
.v-text-field:hover >>> .v-input__append-inner,
.v-input--is-focused >>> .v-input__append-inner {
  display: flex;
}
</style>
