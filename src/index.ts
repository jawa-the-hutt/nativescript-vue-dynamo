import { VueConstructor, PluginFunction } from 'vue';
import componentRouter from "./component-router";

export function install(Vue: VueConstructor, options: any) {

  if(install.installed) {
    console.log('not installed')
    return;
  } else {
    for(const moduleName of options.moduleName) {
      console.log('not installed yet - moduleName - ', moduleName)
      install.installed = true;
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
            if (this.$store.getters[moduleName + "/getRouteHistory"].length > 0 ) {
              // @ts-ignore
              return this.$store.getters[moduleName + "/getCurrentRoute"].default;
            }
          }
        },
      });

      Vue.prototype['$' + moduleName] = componentRouter(options.store, options.router, options.routes, moduleName);
    }
  }

};

class Dynamo {
  static install: PluginFunction<never>;
}

export namespace install {
  export let installed: boolean;
}

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
