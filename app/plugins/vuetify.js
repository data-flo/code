import "vuetify/dist/vuetify.min.css";
import "@mdi/font/css/materialdesignicons.min.css";

import Vue from "vue";
import Vuetify from "vuetify";

Vue.use(
  Vuetify,
  {
    iconfont: "mdi",
    theme: {
      primary: "#673c90",
      secondary: "#673c90",
      accent: "#673c90",
    },
  }
);
