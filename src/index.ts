import { VueConstructor, PluginFunction } from 'vue';
import Router, { Route, RouteConfig } from 'vue-router';
import { Store } from 'vuex';
import componentRouter from "./component-router";

export function install(Vue: VueConstructor, options: any) {

  // if(install.installed) {
  //   console.log('not installed')
  //   return;
  // } else {
    for(const moduleName of options.moduleName) {
      console.log('not installed yet - moduleName - ', moduleName)
      //  install.installed = true;
      Vue.component("Dynamo" + moduleName, {
        template:
          options.appMode === undefined
            ? `<component v-bind:is="computedCurrentRoute" />`
            : options.appMode === "web"
            ? `<div><component v-bind:is="computedCurrentRoute" /></div>`
            : `<StackLayout><component v-bind:is="computedCurrentRoute" /></StackLayout>`,
        data() {
          return {};
        },
        computed: {
          computedCurrentRoute() {
            // @ts-ignore
            return this.$store.getters[moduleName + "/getCurrentRoute"];
          }
        },
      });

      Vue.prototype['$' + moduleName] = componentRouter(options.store, options.router, options.routes, moduleName);
    }
  // }

  // Vue.mixin({
  //   beforeCreate() {
      
  //   },
  // });
};


// let isTimeTraveling: boolean = false
// let currentPath: string = ``;

// // sync router on store change
// const unWatch = store.watch(
//   state => state.routeHistory,
//   routeHistory => {
//     console.log('dyname - starting store.watch')
//     const route  = routeHistory[routeHistory.length - 1];
//     const { fullPath } = route
//     if (fullPath === currentPath) {
//       console.log('fullPath === currentPath');
//       return
//     }
//     if (currentPath != null) {
//       console.log('currentPath != null');
//       isTimeTraveling = true
//       router.push(route)
//     }
//     currentPath = fullPath
//   },
//   // { sync: true }
// )

// // sync store on router navigation
// const removeRouteHook = router.afterEach((to: Route, from: Route) => {
//   console.log('starting afterEachUnHook');
//   try {
//     if (isTimeTraveling) {
//       console.log('we are timeTraveling so do nothing');
//       isTimeTraveling = false
//       return
//     }

//     currentPath = to.fullPath

//     //console.log('dynamo - afterEach - store - ', store);
//     store.dispatch(moduleName + '/updateRouteHistory', { to, from });
//   } catch (err) {
//     console.log('err - ', err);
//   }
// })

// return () => {
//   console.log(moduleName + ' - calling remove function for moduleName : ', moduleName);
//   // On unsync, remove router hook
//   if (removeRouteHook != null) {
//     removeRouteHook();
//   }

//   // On unsync, remove store watch
//   if (unWatch != null) {
//     unWatch();
//   }

//   // On unsync, unregister Module with store
//   store.unregisterModule(moduleName);
// }


class Dynamo {
  static install: PluginFunction<never>;
  static componentRouter(store: Store<any>, router: Router, routes: RouteConfig[], moduleName: string): PluginFunction<any> {
    console.log('moduleName - ', moduleName)
    return componentRouter( store, router, routes, moduleName );
  };
}

export namespace install {
  export let installed: boolean;
}

Dynamo.install = install;
Dynamo.componentRouter = componentRouter;


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
// export { componentRouter };
