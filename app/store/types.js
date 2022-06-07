/* eslint no-shadow: 0 */

export const state = () => ({
});

export const getters = {
  all() {
    return [
      {
        name: "boolean",
        assignable: true,
        default: false,
        hasEnum: true,
      },
      {
        name: "datatable",
        assignable: false,
        default: null,
        hasEnum: false,
      },
      {
        name: "date",
        assignable: true,
        default: new Date(),
        hasEnum: true,
      },
      {
        name: "file",
        assignable: false,
        default: null,
        hasEnum: false,
      },
      {
        name: "graph",
        assignable: false,
        default: null,
        hasEnum: false,
      },
      {
        name: "integer",
        assignable: true,
        default: 0,
        hasEnum: true,
      },
      {
        name: "list",
        assignable: true,
        default: [],
        hasEnum: false,
      },
      {
        name: "map",
        assignable: true,
        default: {},
        hasEnum: false,
      },
      {
        name: "number",
        assignable: true,
        default: 0,
        hasEnum: true,
      },
      {
        name: "regex",
        assignable: true,
        default: "",
        hasEnum: true,
      },
      {
        name: "text",
        assignable: true,
        default: "",
        hasEnum: true,
      },
      {
        name: "url",
        assignable: true,
        default: "",
        hasEnum: true,
      },
    ];
  },
  byName(state, getters) {
    const dict = {};
    for (const item of getters.all) {
      dict[item.name] = item;
    }
    return dict;
  },
  icons() {
    return {
      boolean: "mdi-toggle-switch-off-outline",
      datatable: "mdi-table-large",
      date: "mdi-calendar-range",
      file: "mdi-file",
      graph: "mdi-graphql",
      integer: "mdi-numeric",
      list: "mdi-format-list-numbers",
      map: "mdi-json",
      number: "mdi-surround-sound-2-0",
      text: "mdi-format-color-text",
    };
  },
  names(state, getters) {
    return getters.all.map((item) => item.name);
  },
};

export const actions = {
};

export const mutations = {
};
