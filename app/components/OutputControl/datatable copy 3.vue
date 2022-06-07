<template>
  <div class="datatable-viewer">
    <vue-excel-editor
      v-model="rows"
      no-paging
      filter-row
      xno-footer
      no-finding
      v-bind:page="rows.length"
      readonly
      xheight="300px"
      xwidth="300px"
    >
      <vue-excel-column
        v-for="(column) in columns"
        v-bind:key="column"
        v-bind:field="column"
        v-bind:label="column"
      />
    </vue-excel-editor>
  </div>
</template>

<script>
import VueExcelEditor from "vue-excel-editor/src/VueExcelEditor.vue";
import VueExcelColumn from "vue-excel-editor/src/VueExcelColumn.vue";

export default {
  components: {
    VueExcelEditor,
    VueExcelColumn,
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
    columns() {
      if (this.value) {
        return [ ...this.value.columns ];
      }
      return [];
    },
    rows() {
      if (this.value) {
        return [ ...this.value.rows ];
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
};
</script>

<style scoped>
/* .datatable-viewer {
  width: 300px;
  height: 300px;
} */
</style>
