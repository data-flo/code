<template>
  <v-menu
    bottom
    left
  >
    <v-btn
      slot="activator"
      color="grey"
      flat
      icon
      title="Sort by"
    >
      <v-icon>mdi-sort</v-icon>
    </v-btn>
    <v-list dense>
      <v-subheader>Sort by</v-subheader>
      <v-list-tile
        v-for="item in items"
        v-bind:key="item.value"
        v-on:click="$emit('input', item.value)"
      >
        <v-list-tile-action>
          <v-icon v-if="item.value === value">
            mdi-check
          </v-icon>
        </v-list-tile-action>
        <v-list-tile-title>{{ item.label }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  props: {
    items: Array,
    value: String,
  },
};
</script>

<style scoped>
.v-list__tile__action {
  min-width: 32px;
}
</style>
