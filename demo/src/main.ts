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
  moduleName: [ 'ComponentRouter', 'FirstRouter' ] 
});

// @ts-ignore
import GlobalMixinWeb from '~/utils/global-mixin/global-mixin';
Vue.mixin(GlobalMixinWeb);

// const start = async () => {
  const isLoggedIn = true; // change to false to start at the login component
  const name = isLoggedIn === true ? 'home' : 'login'
  router.push({name, params: { moduleName: 'ComponentRouter'}});
  
  // return 
  new Vue({
    router,
    store,
    render: (h) => h(App, { props: { isLoggedIn }})
  }).$mount('#app');
// };

// start();