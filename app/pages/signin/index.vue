<template>
  <div>
    <page-title title="Sign in to Data Flo">
      <template slot="subtitle">
        Sign in or create an account on Data Flo
      </template>
    </page-title>
    <v-container>

      <div class="text-xs-center">
        <div v-if="errorMessage">
           {{ errorMessage }}
        </div>

        <p>
          <a
            v-for="strategy in strategies"
            v-bind:key="strategy"
            v-bind:href="`auth/${strategy}`"
            class="v-btn v-btn--large v-btn--outline v-btn--depressed primary--text"
            color="primary"
          >
            <v-icon left>{{ icons[strategy] }}</v-icon>
            Continue with {{ strategy }}
          </a>
        </p>
      </div>
    </v-container>
  </div>
</template>

<script>
import PageTitle from "~/components/PageTitle/index.vue";
import { mapGetters } from "vuex";

export default {
  middleware: "anonymous",
  layout: "page",
  head() {
    return {
      title: "Data-flo - Sign in",
    };
  },
  components: {
    PageTitle,
  },
  computed: {
    ...mapGetters(["strategies"]),
    icons() {
      return {
        facebook: "mdi-facebook",
        google: "mdi-google-plus",
        twitter: "mdi-twitter",
        ldap: "mdi-key",
      };
    },
    errorMessage() {
      if (this.$route && this.$route.query && this.$route.query.message) {
        if (this.$route.query.message === "Error: Access Denied") {
          return "Access Denied. You do not have permission to sign in."
        }
        else {
          return this.$route.query.message;
        }
      }
    },
  },
};
</script>

<style scoped>
p {
  display: inline-flex;
  flex-direction: column;
}
</style>
