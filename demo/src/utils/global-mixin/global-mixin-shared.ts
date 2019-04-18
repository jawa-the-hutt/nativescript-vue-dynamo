import { Component, Vue } from 'vue-property-decorator';


@Component
export default class GlobalMixinShared extends Vue {

  public async $login(routeHistoryName: string): Promise<void> {
    console.log('starting global-mixin login');
    try{
      Vue.prototype.$goTo('home', routeHistoryName, undefined, 'true');
    } catch (err) {
      throw err;
    }
  }
  
  public async $logout(routeHistoryName: string): Promise<void> {
    console.log('starting global-mixin logout');
    try{
      Vue.prototype.$goTo('login', routeHistoryName, undefined, 'true');
    } catch (err) {
      throw err;
    }
  }

}



