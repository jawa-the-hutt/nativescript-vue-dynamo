import Vue from "vue";
import Vuex, { Module } from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  // strict: true,
  state: {
    appMode: process.env.VUE_APP_MODE as string,
    appPlatform: process.env.VUE_APP_PLATFORM as string,
    originalHomePageId: '' as string,
    haveUpdatedOriginalHomePageId: false as boolean,
  },
  mutations: {
    updateOriginalHomePageId (state, pageId: string) {
      // console.log('starting - mutations - updateOriginalHomePageId')
      // console.log('mutations - updateOriginalHomePageId - pageId - ', pageId)
      
      state.originalHomePageId = pageId;
    },
    updateHaveUpdatedOriginalHomePageId (state, updated: boolean) {
      // console.log('starting - mutations - updateHaveUpdatedOriginalHomePageId')
      state.haveUpdatedOriginalHomePageId = updated;
    }
  },
  actions: {
    updateOriginalHomePageId (context, pageId: string ) {
      // console.log('starting actions - updateOriginalHomePageId - ')
      // console.log('starting actions - updateOriginalHomePageId - haveUpdatedOriginalHomePageId ', context.state.haveUpdatedOriginalHomePageId)
      // console.log('starting actions - updateOriginalHomePageId - pageId', pageId)
      if(!context.state.haveUpdatedOriginalHomePageId) {
        context.commit('updateHaveUpdatedOriginalHomePageId', true);
        context.commit('updateOriginalHomePageId', pageId);
      }
    }
  },
  modules: {
  },
  getters: {
    getAppMode: (state): string => {
      return state.appMode;
    },
    getAppPlatform: (state): string => {
      return state.appPlatform;
    },
    getOriginalHomePageId: (state): string => {
      return state.originalHomePageId;
    },
  },
});
