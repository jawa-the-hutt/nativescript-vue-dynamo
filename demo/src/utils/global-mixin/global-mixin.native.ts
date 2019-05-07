import { Component, Mixins } from 'vue-property-decorator';
import GlobalMixinShared from './global-mixin-shared';
import * as application from 'tns-core-modules/application';
import { topmost } from 'tns-core-modules/ui/frame';


@Component
export default class GlobalMixinNative extends Mixins(GlobalMixinShared) {

  public created() {
    this.$interceptGoBack()
  }

  // intercept the back-button
  public async $interceptGoBack(): Promise<void> {
    console.log(`$interceptGoBack`);

    // @ts-ignore
    if (this.$isAndroid) {
      const activity = application.android.startActivity || application.android.foregroundActivity;
      activity.onBackPressed = async () => {
        console.log(`activity.onBackPressed `);
        // // // const routeHistory: IRouteHistory =  this.$store.getters['ComponentRouter/getRouteHistoryByName'](router.currentRoute.name);
        // @ts-ignore
        this.$goBack(topmost().canGoBack());
      };
    } else {

      // if (this.$children == undefined || this.$children.length !== 1) return
      // // console.log('We Have Children!')

      // // @ts-ignore
      // if (this.$children[0].$el._tagName == 'nativepage') {
      //   console.log('We Have NativePage!')

      //   // @ts-ignore
      //   const nativePage = this.$children[0].$el._nativeView
      //   if (nativePage != undefined) {
      //     console.log('nativepage is there')

      //     nativePage.on('navigatedTo', data => {
      //       this.notBackButton = false;
      //     })
      //     nativePage.on('navigatingFrom', data => {
      //       if (this.notBackButton != true) {
      //         console.log('going backward!')

      //         const top = topmost().canGoBack();
      //         console.log('ios canGoBack - ', top);
      //       }
      //     })
      //   }
      // }
    }
  }
}
