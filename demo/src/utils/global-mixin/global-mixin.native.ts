import { Component, Vue } from 'vue-property-decorator';
import * as application from 'tns-core-modules/application';
import * as platform from 'nativescript-platform';
import { topmost } from 'tns-core-modules/ui/frame';
import { IRouteHistory } from '../../../../';
import * as GlobalMixinShared from './global-mixin-shared';
import router from '~/router';
import { Route } from 'vue-router';
import { Store } from 'vuex'

@Component
export default class GlobalMixinNative extends Vue {
  public shared = GlobalMixinShared;
  public routeHistoryName!: string;
  public childRouteHistoryName?: string;

  // intercept the back-button
  public async $interceptGoBack(routeHistoryName: string, childRouteHistoryName?: string): Promise<void> {
    console.log(`$interceptGoBack`);

    if (platform.android) {
      // console.log(`platform.android`);
  
      const activity = application.android.startActivity || application.android.foregroundActivity;
      activity.onBackPressed = async () => {
        console.log(`activity.onBackPressed`);
        const routeHistory: IRouteHistory =  this.$store.getters['ComponentRouter/getRouteHistoryByRouteName'](router.currentRoute.name);
        this.$goBack(routeHistory.routeHistoryName);
      };
    }
  }

  public async $goBack(routeHistoryName: string): Promise<void> {
    console.log(`$goBack`);

    let routeHistory: IRouteHistory = await this.$store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);
    const currentRoute: Route = routeHistory.routeHistory[routeHistory.routeHistory.length - 1];

    if(topmost().canGoBack()) {
      // NS thinks we can go back in the same frame.
      if(routeHistory.routeHistory.length > 1 ) {
        // going back to previous page in the frame
        router.push({ name: routeHistory.routeHistory[routeHistory.routeHistory.length - 2].name, params: { routeHistoryName }})
      } else if (routeHistory.routeHistory.length === 1 && currentRoute.meta.parentRouteHistoryName) {
        // routeHistory === 1 - so top of the frame but we have a parent route so go there
        this.$goBackToParent(routeHistoryName, currentRoute.meta.parentRouteHistoryName);
      } else{
        // NS thinks there is something back there but we have probably cleared the history so in reality, we don't want to go back
        // useful for login pages or non-secured routes
      };
    } else {
      // we can NOT go back further in this frame so check to see if this is a child route and if so, go back to parent
      if(routeHistory.routeHistory.length === 1 && currentRoute.meta.parentRouteHistoryName ) {
        this.$goBackToParent(routeHistoryName, currentRoute.meta.parentRouteHistoryName);
      };
    }
  }
  
  public async $goBackToParent(routeHistoryName: string, parentRouteHistoryName: string): Promise<void> {
    console.log('$goBackToParent');

    // clear out the child router's history
    this.$store.dispatch('ComponentRouter/clearRouteHistory', {routeHistoryName});

    // get the route history of the parent component
    const parentRouteHistory: IRouteHistory = await this.$store.getters['ComponentRouter/getRouteHistoryByName'](parentRouteHistoryName);

    // going back to where we came from
    // go back 2 since the newest entry in the parent router stack is the component holding the Dynamo component
    const newCurrentRoute: Route = parentRouteHistory.routeHistory[parentRouteHistory.routeHistory.length - 2];
    router.push({ name: newCurrentRoute.name, params: { routeHistoryName: parentRouteHistoryName, parentRouteHistoryName: newCurrentRoute.meta.parentRouteHistoryName }})
  
  }

  public async $goTo(name: string, routeHistoryName: string, parentRouteHistoryName?: string): Promise<void> {
    console.log('$goTo');

    if(parentRouteHistoryName) {
      router.push({ name, params: { routeHistoryName, parentRouteHistoryName}});
    } else {
      router.push({ name, params: { routeHistoryName}});
    }
  }
}
