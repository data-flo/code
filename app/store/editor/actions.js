/* eslint no-shadow: 0 */

export default {
  async fetchManifest({ commit }, payload) {
    return (
      this.$axios.$get(`/api/dataflows/manifest/${payload}`)
        .then((data) => commit("setManifest", data))
    );
  },
  async updateManifest({ state }) {
    return (
      this.$axios.$post(
        `/api/dataflows/edit/${state.id}`,
        {
          access: state.access,
          description: state.description,
          folder: state.folder,
          manifest: state.manifest,
          name: state.name,
          showDetailedErrors: state.showDetailedErrors,
        }
      )
    );
  },
  async removeDataflow({ state }) {
    return this.$axios.$post(`/api/dataflows/delete/${state.id}`);
  },
  async runDataflow({ commit, state }, payload) {
    commit("setDebugInfo", { running: true });
    return (
      this.$axios.$post(
        `/api/dataflows/run/${state.id}/?debug=true`,
        payload
      )
        .then((response) => commit("setDebugInfo", response))
    );
  },
};

