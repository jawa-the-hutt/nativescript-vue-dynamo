import Vue from 'vue';

export const $login = async (routeHistoryName: string): Promise<void> => {
  console.log('starting global-mixin login');
  try{
    Vue.prototype.$goTo('home', routeHistoryName, undefined, 'true');
  } catch (err) {
    throw err;
  }
}

export const $logout = async (routeHistoryName: string): Promise<void> => {
  console.log('starting global-mixin logout');
  try{
    Vue.prototype.$goTo('login', routeHistoryName, undefined, 'true');
  } catch (err) {
    throw err;
  }
}
