<template>
  <v-menu
    ref="menu"
    v-model="menu"
    v-bind:close-on-content-click="false"
    v-bind:nudge-right="40"
    lazy
    offset-y
    full-width
    transition="scale-transition"
    min-width="290px"
  >
    <v-text-field
      slot="activator"
      v-bind:hide-details="inline ? true : false"
      v-bind:hint="inline ? undefined : description"
      v-bind:label="label"
      v-bind:name="name"
      v-bind:required="required"
      v-bind:rules="rules"
      v-bind:value="value"
      outline
      readonly
    />
    <v-date-picker
      v-bind:value="value"
      scrollable
      v-on:input="$emit('input', $event)"
    >
      <v-spacer />
      <v-btn
        color="primary"
        flat
        v-on:click="menu = false"
      >
        Close
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>

export default {
  props: {
    description: String,
    inline: Boolean,
    label: String,
    name: String,
    required: Boolean,
    rules: Array,
    value: String,
  },
  data() {
    return {
      menu: false,
    };
  },
};
</script>
