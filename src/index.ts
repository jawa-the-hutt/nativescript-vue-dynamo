import { VueConstructor, PluginFunction } from 'vue';
import { Route, Location } from 'vue-router';
import * as application from 'tns-core-modules/application';
import { topmost } from 'tns-core-modules/ui/frame';
import { isAndroid, isIOS } from "tns-core-modules/platform";

import componentRouter, { IRouteHistory } from "./component-router";
// Import vue component
import component from './dynamo.vue';


type ErrorHandler = (err: Error) => void;

export async function install(Vue: VueConstructor, options: any) {

  if(install.installed) {
    console.log('not installed')
    return;
  } else {
    const appMode =  options.appMode === undefined || 'native' ? 'native' : 'web';

    install.installed = true;

    if(appMode === 'native') {
      componentRouter(options.store, options.router, options.routes, appMode, Vue);
      Vue.component('Dynamo', component);
    }

    Vue.mixin({
      created() {
        if(appMode === 'native') {
          // @ts-ignore
          this.$interceptGoBack();
        }
      },
      methods: {
        // we need to make sure we intercept the Android back button so that we can update vuex 
        async $interceptGoBack(): Promise<void> {
          console.log(`$interceptGoBack`);
      
          // @ts-ignore
          if (isAndroid) {
            const activity = application.android.startActivity || application.android.foregroundActivity;
            activity.onBackPressed = async () => {
              console.log(`activity.onBackPressed `);
              // @ts-ignore
              this.$goBack(topmost().canGoBack());
            };
          } else {
            // we're on IOS.  Need to figure out how to handle back navigation and intercept the events
      
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
        },

        // @ts-ignore
        async $goBack (canGoBack?: boolean): Promise<void> {
          console.log(`$goBack`);
          canGoBack = canGoBack ===  undefined ? true : true ? true : false;
          const routeHistoryName =  options.router.currentRoute.meta.routeHistoryName;

          if(appMode === 'native') {
            let routeHistory: IRouteHistory = await options.store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);
            const currentRoute: Route = routeHistory.routeHistory[routeHistory.routeHistory.length - 1];
        
            if(canGoBack && routeHistory.routeHistory.length > 1 ) {
              // NS thinks we can go back in the same frame.
              // going back to previous page in the frame
              // @ts-ignore
              this.$goTo(routeHistory.routeHistory[routeHistory.routeHistory.length - 2].name, routeHistoryName )
            } else {
              // we can NOT go back further in this frame so check to see if this is a child route and if so, go back to parent
              if(routeHistory.routeHistory.length === 1 && currentRoute.meta.parentRouteHistoryName && currentRoute.meta.parentRouteHistoryName !== routeHistoryName ) {
                // @ts-ignore
                this.$goBackToParent(routeHistoryName, currentRoute.meta.parentRouteHistoryName);
              };
            }    
          } else if (appMode === 'web') {
            options.router.back();
          } else {
          }
        },
          
          // @ts-ignore
          async $goBackToParent(routeHistoryName: string, parentRouteHistoryName: string): Promise<void> {
            console.log('$goBackToParent ');

            if(appMode === 'native') {
              // clear out the child router's history
              options.store.dispatch('ComponentRouter/clearRouteHistory', {routeHistoryName});
          
              // get the route history of the parent component
              const parentRouteHistory: IRouteHistory = await options.store.getters['ComponentRouter/getRouteHistoryByName'](parentRouteHistoryName);
          
              // going back to where we came from
              // go back 2 since the newest entry in the parent router stack is the component holding the Dynamo component
              const newCurrentRoute: Route = parentRouteHistory.routeHistory[parentRouteHistory.routeHistory.length - 2];
              // @ts-ignore
              this.$goTo(newCurrentRoute.name)
            } else if (appMode === 'web') {
            } else {
            }

        
          
          },
        
          // @ts-ignore
          async $goTo(location: string | Location, clearHistory?: boolean, onComplete?: Function, onAbort?: ErrorHandler): Promise<void> {
            console.log('$goTo');

            let tmpLocation: Location = {};
            clearHistory = clearHistory === undefined || false ? false : true;

            if( typeof location === 'string') {
              // routeHistoryName = !routeHistoryName ? location : routeHistoryName;
              // parentRouteHistoryName = !parentRouteHistoryName ? routeHistoryName : parentRouteHistoryName;

              tmpLocation.name = location;
              tmpLocation.params = Object.assign({}, { clearHistory: clearHistory.toString() });

            } else {
              tmpLocation = location;
            }
      
            if (onComplete && onAbort) {
              options.router.push(tmpLocation, onComplete , onAbort )
            } else if (onComplete && !onAbort) {
              options.router.push(tmpLocation, onComplete)
            } else if (!onComplete && onAbort) {
              options.router.push(tmpLocation, onAbort)
            } else {
              options.router.push(tmpLocation)
            }
      
          },   
        },
    });
  }

};

class Dynamo {
  static install: PluginFunction<never>;
}

export namespace install {
  export let installed: boolean;
}
export { IRouteHistory};

Dynamo.install = install;

// To auto-install when vue is found
/* global window global */
let GlobalVue!: VueConstructor;
if (typeof window !== "undefined" && typeof (window as any).Vue !== 'undefined') {
  GlobalVue = (window as any).Vue;
} else if (typeof global !== "undefined" && typeof global['Vue'] !== 'undefined') {
  GlobalVue = global['Vue'];
}
if (GlobalVue) {
  GlobalVue.use(Dynamo);
}

export default Dynamo;
