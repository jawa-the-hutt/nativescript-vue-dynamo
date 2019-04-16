import Vue from 'vue';
import App from '~/App.vue';
import router, { routes } from '~/router';
import store from '~/store';

Vue.config.productionTip = false;

import Dynamo from '../../';

Vue.use( Dynamo, { 
  appMode: store.state.appMode, 
  store,
  router,
  routes,
});

// @ts-ignore
import GlobalMixinWeb from '~/utils/global-mixin/global-mixin';
Vue.mixin(GlobalMixinWeb);


const isLoggedIn = true; // change to false to start at the login component

new Vue({
  router,
  store,
  render: (h) => h(App, { props: { isLoggedIn }})
}).$mount('#app');
