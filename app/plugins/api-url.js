export default ({ $axios, beforeNuxtRender, env, isDev, nuxtState }) => {
  if (process.server) {
    beforeNuxtRender((context) => {
      // Send API URL from server-side to client
      context.nuxtState.env = context.nuxtState.env || {};
      context.nuxtState.env.API_URL_BROWSER = process.env.API_URL_BROWSER;
    });
  }
  else {
    // Copy API URL from server env when defined
    if (nuxtState.env.API_URL_BROWSER) {
      env.API_URL_BROWSER = nuxtState.env.API_URL_BROWSER;
    }
    if (env.API_URL_BROWSER) {
      $axios.defaults.baseURL = env.API_URL_BROWSER;
    }
    else if (!isDev) {
      $axios.defaults.baseURL = "/";
    }
  }
};
