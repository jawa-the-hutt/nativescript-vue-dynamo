import { VueConstructor, PluginFunction } from 'vue';
import { Route, RawLocation, Location } from 'vue-router';
import componentRouter, { IRouteHistory } from "./component-router";
type ErrorHandler = (err: Error) => void;

export async function install(Vue: VueConstructor, options: any) {

  if(install.installed) {
    console.log('not installed')
    return;
  } else {
    const appMode =  options.appMode === undefined || 'native' ? 'native' : 'web';
    componentRouter(options.store, options.router, options.routes, appMode, Vue).then(() => {
        install.installed = true;
        Vue.component('Dynamo', {
          template:
            appMode === 'native' 
              ? `<Frame :id="routeHistoryName"><StackLayout><component v-bind:is="computedCurrentRoute" /></StackLayout></Frame>`
              : `<div :id="routeHistoryName"><component v-bind:is="computedCurrentRoute" /></div>`,
          data() {
            return {
            };
          },
          created() {
            // if (options.store.state.appMode === 'native') {
              Vue.prototype.$goTo( this.$props.defaultRoute, this.$props.routeHistoryName, this.$props.parentRouteHistoryName );
            // }
          },
          props: {
            routeHistoryName: {
              type: String,
              required: true
            },
            parentRouteHistoryName: {
              type: String,
              required: false
            },
            defaultRoute: {
              type: String,
              required: false
            },
          },
          computed: {
            computedCurrentRoute(): Route {
              let currentRoute!: Route;
              // @ts-ignore
              if (this.computedRouteHistory && this.computedRouteHistory.routeHistory.length > 0 ) {
                // @ts-ignore
                currentRoute = options.store.getters['ComponentRouter/getCurrentRoute'](this.$props.routeHistoryName).default
                return currentRoute;
              } else {
                return currentRoute;
              }
            },
            computedRouteHistory(): IRouteHistory {
              const routeHistory: IRouteHistory = options.store.getters['ComponentRouter/getRouteHistoryByName'](this.$props.routeHistoryName);
              return routeHistory;
            },
          },
        });
    })

    Vue.prototype.$goBack = async (routeHistoryName: string): Promise<void> => {
      console.log(`$goBack`);
      let canGoBack: boolean = false;

      if(options.appMode === 'native') {
        await import('tns-core-modules/ui/frame').then(({topmost}) => {
          canGoBack = topmost().canGoBack();
          return; 
        })

      } else if (options.appMode === 'web') {
      } else {
      }
  
      let routeHistory: IRouteHistory = await options.store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);
      const currentRoute: Route = routeHistory.routeHistory[routeHistory.routeHistory.length - 1];
  
      if(canGoBack && routeHistory.routeHistory.length > 1 ) {
        // NS thinks we can go back in the same frame.
        // going back to previous page in the frame
        Vue.prototype.$goTo(routeHistory.routeHistory[routeHistory.routeHistory.length - 2].name, routeHistoryName )
      } else {
        // we can NOT go back further in this frame so check to see if this is a child route and if so, go back to parent
        if(routeHistory.routeHistory.length === 1 && currentRoute.meta.parentRouteHistoryName && currentRoute.meta.parentRouteHistoryName !== routeHistoryName ) {
          Vue.prototype.$goBackToParent(routeHistoryName, currentRoute.meta.parentRouteHistoryName);
        };
      }
    }
    
    Vue.prototype.$goBackToParent = async (routeHistoryName: string, parentRouteHistoryName: string): Promise<void> => {
      console.log('$goBackToParent');
  
      // clear out the child router's history
      options.store.dispatch('ComponentRouter/clearRouteHistory', {routeHistoryName});
  
      // get the route history of the parent component
      const parentRouteHistory: IRouteHistory = await options.store.getters['ComponentRouter/getRouteHistoryByName'](parentRouteHistoryName);
  
      // going back to where we came from
      // go back 2 since the newest entry in the parent router stack is the component holding the Dynamo component
      const newCurrentRoute: Route = parentRouteHistory.routeHistory[parentRouteHistory.routeHistory.length - 2];
      Vue.prototype.$goTo(newCurrentRoute.name, parentRouteHistoryName, newCurrentRoute.meta.parentRouteHistoryName)
    
    }
  
    Vue.prototype.$goTo = async (location: string | Location, routeHistoryName: string, parentRouteHistoryName: string, clearHistory?: string, onComplete?: Function, onAbort?: ErrorHandler): Promise<void> => {
      console.log('$goTo');

      let tmpLocation: Location = {};
      parentRouteHistoryName = !parentRouteHistoryName ? routeHistoryName : parentRouteHistoryName;
      clearHistory = !clearHistory ? 'false' : 'true';

      if( typeof location === 'string') {
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

    }

    // Vue.mixin({
    //   beforeCreate() {
        
    //   },
    // });
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
