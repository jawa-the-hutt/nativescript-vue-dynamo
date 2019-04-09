import Vue from "vue";
import Vuex, { Module } from 'vuex';
// import ComponentRouter from '../dynamo/component-router';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    appMode: process.env.VUE_APP_MODE as string,
    appPlatform: process.env.VUE_APP_PLATFORM as string,
  },
  mutations: {},
  actions: {},
  modules: {
    // componentRouter: ComponentRouter,
  },
  getters: {
    getAppMode: (state): string => {
      return state.appMode;
    },
    getAppPlatform: (state): string => {
      return state.appPlatform;
    },
  },
});
