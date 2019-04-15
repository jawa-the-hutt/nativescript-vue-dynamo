import Vue from 'nativescript-vue';
import App from '~/App.vue';
import store from '~/store';
import router, { routes } from '~/router';

import Dynamo from '../../';

Vue.use( Dynamo, { 
  appMode: store.state.appMode, 
  store,
  router,
  routes,
});

// Set the following to `true` to hide the logs created by nativescript-vue
Vue.config.silent = true;
// Set the following to `false` to not colorize the logs created by nativescript-vue
// @ts-ignore
Vue.config.debug = true;

// setup NS-Vue Devtools for use
import VueDevtools from 'nativescript-vue-devtools';
Vue.use(VueDevtools, { host: '10.0.2.2' });

// @ts-ignore
import GlobalMixinNative from '~/utils/global-mixin/global-mixin';
Vue.mixin(GlobalMixinNative);

// const start = async () => {

  const isLoggedIn = true; // change to false to start at the login component
  const name = isLoggedIn === true ? 'home' : 'login'
  router.push({name, params: { routeHistoryName: 'main'}});
  
  // return 
  new Vue({
    store,
    router,
    render: (h) => h('frame', [h(App)]),
  }).$start();
// };

// start();
