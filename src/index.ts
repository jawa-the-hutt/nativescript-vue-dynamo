import { VueConstructor, PluginFunction } from 'vue';
import componentRouter from "./component-router";
// // // import componentRouterTracker from "./component-router-tracker";

export function install(Vue: VueConstructor, options: any) {

  if(install.installed) {
    console.log('not installed')
    return;
  } else {
    // // // componentRouterTracker(options.store);
    componentRouter(options.store, options.router, options.routes);

    // for(const routeHistoryName of options.routeHistoryName) {
      // console.log('not installed yet - routeHistoryName - ', routeHistoryName)
      install.installed = true;
      Vue.component('Dynamo', {
        template:
          options.appMode === undefined
            ? `<component v-bind:is="computedCurrentRoute" />`
            : options.appMode === "web"
            ? `<div><component v-bind:is="computedCurrentRoute" /></div>`
            : `<StackLayout><component v-bind:is="computedCurrentRoute" /></StackLayout>`,
        data() {
          return {};
        },
        created() {
          // this.$store.dispatch('componentRouterTracker/updateComponentRouterModules', { routeHistoryName: this.routeHistoryName, parentRouteHistoryName: this.parentRouteHistoryName, status: true })
          
        },
        props: {
          routeHistoryName: {
            type: String,
            required: true
          },
          parentRouteHistoryName: {
            type: String,
            required: false
          }
        },
        computed: {
          computedCurrentRoute() {
            console.log('computedCurrentRoute - this.$props.routeHistoryName - ', this.$props.routeHistoryName)
            if (this.$store.getters['ComponentRouter/getRouteHistory'](this.$props.routeHistoryName).length > 0 ) {
              // @ts-ignore
              return this.$store.getters['ComponentRouter/getCurrentRoute'](this.$props.routeHistoryName).default;
            }
          }
        },
      });

      // Vue.prototype['$' + routeHistoryName] = componentRouter(options.store, options.router, options.routes, routeHistoryName);
    // }
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
