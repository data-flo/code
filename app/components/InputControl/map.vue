<template>
  <div
    class="v-input multiline"
  >
    <v-subheader>
      {{ label }}
      <v-btn
        icon
        ripple
        title="Add new entry"
        v-on:click="onAddEntry"
      >
        <v-icon color="grey lighten-1">
          mdi-plus
        </v-icon>
      </v-btn>
    </v-subheader>
    <ol>
      <li
        v-for="(item, index) in entries"
        v-bind:key="item.name"
      >
        <div class="move-entry-actions">
          <v-btn
            v-bind:disabled="index === 0"
            icon
            title="Move entry up"
            v-on:click.stop="onMoveEntry(index, -1, $event)"
          >
            <v-icon color="grey lighten-1">
              mdi-menu-up
            </v-icon>
          </v-btn>
          <v-btn
            v-bind:disabled="index === (entries.length - 1)"
            icon
            title="Move entry down"
            v-on:click.stop="onMoveEntry(index, 1, $event)"
          >
            <v-icon color="grey lighten-1">
              mdi-menu-down
            </v-icon>
          </v-btn>
        </div>
        <div
          class="inline-input"
          v-bind:class="{ 'focus-edit': (focusedIndex === index) }"
        >
          <v-text-field
            v-bind:autofocus="(index === (entries.length - 1))"
            class="inline"
            outline
            placeholder="Key"
            single-line
            title="Edit key"
            v-bind:value="item.key"
            v-on:blur="onUnfocus"
            v-on:focus="onFocus($event, index)"
            v-on:input="onEntryKeyChange(index, $event)"
            v-on:paste="onPaste($event, index)"
          />
          <v-text-field
            class="inline"
            outline
            placeholder="Value"
            single-line
            title="Edit value"
            v-bind:value="item.value"
            v-on:blur="onUnfocus"
            v-on:focus="onFocus($event, index)"
            v-on:input="onEntryValueChange(index, $event)"
            v-on:paste="onPaste($event, index)"
          />
        </div>
        <v-btn
          icon
          ripple
          title="Remove entry"
          v-on:click.stop="onRemoveEntry(index)"
        >
          <v-icon color="grey lighten-1">
            mdi-minus
          </v-icon>
        </v-btn>
      </li>
    </ol>
  </div>
</template>

<script>
export default {
  props: {
    description: String,
    inline: Boolean,
    label: String,
    name: String,
    value: [ Array, Object ],
  },
  data() {
    return {
      focusedIndex: null,
    };
  },
  computed: {
    entries() {
      if (Array.isArray(this.value)) {
        return this.value;
      }
      return (
        Object.entries(this.value || {})
          .map(([key, value]) => ({ key, value }))
      );
    },
  },
  methods: {
    onAddEntry() {
      const entries = this.entries.slice();
      entries.push({
        key: "",
        value: "",
      });
      this.$emit("input", entries);
    },
    onEntryKeyChange(index, key) {
      const entries = this.entries.slice();
      entries[index] = {
        key,
        value: entries[index].value,
      };
      this.$emit("input", entries);
    },
    onEntryValueChange(index, value) {
      const entries = this.entries.slice();
      entries[index] = {
        key: entries[index].key,
        value,
      };
      this.$emit("input", entries);
    },
    onFocus(event, index) {
      this.focusedIndex = index;
      event.target.select();
    },
    onMoveEntry(index, shift, event) {
      const entries = this.entries.slice();
      const entry = entries[index];
      if (event.metaKey || event.ctrlKey) {
        entries.splice(index, 1);
        if (shift > 0) {
          entries.push(entry);
        }
        else {
          entries.unshift(entry);
        }
      }
      else {
        entries[index] = entries[index + shift];
        entries[index + shift] = entry;
      }
      this.$emit("input", entries);
    },
    onPaste(event, index) {
      const data = (event.clipboardData || window.clipboardData).getData("text");
      if (typeof data === "string" && data.length && data.includes("\n") && data.includes("\t")) {
        event.preventDefault();
        const entries = this.entries.slice();
        const isEntryEmpty = (entries[index].key === "") && (entries[index].value === "");
        entries.splice(
          isEntryEmpty ? index : index + 1,
          isEntryEmpty ? 1 : 0,
          ...data.replace(/\r/g, "").split("\n").map(
            (row) => {
              const [ key, value ] = row.split("\t");
              return { key, value };
            }
          )
        );
        this.$emit("input", entries);
      }
    },
    onRemoveEntry(index) {
      const entries = this.entries.slice();
      entries.splice(index, 1);
      this.$emit("input", entries);
    },
    onUnfocus() {
      this.focusedIndex = null;
    },
  },
};
</script>

<style scoped>
.v-text-field {
  width: 50%;
}
.v-text-field:first-child >>> .v-input__slot {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.v-text-field:last-child >>> .v-input__slot {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.v-text-field:last-child {
  margin-left: -1px;
}
</style>
