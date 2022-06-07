// import colors from 'vuetify/es5/util/colors'
import apiServerMiddleware from "../api";

module.exports = {
  mode: "universal",

  /*
  ** TODO: check if used and remove
  */
  // modern: !isDev,
  // devtools: isDev,
  // friendlyErrors: isDev,

  /*
   ** Environment variables
   */
  env: {
    version: (process.env.version || "").split(".")[0],
  },

  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: "%s - Data-flo",
    title: "Data-flo",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Open-source, modular, and extensible data integration" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "stylesheet", type: "text/css", href: "https://cdn.jsdelivr.net/npm/quasar@1.9.8/dist/quasar.min.css" },
    ],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    color: "#673C90",
    duration: 5000,
    height: "1px",
  },

  /*
   ** Global CSS
   */
  css: [
    "~/css/fonts.css",
    "~/css/vuetifyjs-theme.css",
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "~/plugins/api-url.js",
    "~/plugins/tutorial.js",
    "~/plugins/vue-debounce.js",
    { src: "~/plugins/vue-drag-resize.js", ssr: false },
    "~/plugins/vuetify.js",
    "~/plugins/quasar.js",
  ],

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    // '@nuxtjs/eslint-module',
    // '@nuxtjs/vuetify',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    "@nuxtjs/axios",
    "@nuxtjs/markdownit",
    "@nuxtjs/device",
  ],

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    // credentials: false,
  },

  /*
  ** Markdownit module configuration
  ** See https://github.com/markdown-it/markdown-it
  */
  markdownit: {
    injected: true,
    preset: "default",
    linkify: true,
    breaks: true,
    use: [],
  },

  // /*
  // ** Vuetify module configuration
  // ** See https://github.com/nuxt-community/vuetify-module
  // */
  // vuetify: {
  //   // customVariables: ['~/assets/variables.scss'],
  //   iconfont: 'mdi',
  //   theme: {
  //     primary: '#673c90',
  //     secondary: '#673c90',
  //     accent: '#673c90',
  //   },
  // },

  /*
  ** Build configuration
  */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient && process.env.ESLINT) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/,
        });
      }
    },
  },

  // server: {
  //   port: 8082, // default: 3000
  // },

  /*
  ** Nuxt.js router configuration (vue-router).
  ** See https://router.vuejs.org/
  */
  router: {
    base: (process.env.API_PREFIX || "/"),
  },

  serverMiddleware: [apiServerMiddleware],
};
