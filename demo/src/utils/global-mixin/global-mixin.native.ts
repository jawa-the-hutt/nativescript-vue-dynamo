import { Component, Vue } from 'vue-property-decorator';
import * as GlobalMixinShared from './global-mixin-shared';
import * as application from 'tns-core-modules/application';
import * as platform from 'nativescript-platform';
import { IRouteHistory } from '../../../../';
import router from '~/router';

@Component
export default class GlobalMixinNative extends Vue {
  public shared = GlobalMixinShared;

  // intercept the back-button
  public async $interceptGoBack(): Promise<void> {
    console.log(`$interceptGoBack`);

    if (platform.android) {
      const activity = application.android.startActivity || application.android.foregroundActivity;
      activity.onBackPressed = async () => {
        console.log(` activity.onBackPressed`);
        const routeHistory: IRouteHistory =  this.$store.getters['ComponentRouter/getRouteHistoryByRouteName'](router.currentRoute.name);
        // @ts-ignore
        this.$goBack(routeHistory.routeHistoryName);
      };
    }
  }
}
