import { Component, Vue } from 'vue-property-decorator';

@Component
export default class GlobalMixinShared extends Vue {

  public async $login(routeHistoryName: string): Promise<void> {
    console.log('starting global-mixin login');
    try{
      // @ts-ignore
      this.$goTo('home', true);
    } catch (err) {
      throw err;
    }
  }
  
  public async $logout(routeHistoryName: string): Promise<void> {
    console.log('starting global-mixin logout');
    try{
      // @ts-ignore
      this.$goTo('login', true);
    } catch (err) {
      throw err;
    }
  }

}



