<template>
  <client-only>
    <component
      v-if="VueTable"
      :is="VueTable"
      v-bind="options"
      v-bind:tbody-data="rows"
      v-bind:headers="headers"
      v-bind:selectPosition="selectPosition"
    >
    <div slot="header">
      Specific Header
    </div>
    <div slot="loader">
      Loader
    </div>
    </component>
  </client-only>
</template>

<script>
export default {
  props: {
    description: String,
    value: Object,
  },
  data() {
    return {
      VueTable: null,
      selectPosition: {
        top: 0,
        left: 0
      },
    };
  },
  computed: {
    headers() {
      if (this.value) {
        return this.value.columns.map((x) => ({
          headerName: x,
          headerKey: x,
          style: {
            width: "100px",
            minWidth: "100px",
          },
        }));
      }
      return [];
    },
    rows() {
      if (this.value) {
        return this.value.rows.map((x) => {
          const row = {};
          for (const column of this.value.columns) {
            row[column] = {
              type: "input",
              value: x[column],
            };
          }
          return row;
        });
      }
      return [];
    },
    options() {
      return {
        customOptions: {
          tbodyIndex: true,
          tbodyCheckbox: true,
          sortHeader: true,
          trad: {
            lang: "fr",
            en: {
              select: {
                placeholder: "Search by typing"
              }
            },
            fr: {
              select: {
                placeholder: "Taper pour chercher"
              }
            }
          },
          newData: {
            type: "input",
            value: "",
            active: false,
            style: {
              color: "#000"
            }
          },
          fuseOptions: {
            shouldSort: true,
            threshold: 0.2,
            location: 0,
            distance: 30,
            maxPatternLength: 64,
            minMatchCharLength: 1,
            findAllMatches: false,
            tokenize: false,
            keys: ["value"]
          }
        },
        styleWrapVueTable: {
          height: "400px",
          overflow: "scroll",
          fontSize: "12px",
          comment: {
            borderColor: "#696969",
            borderSize: "8px",
            widthBox: "120px",
            heightBox: "80px"
          },
        },
        submenuThead: [
          {
            type: "button",
            value: "change color",
            function: "change-color",
            disabled: ["a"]
          },
          {
            type: "select",
            disabled: ["a"],
            subtitle: "Select state:",
            selectOptions: [
              {
                value: "new-york",
                label: "new-york"
              },
              {
                value: "france",
                label: "france"
              }
            ],
            value: "new-york",
            buttonOption: {
              value: "change city",
              function: "change-city",
              style: {
                display: "block"
              }
            }
          },
          {
            type: "button",
            value: "change value",
            function: "change-value",
            disabled: ["a", "b"]
          }
        ],
        submenuTbody: [
          {
            type: "button",
            value: "change color",
            function: "change-color",
            disabled: ["img"]
          },
          {
            type: "button",
            value: "change value",
            function: "change-value",
            disabled: ["img", "name"]
          }
        ],
        disableCells: [],
        disableSortThead: [],
        loading: false,
        parentScrollElement:  {
          attribute: "html",
          positionTop: 0
        },
      };
    },
  },
  mounted() {
    import("vuejs-spreadsheet").then((VueTable) => {
      this.VueTable = VueTable.default;
    });
  },
};
</script>

<style scoped>
div {
  overflow-x: auto;
}
table {
  border: 1px solid #dee2e6;
  border-collapse: collapse;
}
table td, table th {
  margin: 0;
  padding: 2px 4px;
  border: 1px solid #dee2e6;
}
</style>
