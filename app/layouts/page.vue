<template>
  <v-app class="dataflo">
    <v-toolbar
      absolute
      app
      dense
      flat
      color="white"
    >
      <nuxt-link
        class="product-logo-link"
        to="/"
      >
        <img
          src="~/static/images/data-flo-full-logo.svg"
          height="32px"
        >
      </nuxt-link>
      <v-spacer />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn
          flat
          to="/transformations"
        >
          Transformations
        </v-btn>
        <v-btn
          flat
          href="https://docs.data-flo.io/"
        >
          Documentation
        </v-btn>
        <v-btn
          v-if="isAuthenticated"
          flat
          href="auth/signout"
        >
          Sign Out
        </v-btn>
        <template v-else-if="isAnonymous">
          <v-btn
            flat
            to="/signin"
          >
            Sign In
          </v-btn>
        </template>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <nuxt />
    </v-content>

    <v-content>
      <v-container
        fluid
        fill-height
        class="page"
      >
        <v-layout>
          <v-flex
            xs12
            sm8
            offset-sm2
          />
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isAuthenticated", "isAnonymous", "strategies"]),
  },
};
</script>

<style>
.dataflo.application {
  background-color: #f5f5f5;
}

.dataflo.application .product-logo-link {
  align-items: center;
  display: flex;
  padding: 0;
  min-width: 48px;
}
.dataflo.application .product-logo-link:hover {
  opacity: .7;
}
.dataflo.application .product-name-link {
  color: rgba(0, 0, 0, 0.54);
  text-decoration: none;
}
.dataflo.application .product-name-link:hover {
  color: rgba(0, 0, 0, 0.87);
}

/* Restore white background on nav links */
.dataflo.application .v-toolbar--absolute .v-btn--router::before {
  background-color: transparent;
}
.dataflo.application .v-toolbar--absolute .v-btn--router {
  color: rgba(0, 0, 0, 0.54);
}
.dataflo.application .v-toolbar--absolute .v-btn--router.v-btn--active,
.dataflo.application .v-toolbar--absolute .v-btn--router:hover {
  color: rgba(0, 0, 0, 0.87);
}

.dataflo.application .v-toolbar--absolute .v-btn--router.v-btn--active::before {
  border-bottom: 2px solid #2f1a67;
  opacity: 1;
}

.dataflo.application header {
  box-shadow: 0 0 4px rgba(0,0,0,.14),0 4px 8px rgba(0,0,0,.28);
}
.dataflo.application header .v-toolbar--title .v-toolbar__extension {
  margin-top: -16px;
}
.dataflo.application header .v-toolbar__title {
  overflow: visible;
}
.dataflo.application header .v-toolbar__title .v-btn {
  margin-left: -8px;
}

/* UI components overrides */
.dataflo.application .v-toolbar .v-toolbar__content,
.dataflo.application .v-toolbar .v-toolbar__extension {
  max-width: 960px !important;
  margin-left: auto;
  margin-right: auto;
}
.dataflo.application .v-toolbar--tabs .v-toolbar__extension {
  padding-left: 12px;
  padding-right: 12px;
}
.dataflo.application .v-toolbar--tabs .v-toolbar__content {
  display: none;
}
.dataflo.application header + .container {
  max-width: 960px !important;
}
</style>
