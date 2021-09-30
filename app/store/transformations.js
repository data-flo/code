/* eslint no-shadow: 0 */

import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import { compareDesc as compareDates } from "date-fns";

function compareStrings(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function compareNumbers(a, b) {
  return a - b;
}

const compareFunctions = {
  access: compareNumbers,
  category: compareStrings,
  created: compareDates,
  folder: compareStrings,
  name: compareStrings,
  updated: compareDates,
};

export const state = () => ({
  dataflows: [],
  adaptors: [],
  manifests: [],
  searchTerm: null,
  sortDataflowsBy: "updated",
  sortAdaptorsBy: "category",
});

export const getters = {
  categoryIcons() {
    return {
      "Data Destinations": "mdi-database-export",
      "Data Manipulation": "mdi-sigma",
      "Data Sources": "mdi-database-import",
      "Data Tables": "mdi-table-large",
      "Data Transformations": "mdi-content-duplicate",
      "Graph Manipulation": "mdi-graph",
      "JSON Manipulation": "mdi-code-braces",
      "List Manipulation": "mdi-format-list-numbered",
      "Map Manipulation": "mdi-pound-box-outline",
      "Text Manipulation": "mdi-format-color-text",
      "URL Manipulation": "mdi-link",
      Dataflows: "mdi-pipe",
    };
  },
  getAdaptors: (state) => {
    if (state.searchTerm === null) {
      return state.adaptors;
    }
    const searchTerm = state.searchTerm.toUpperCase();
    return state.adaptors.filter(
      (x) =>
        x.id === searchTerm ||
        x.name.includes(searchTerm) ||
        (x.description && x.description.includes(searchTerm))
    );
  },
  getDataflows: (state) => {
    const dataflows = state.dataflows.map((d) => ({
      ...d,
      localeCreated: new Date(d.created).toLocaleString(),
    }));
    if (state.searchTerm === null) {
      return dataflows;
    }
    const searchTerm = state.searchTerm.toUpperCase();
    return dataflows.filter(
      (x) =>
        x.id === searchTerm ||
        x.name.toUpperCase().includes(searchTerm) ||
        x.localeCreated.includes(searchTerm) ||
        (x.description && x.description.includes(searchTerm))
    );
  },
  getGroupedAdaptors: (state, getters) => {
    const items = getters.getAdaptors;
    const sortedItems = [...items].sort((a, b) =>
      compareFunctions[state.sortAdaptorsBy](
        a[state.sortAdaptorsBy],
        b[state.sortAdaptorsBy]
      )
    );
    const groups = {};
    for (const item of sortedItems) {
      let label = "";
      switch (state.sortAdaptorsBy) {
        case "category":
          label = item.category || "Untitled Category";
          break;
        case "name":
          label =
            item.name !== "Untitled Adaptor"
              ? item.name[0]
              : "Untitled Adaptors";
      }
      const group = groups[label] || [];
      group.push(item);
      groups[label] = group;
    }
    return Object.entries(groups).map(([label, items]) => ({ label, items }));
  },
  groupedDataflows: (state, getters) => {
    const items = getters.getDataflows;
    const sortedItems = [...items].sort((a, b) => compareFunctions[state.sortDataflowsBy](a[state.sortDataflowsBy], b[state.sortDataflowsBy]));
    const groups = {};
    for (const item of sortedItems) {
      let label = "";
      switch (state.sortDataflowsBy) {
        case "access":
          label = item.public ? "Public" : "Private";
          break;
        case "created":
          label = distanceInWordsToNow(item.updated);
          break;
        case "folder":
          label = item.folder || "Uncategorised";
          break;
        case "name":
          label = (item.name !== "Untitled Dataflow") ? item.name[0] : "Untitled Dataflows";
          break;
        case "updated":
          label = distanceInWordsToNow(item.updated);
          break;
      }
      const group = groups[label] || [];
      group.push(item);
      groups[label] = group;
    }
    return Object.entries(groups).map(([label, items]) => ({ label, items }));
  },
  manifests(state) {
    const dict = {};
    for (const item of state.manifests) {
      dict[`${item.type}-${item.id}`] = item;
    }
    return dict;
  },
  transformationGroups(state, getters, rootState) {
    const groups = {};
    for (const item of state.manifests) {
      if (item.type === "dataflow" && item.id === rootState.editor.id) {
        continue;
      }
      if (!(item.category in groups)) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    }
    return (
      Object.keys(groups)
        .sort()
        .map((key) => ([key.replace(/\s+/g, "-").toLowerCase(), key, groups[key]]))
    );
  },
};

export const actions = {
  fetchAdaptors({ commit, state }) {
    if (!state.adaptors.length) {
      return (
        this.$axios
          .$get("/api/adaptors/list")
          .then((data) => commit("setAdaptors", data))
      );
    }
    return Promise.resolve();
  },
  fetchDataflows({ commit }) {
    return (
      this.$axios
        .$get("/api/dataflows/list")
        .then((data) => commit("setDataflows", data))
    );
  },
  async fetchManifests({ commit }, payload) {
    return (
      this.$axios.$get(`/api/transformations/list?identifier=${payload}`)
        .then((data) => commit("setManifests", data))
    );
  },
};

export const mutations = {
  setAdaptors(state, items) {
    state.adaptors = items.map((item) => ({
      ...item,
      title: item.name || `Untitled Adaptor (${item.id})`,
      name: item.name ? item.name.toUpperCase() : "Untitled Adaptor",
    }));
  },
  setDataflows(state, items) {
    state.dataflows = items.map((item) => ({
      ...item,
      title: item.name || `Untitled Dataflow (${item.id})`,
      name: item.name ? item.name.toUpperCase() : "Untitled Dataflow",
    }));
  },
  setManifests(state, data) {
    state.manifests = data;
  },
  setSearchTerm(state, term) {
    state.searchTerm = term === "" ? null : term;
  },
  sortAdaptorsBy(state, value) {
    state.sortAdaptorsBy = value;
  },
  sortDataflowsBy(state, value) {
    state.sortDataflowsBy = value;
  },
};
