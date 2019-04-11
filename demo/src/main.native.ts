import Vue from 'nativescript-vue';
import App from './App.vue';
import store from './store';
import router, { routes } from './router';

import Dynamo from '../../';
const moduleName = 'componentRouter';
Vue.prototype['$componentRouter'] = Dynamo.componentRouter( store, router, routes, 'componentRouter' );
Vue.use( Dynamo, { 
  appMode: store.state.appMode, 
  // store,
  // router,
  // routes,
  moduleName 
});

Vue.prototype['$FirstRouter'] = Dynamo.componentRouter( store, router, routes, 'FirstRouter' );
Vue.use( Dynamo, { 
  appMode: store.state.appMode, 
  // store,
  // router,
  // routes,
  moduleName 
});

// Set the following to `true` to hide the logs created by nativescript-vue
Vue.config.silent = false;
// Set the following to `false` to not colorize the logs created by nativescript-vue
// @ts-ignore
Vue.config.debug = true;

// setup NS-Vue Devtools for use
import VueDevtools from 'nativescript-vue-devtools';
Vue.use(VueDevtools, { host: '10.0.2.2' });

// @ts-ignore
import GlobalMixinNative from '@/utils/global-mixin/global-mixin';
Vue.mixin(GlobalMixinNative);

const start = async () => {

  const isLoggedIn = true; // change to false to start at the login component
  router.push(isLoggedIn === true ? 'home' : 'login');
  
  return new Vue({
    store,
    router,
    render: (h) => h('frame', [h(App)]),
  }).$start();
};

start();
