<template>
  <component
    v-bind:is="currentInputComponent"
    v-bind:description="description"
    v-bind:enum-values="enumValues"
    v-bind:inline="inline"
    v-bind:label="label || name"
    v-bind:name="name"
    v-bind:required="required"
    v-bind:rules="required ? [ v => !!v || typeof v === 'boolean' || `${name} is required` ] : []"
    v-bind:value="valueOrDefault"
    v-on:input="$emit('input', $event)"
  />
</template>

<script>
import { mapGetters } from "vuex";

import boolean from "./boolean.vue";
import combobox from "./combobox.vue";
import date from "./date.vue";
import file from "./file.vue";
import integer from "./integer.vue";
import list from "./list.vue";
import map from "./map.vue";
import number from "./number.vue";
import text from "./text.vue";
import url from "./url.vue";

const editors = {
  boolean,
  combobox,
  date,
  file,
  integer,
  list,
  map,
  number,
  text,
  url,
};

export default {
  props: {
    description: String,
    inline: Boolean,
    enumValues: Array,
    label: String,
    name: String,
    required: Boolean,
    type: String,
    value: null,
  },
  computed: {
    ...mapGetters({
      typesByName: "types/byName",
    }),
    currentInputComponent() {
      if (this.typesByName[this.type].hasEnum && Array.isArray(this.enumValues) && this.enumValues.length) {
        return combobox;
      }
      else {
        return editors[this.type] || text;
      }
    },
    valueOrDefault() {
      if (typeof this.value === "undefined") {
        return this.typesByName[this.type].default;
      } else {
        return this.value;
      }
    },
  },
};
</script>

<style scoped>
.v-input.multiline >>> .v-subheader {
  width: 100%;
  padding: 0;
}

.v-input.multiline {
  flex-direction: column;
}

.v-input.multiline >>> ol {
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0;
}
.v-input.multiline >>> ol li {
  align-items: center;
  display: flex;
  height: 32px;
}
.v-input.multiline >>> ol li .inline-input {
  flex-grow: 1;
}

.v-input.multiline >>> .move-entry-actions {
  display: flex;
  flex-direction: column;
  visibility: hidden;
}
.v-input.multiline >>> ol li:hover .move-entry-actions {
  visibility: visible;
}
.v-input.multiline >>> .move-entry-actions .v-btn.v-btn--icon {
  width: 16px;
  height: 16px;
  overflow: hidden;
}
.v-input.multiline >>> .move-entry-actions .v-btn:first-child .v-icon {
  margin-top: 8px;
}
.v-input.multiline >>> .move-entry-actions .v-btn:last-child .v-icon {
  margin-bottom: 8px;
}
</style>

<style scoped>
/* Style inline inputs */

.v-input >>> .inline-input {
  border-radius: 2px;
  border: solid 1px transparent;
  display: flex;
  height: 30px;
  position: relative;
}

.v-input >>> .inline-input.focus-edit::before {
  border-radius: 3px;
  bottom: -1px;
  content: '';
  display: block;
  left: 0;
  position: absolute;
  right: 0;
  top: -1px;
  border: solid 2px rgb(103, 60, 143);
  z-index: 1;
}

.v-input >>> .inline-input .v-input {
  max-height: 28px;
}
.v-input >>> .inline-input .v-input .v-input__control {
  height: 28px;
  min-height: auto;
}
.v-input >>> .inline-input .v-input input {
  height: 28px;
  margin: 0;
  padding: 0;
  line-height: 28px;
  font-size: 13px;
}
.v-input >>> .inline-input .v-input .v-input__slot {
  border-radius: 2px;
  border-width: 1px;
  height: 28px;
  margin: 0;
  min-height: 28px;
  padding: 0 4px;
}
.v-input >>> .inline-input .v-input .v-input__slot {
  border-color: transparent;
}
.v-input >>> .inline-input.focus-edit .v-input .v-input__slot,
.v-input >>> .inline-input:hover .v-input .v-input__slot {
  border-color: rgb(205, 205, 205) !important;
}
.v-input >>> .inline-input .v-input .v-text-field__slot {
  height: 28px;
}
.v-input >>> .inline-input .v-input .v-text-field__slot input{
  margin-top:0;
}
</style>
