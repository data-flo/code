/* eslint no-shadow: 0 */

export const state = () => ({
  user: null,
  strategies: [],
});

export const mutations = {
  setStrategies(state, value) {
    state.strategies = value;
  },
  setUser(state, value) {
    state.user = value;
  },
  setVersion(state, value) {
    state.version = value;
  },
};

export const getters = {
  isAnonymous(state) {
    return !state.user;
  },
  isAuthenticated(state) {
    return !!state.user;
  },
  loggedUser(state) {
    return state.user;
  },
  strategies(state) {
    return state.strategies;
  },
};

export const actions = {
  async nuxtServerInit({ commit }, { env, req }) {
    if (env.version) {
      commit(
        "setVersion",
        env.version
      );
    }
    if (req.user) {
      commit(
        "setUser",
        {
          name: req.user.name,
          email: req.user.email,
          apiAccessToken: req.user.apiAccessToken,
        }
      );
    }
    if (req.config.passport.strategies) {
      commit(
        "setStrategies",
        Object.keys(req.config.passport.strategies)
      );
    }
  },
};
