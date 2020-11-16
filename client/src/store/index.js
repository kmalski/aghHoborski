import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dupa: [
      {
        name: 'red',
        isActive: true
      },
      {
        name: 'yellow',
        isActive: false
      },
      {
        name: 'green',
        isActive: true
      }
    ]
  },
  getters: {
    getActiveNumber: state => state.dupa.filter(team => team.isActive === true)
  },
  mutations: {},
  actions: {},
  modules: {}
});
