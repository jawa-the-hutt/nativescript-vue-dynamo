import { Component, Vue } from 'vue-property-decorator';
import * as application from 'tns-core-modules/application';
import * as platform from 'nativescript-platform';
import { topmost, getFrameById } from 'tns-core-modules/ui/frame';

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
        console.log(`===================================================================`);

        console.log('onBackPressed - frame ', getFrameById('first').currentPage.toString())


        const page: string = topmost().currentPage.toString();
        console.log('onBackPressed - page ', page)
        const routeHistory =  this.$store.getters['ComponentRouter/getRouteHistoryByPage'](page);
        console.log('onBackPressed - what ', routeHistory)


        // console.log(`routeHistoryName - `, routeHistory.routeHistoryName);
        console.log(`routeHistory.routeHistory - `, routeHistory.routeHistory);
        // console.log(`routeHistory.routeHistory.meta - `, routeHistory.routeHistory.meta);

        // console.log(`childRouteHistoryName - `, childRouteHistoryName);
    
        this.$goBack(routeHistory.routeHistoryName, childRouteHistoryName);
      };
    }
  }

  public async $goBack(routeHistoryName: string, childRouteHistoryName?: string): Promise<void> {
    console.log(`$goBack`);
    console.log(`===================================================================`);

    let childRouteHistory!: Route[];
    let currentRoute!: Route;
    console.log(`routeHistoryName - `, routeHistoryName);
    console.log(`childRouteHistoryName - `, childRouteHistoryName);

    // // // routeHistoryName = routeHistoryName === undefined ? 'ComponentRouter' : routeHistoryName;
    // // // console.log(`routeHistoryName - `, routeHistoryName);

    let routeHistory: Route[] = await this.$store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);
    // console.log(`goBack - routeHistory - `, routeHistory);


    if (childRouteHistoryName) {
      childRouteHistory = await this.$store.getters['ComponentRouter/getRouteHistoryByName'](childRouteHistoryName);
      // console.log(`childRouteHistory - `, childRouteHistory);
      console.log(`childRouteHistory length - `, childRouteHistory.length);

      if(childRouteHistory && childRouteHistory.length > 0) {
        // we are actually in a child route
        console.log('we are actually in a child route')
        currentRoute = childRouteHistory[childRouteHistory.length - 1];
      }
    } else {
      currentRoute = routeHistory[routeHistory.length - 1];
    }

    // console.log(`currentRoute - `, currentRoute)

    console.log(`${topmost().currentPage} - topmost().canGoBack() - `, topmost().canGoBack())
    console.log(`routeHistory length - `, routeHistory.length);

    if(topmost().canGoBack()) {
      console.log('we can go back')
      console.log(`===================================================================`);

      // we can go back a frame
      if(childRouteHistoryName && childRouteHistory && childRouteHistory.length > 0) {
        console.log('we have a childRouteHistoryName and childRouteHistory')
        //  we have a child router and it has a route history 
        if(childRouteHistory.length === 1 && currentRoute.meta.parentRouteHistoryName ) {
          console.log('childRouteHistory === 1 and we have a parentRouteHistoryName')

          // we're going back to parent
          this.$goBackToParent(childRouteHistoryName, currentRoute);
        }

        if(childRouteHistory.length > 1) {
          console.log('childRouteHistory > 1')

          // going back to sibling
          router.push({ name: childRouteHistory[childRouteHistory.length - 2].name, params: { routeHistoryName: childRouteHistoryName, parentRouteHistoryName: routeHistoryName }})
        }
      } else {
        console.log('we do not have a childRouteHistoryName and childRouteHistory')
        // there isn't a child router
        if(routeHistory.length > 1 ) {
          console.log('routeHistory > 1')

          // going back to where we came from
          router.push({ name: routeHistory[routeHistory.length - 2].name, params: { routeHistoryName }})
        } 
      }

    } else {
      console.log('we can NOT go back')
      console.log(`===================================================================`);

      console.log(`currentRoute - `, currentRoute);
      // the current page may not be wrapped in a frame but if there is a routeHistory then somewhere up the tree there is
      if(childRouteHistoryName && childRouteHistory && childRouteHistory.length === 1 && currentRoute.meta.parentRouteHistoryName ) {
        console.log(' we have enough info to go back to parent')
        this.$goBackToParent(childRouteHistoryName, currentRoute);
      };
    }

  }
  
  public async $goBackToParent(childRouteHistoryName: string, currentRoute: Route): Promise<void> {
    console.log('$goBackToParent');
    console.log(`===================================================================`);

    // clear out the child router's history
    this.$store.dispatch('ComponentRouter/clearRouteHistory', {childRouteHistoryName});

    // get the route history of the parent component
    const routeHistory: Route[] = await this.$store.getters['ComponentRouter/getRouteHistoryByName'](currentRoute.meta.parentRouteHistoryName);
    // await this.$store.getters[currentRoute.meta.parentRouteHistoryName  + '/getRouteHistoryByName'];

    // going back to where we came from
    const newCurrentRoute = routeHistory[routeHistory.length - 2];
    router.push({ name: newCurrentRoute.name, params: { routeHistoryName: newCurrentRoute.meta.routeHistoryName, parentRouteHistoryName: newCurrentRoute.meta.parentRouteHistoryName }})
  
  }

  public async $goTo(name: string, routeHistoryName: string, childRouteHistoryName?: string, parentRouteHistoryName?: string): Promise<void> {
    console.log('$goTo');

    // // const page: Page = topmost().currentPage !== undefined ? topmost().currentPage : router.currentRoute;

    if (childRouteHistoryName) {
      if(parentRouteHistoryName) {
        console.log('$goTo - with child and parent');
        router.push({ name, params: { routeHistoryName, childRouteHistoryName, parentRouteHistoryName}});
      } else {
        console.log('$goTo - with only child');
        router.push({ name, params: { routeHistoryName, childRouteHistoryName}});
      }
    } else if (parentRouteHistoryName) {
      console.log('$goTo - with only parent');
      router.push({ name, params: { routeHistoryName, parentRouteHistoryName}});

    } else {
      console.log('$goTo - without child or parent');
      router.push({ name, params: { routeHistoryName}});
    }


  }
}
