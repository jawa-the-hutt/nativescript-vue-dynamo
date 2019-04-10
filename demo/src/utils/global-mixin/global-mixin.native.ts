import { Component, Vue } from 'vue-property-decorator';
import * as application from 'tns-core-modules/application';
import * as platform from 'nativescript-platform';
import { topmost } from 'tns-core-modules/ui/frame';
import * as GlobalMixinShared from './global-mixin-shared';
import router from '~/router';

@Component
export default class GlobalMixinNative extends Vue {
  public shared = GlobalMixinShared;

  public created() {
    (this as any).$CanGoBack();
  }

  // intercept the back-button
  public async $CanGoBack(moduleName?: string): Promise<void> {
    if (platform.android) {
      const activity = application.android.startActivity || application.android.foregroundActivity;
      activity.onBackPressed = async () => {
        console.log(`${topmost().currentPage} - topmost().canGoBack() - `, topmost().canGoBack())
        if(topmost().canGoBack()) {
          moduleName = moduleName === undefined ? 'componentRouter' : moduleName
          const routeHistory = await this.$store.getters[moduleName + '/getRouteHistory'];
          console.log(`routeHistory.length - `, routeHistory.length)
          if(routeHistory.length > 1 ) {
            router.back();
          }
        }
      };
    }
  }

}
