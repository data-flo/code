<template>
  <header>
    <v-toolbar
      dark
      flat
      tabs
      class="page-title"
      color="primary"
    >
      <v-toolbar-title class="v-toolbar--title">
        <slot name="previous" />
        {{ title }}
      </v-toolbar-title>
      <v-spacer />

      <slot name="actions" />

      <div
        v-if="$slots.subtitle"
        slot="extension"
        class="white--text subtitle"
      >
        <slot name="subtitle">
          {{ subtitle }}
        </slot>
      </div>
    </v-toolbar>

    <v-toolbar
      v-if="hasTabsSlot"
      dark
      flat
      tabs
      class="v-toolbar--tabs"
      color="primary"
    >
      <template slot="extension">
        <slot name="tabs" />
      </template>
    </v-toolbar>
  </header>
</template>

<script>
export default {
  props: {
    title: String,
    subtitle: String,
  },
  data() {
    return {
      tabs: null,
    };
  },
  computed: {
    hasTabsSlot() {
      return !!this.$slots.tabs;
    },
  },
};
</script>

<style>
.page-title .v-toolbar__content {
  height: 64px !important;
}
</style>

<style scoped>
.v-toolbar--tabs,
.v-toolbar--title {
  font-family: 'Saira Semi Condensed', sans-serif !important;
}
header,
nav,
.page-title {
  /* stopping color popping in on load */
  background-color: var(--cgps-purple-primary) !important;
}
</style>
