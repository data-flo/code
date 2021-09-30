<template>
  <div class="datatable-viewer">
    <vue-spreadsheet-lite :data="rows" :header="headers"/>
  </div>
</template>

<script>
import VueSpreadsheetLite from "@anydown/vue-spreadsheet-lite";

export default {
  components: {
    VueSpreadsheetLite,
  },
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
          name: x,
          width: 100,
        }));
      }
      return [];
    },
    rows() {
      if (this.value) {
        return this.value.rows.map((x) => {
          const row = [];
          for (const column of this.value.columns) {
            row.push(x[column]);
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
.datatable-viewer >>> rect {
  fill: white;
  stroke: #999;
  shape-rendering: crispEdges;
}
.datatable-viewer >>> .selection {
  fill: none;
  stroke: rgb(158, 55, 255);
  stroke-width: 3px;
}
.datatable-viewer >>> .col-header {
  fill: #eee;
}
.datatable-viewer >>> .col-header__resize {
  cursor: col-resize;
  opacity: 0;
}
.datatable-viewer >>> .col-header__resize:hover {
  cursor: col-resize;
  fill: rgb(158, 55, 255);
  opacity: 0.5;
}
.datatable-viewer >>> .col-header__resize.active {
  fill: rgb(158, 55, 255);
  opacity: 0.5;
}
.datatable-viewer >>> .grid {
  position: relative;
  background: #eee;
  width: 100%;
}
.datatable-viewer >>> .editor__frame {
  position: absolute;
  overflow: hidden;
}
.datatable-viewer >>> text {
  dominant-baseline: central;
  user-select: none;
}
.datatable-viewer >>> input {
  border: none;
  box-sizing: border-box;
  outline: 0;
  margin-left: 2px;
}
.datatable-viewer >>> svg {
  display: block;
}
.datatable-viewer >>> .editor__textarea {
  opacity: 0;
  width: 100%;
}
.datatable-viewer >>> .editor--visible {
  opacity: 1;
}
</style>
