import { VueConstructor, PluginFunction } from 'vue';
import Router, { Route, RouteConfig } from 'vue-router';
import { Store } from 'vuex';
import componentRouter from "./component-router";

export function install(Vue: VueConstructor, options: any) {

  // if(install.installed) {
  //   console.log('not installed')
  //   return;
  // } else {
  //   console.log('not installed yet - options.moduleName - ', options.moduleName)
    install.installed = true;
    Vue.component("Dynamo-"+options.moduleName, {
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
          return this.$store.getters[options.moduleName + "/getCurrentRoute"];
        }
      },
      // mounted(){
      //   Vue.prototype['$' + options.moduleName] = componentRouter(options.store, options.router, options.routes, options.moduleName);
      // }
    });
  // }

  // Vue.mixin({
  //   beforeCreate() {
      
  //   },
  // });
};



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
