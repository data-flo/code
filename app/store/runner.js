/* eslint no-shadow: 0 */

export const state = () => ({
  dataflow: {},
});


export const mutations = {
  set(state, data) {
    state.dataflow = data;
  },
};

export const getters = {
  get: (state) => state.dataflow,
};

export const actions = {
  async fetch({ commit }, payload) {
    return (
      this.$axios.$get(`/api/dataflows/info/${payload}`)
        .then((data) => commit("set", data))
    );
  },
};
