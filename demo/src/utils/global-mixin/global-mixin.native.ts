import { Component, Vue } from 'vue-property-decorator';
import * as application from 'tns-core-modules/application';
import * as platform from 'nativescript-platform';
import { topmost } from 'tns-core-modules/ui/frame';
import * as GlobalMixinShared from './global-mixin-shared';
import router from '~/router';
import { Route } from 'vue-router';
import {Store } from 'vuex'

@Component
export default class GlobalMixinNative extends Vue {
  public shared = GlobalMixinShared;

  // intercept the back-button
  public async $GoBack(moduleName: string, childModuleName?: string): Promise<void> {
    console.log(`$GoBack`);

    if (platform.android) {
      console.log(`platform.android`);
  
      const activity = application.android.startActivity || application.android.foregroundActivity;
      activity.onBackPressed = async () => {
        console.log(`activity.onBackPressed`);
        this.$AndroidGoBack(moduleName, childModuleName);
      };
    }
  }

  public async $AndroidGoBack(moduleName: string, childModuleName?: string): Promise<void> {
    console.log(`$GoBack`);
    let childRouteHistory!: Route[];
    let currentRoute!: Route;
    console.log(`moduleName - `, moduleName);
    console.log(`childModuleName - `, childModuleName);

    moduleName = moduleName === undefined ? 'ComponentRouter' : moduleName;
    console.log(`moduleName - `, moduleName);

    let routeHistory: Route[] = await this.$store.getters[moduleName + '/getRouteHistory'];
    // console.log(`routeHistory - `, routeHistory);


    if (childModuleName) {
      childRouteHistory = await this.$store.getters[childModuleName + '/getRouteHistory'];
      console.log(`childRouteHistory - `, childRouteHistory);
      console.log(`childRouteHistory length - `, childRouteHistory.length);

      if(childRouteHistory && childRouteHistory.length > 1) {
        // we are actually in a child route
        currentRoute = childRouteHistory[childRouteHistory.length - 1];
      }
    } else {
      currentRoute = routeHistory[routeHistory.length - 1];
    }

    // console.log(`currentRoute - `, currentRoute)

    console.log(`${topmost().currentPage} - topmost().canGoBack() - `, topmost().canGoBack())
    console.log(`routeHistory length - `, routeHistory.length);

    if(topmost().canGoBack()) {
      // we can go back a frame
      if(childModuleName && childRouteHistory && childRouteHistory.length > 0) {
        console.log('we have a childModuleName and childRouteHistory')
        //  we have a child router and it has a route history 
        if(childRouteHistory.length === 1 && currentRoute.meta.parentModuleName ) {
          console.log('childRouteHistory === 1 and we have a parentModuleName')

          // we're going back to parent
          this.$GoBackToParent(childModuleName, currentRoute);
        }

        if(childRouteHistory.length > 1) {
          console.log('childRouteHistory > 1')

          // going back to sibling
          router.push({ name: childRouteHistory[childRouteHistory.length - 2].name, params: { moduleName: childModuleName, parentModuleName: moduleName }})
        }
      } else {
        console.log('we do not have a childModuleName and childRouteHistory')
        // there isn't a child router
        if(routeHistory.length > 1 ) {
          console.log('routeHistory > 1')

          // going back to where we came from
          router.push({ name: routeHistory[routeHistory.length - 2].name, params: { moduleName }})
        } 
      }

    } else {
      // the current page may not be wrapped in a frame but if there is a routeHistory then somewhere up the tree there is
      if(childModuleName && childRouteHistory && childRouteHistory.length === 1 && currentRoute.meta.parentModuleName ) {
        console.log(' we have enough info to go back to parent')
        this.$GoBackToParent(childModuleName, currentRoute);
      };
    }

  }
  
  public async $GoBackToParent(childModuleName: string, currentRoute: Route): Promise<void> {
    console.log('$GoBackToParent');

    // clear out the child router's history
    this.$store.dispatch(childModuleName + '/clearRouteHistory');

    // get the route history of the parent component
    const routeHistory: Route[] = await this.$store.getters[currentRoute.meta.parentModuleName  + '/getRouteHistory'];

    // going back to where we came from
    const newCurrentRoute = routeHistory[routeHistory.length - 2];
    router.push({ name: newCurrentRoute.name, params: { moduleName: newCurrentRoute.meta.moduleName, parentModuleName: newCurrentRoute.meta.parentModuleName }})
  
  }
}
