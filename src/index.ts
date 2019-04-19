import { VueConstructor, PluginFunction } from 'vue';
import { Route, Location } from 'vue-router';
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

    if(options.appMode === 'native') {
      componentRouter(options.store, options.router, options.routes, appMode, Vue);
      Vue.component('Dynamo', component);
    }

    Vue.mixin({
      methods: {
        // @ts-ignore
        async $goBack (routeHistoryName: string, canGoBack?: boolean): Promise<void> {
        // Vue.prototype.$goBack = async (routeHistoryName: string): Promise<void> => {
          console.log(`$goBack`);
          canGoBack = canGoBack ===  undefined ? true : true ? true : false;
    
          if(options.appMode === 'native') {
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
          } else if (options.appMode === 'web') {
            options.router.back();
          } else {
          }
        },
          
          // @ts-ignore
          async $goBackToParent(routeHistoryName: string, parentRouteHistoryName: string): Promise<void> {
            console.log('$goBackToParent');

            if(options.appMode === 'native') {
              // clear out the child router's history
              options.store.dispatch('ComponentRouter/clearRouteHistory', {routeHistoryName});
          
              // get the route history of the parent component
              const parentRouteHistory: IRouteHistory = await options.store.getters['ComponentRouter/getRouteHistoryByName'](parentRouteHistoryName);
          
              // going back to where we came from
              // go back 2 since the newest entry in the parent router stack is the component holding the Dynamo component
              const newCurrentRoute: Route = parentRouteHistory.routeHistory[parentRouteHistory.routeHistory.length - 2];
              // @ts-ignore
              this.$goTo(newCurrentRoute.name, parentRouteHistoryName, newCurrentRoute.meta.parentRouteHistoryName)
            } else if (options.appMode === 'web') {
            } else {
            }

        
          
          },
        
          // @ts-ignore
          async $goTo(location: string | Location, routeHistoryName?: string, parentRouteHistoryName?: string, clearHistory?: string, onComplete?: Function, onAbort?: ErrorHandler): Promise<void> {
            console.log('$goTo');

            // if(options.appMode === 'native') {
 
            // } else if (options.appMode === 'web') {
              
            // } else {
            // }

            let tmpLocation: Location = {};
            clearHistory = !clearHistory ? 'false' : 'true';

            if( typeof location === 'string') {
              routeHistoryName = !routeHistoryName ? location : routeHistoryName;
              parentRouteHistoryName = !parentRouteHistoryName ? routeHistoryName : parentRouteHistoryName;

              tmpLocation.name = location;
              tmpLocation.params = Object.assign({}, { routeHistoryName, parentRouteHistoryName, clearHistory });

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
