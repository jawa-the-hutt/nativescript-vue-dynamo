import { VueConstructor, PluginFunction } from 'vue';
import { Route } from 'vue-router';
import componentRouter, { IRouteHistory } from "./component-router";

export async function install(Vue: VueConstructor, options: any) {

  if(install.installed) {
    console.log('not installed')
    return;
  } else {
    const appMode =  options.appMode === undefined || 'native' ? 'native' : 'web';
    componentRouter(options.store, options.router, options.routes, appMode).then(() => {
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
              options.router.push({ name: this.$props.defaultRoute, params: { routeHistoryName: this.$props.routeHistoryName , parentRouteHistoryName: this.$props.parentRouteHistoryName }});
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
        options.router.push({ name: routeHistory.routeHistory[routeHistory.routeHistory.length - 2].name, params: { routeHistoryName }})
      } else {
        // we can NOT go back further in this frame so check to see if this is a child route and if so, go back to parent
        if(routeHistory.routeHistory.length === 1 && currentRoute.meta.parentRouteHistoryName ) {
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
      options.router.push({ name: newCurrentRoute.name, params: { routeHistoryName: parentRouteHistoryName, parentRouteHistoryName: newCurrentRoute.meta.parentRouteHistoryName }})
    
    }
  
    Vue.prototype.$goTo = async (name: string, routeHistoryName: string, parentRouteHistoryName?: string): Promise<void> => {
      console.log('$goTo');
  
      if(parentRouteHistoryName) {
        options.router.push({ name, params: { routeHistoryName, parentRouteHistoryName}});
      } else {
        options.router.push({ name, params: { routeHistoryName}});
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
