import Vue from 'nativescript-vue';
import App from '~/App.vue';
import store from '~/store';
import router, { routes } from '~/router';

import Dynamo from '../../';

Vue.use(Dynamo, { 
  store,
  router,
  routes,
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
import GlobalMixin from '~/utils/global-mixin/global-mixin';
Vue.mixin(GlobalMixin);

const isLoggedIn: boolean = true; // change to false to start at the login component

new Vue({
  store,
  router,
  render: (h) => h('frame', [h(App, {props: {defaultRoute: isLoggedIn === true ? 'home' : 'login'}})]),
}).$start();

