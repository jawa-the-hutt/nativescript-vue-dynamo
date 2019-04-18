import Vue from 'vue';
import App from './App.vue';
import router, { routes } from './router';
import store from './store';

Vue.config.productionTip = false;

import Dynamo from '../../';

Vue.use(Dynamo, { 
  appMode: store.state.appMode, 
  store,
  router,
  routes,
});

// @ts-ignore
import GlobalMixin from '~/utils/global-mixin/global-mixin';
Vue.mixin(GlobalMixin);

let isLoggedIn = true; // change to false to start at the login component

new Vue({
  store,
  router,
  // eslint-disable-next-line
  render: (h): any => h(App, { props: {defaultRoute: isLoggedIn === true ? 'home' : 'login'}})
}).$mount('#app');
