import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixinShared from './global-mixin-shared';
import * as application from 'tns-core-modules/application';
import { topmost } from 'tns-core-modules/ui/frame';
import * as platform from 'nativescript-platform';
import { IRouteHistory } from '../../../../';
import router from '~/router';

@Component
export default class GlobalMixinNative extends Mixins(GlobalMixinShared) {


  public created() {
    this.$interceptGoBack()
  }


  // intercept the back-button
  public async $interceptGoBack(): Promise<void> {
    console.log(`$interceptGoBack`);

    if (platform.android) {
      const activity = application.android.startActivity || application.android.foregroundActivity;
      activity.onBackPressed = async () => {
        console.log(` activity.onBackPressed`);
        const routeHistory: IRouteHistory =  this.$store.getters['ComponentRouter/getRouteHistoryByRouteName'](router.currentRoute.name);
        // @ts-ignore
        this.$goBack(routeHistory.routeHistoryName, topmost().canGoBack());
      };
    }
  }
}
