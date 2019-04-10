import Vue from 'vue';
import App from '~/App.vue';
import router, { routes } from './router';
import store from './store';

Vue.config.productionTip = false;

// import Dynamo, { componentRouter } from '../../';
// componentRouter(store, router, routes );
// Vue.use(Dynamo, { appMode: store.state.appMode });

// @ts-ignore
import GlobalMixinWeb from '~/utils/global-mixin/global-mixin';
Vue.mixin(GlobalMixinWeb);

const start = async () => {
  const isLoggedIn = true; // change to false to start at the login component
  router.push(isLoggedIn === true ? 'home' : 'login');
  
  return new Vue({
    router,
    store,
    render: (h) => h(App)
  }).$mount('#app');
};

start();