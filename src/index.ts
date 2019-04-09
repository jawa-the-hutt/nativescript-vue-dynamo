import Vue, { VueConstructor, PluginObject, PluginFunction } from 'vue';
import componentRouter from "./component-router";

// export let _Vue: VueConstructor;

export function install(Vue: VueConstructor, options?: any) {
  if(install.installed) {
    return;
  } else {
    install.installed = true;
   // _Vue = Vue;
    Vue.component("Dynamo", {
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
          return this.$store.getters["componentRouter/getCurrentRoute"];
        }
      }
    });
  }

  // Vue.mixin({
  //   beforeCreate() {},
  // });
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
export { componentRouter };
