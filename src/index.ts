import { VueConstructor, PluginFunction } from 'vue';
import { Route } from 'vue-router';
import componentRouter, { IRouteHistory } from "./component-router";

export async function install(Vue: VueConstructor, options: any) {

  if(install.installed) {
    console.log('not installed')
    return;
  } else {
    // // // componentRouterTracker(options.store);
    componentRouter(options.store, options.router, options.routes, options.appMode).then(() => {
      console.log('back from componentRouter')
      // for(const routeHistoryName of options.routeHistoryName) {
        // console.log('not installed yet - routeHistoryName - ', routeHistoryName)
        install.installed = true;
        Vue.component('Dynamo', {
          template:
            options.appMode === undefined
              ? `<component v-bind:is="computedCurrentRoute" v-on:event="updatePage" />`
              : options.appMode === "web"
              ? `<div><component v-bind:is="computedCurrentRoute" v-on:event="updatePage"/></div>`
              : `<Frame :id="routeHistoryName"><StackLayout><component v-bind:is="computedCurrentRoute" v-on:event="updatePage" /></StackLayout></Frame>`,
          data() {
            return {
              topPage: 'Page(-1)' as String,
            };
          },
          created() {
            // this.$store.dispatch('componentRouterTracker/updateComponentRouterModules', { routeHistoryName: this.routeHistoryName, parentRouteHistoryName: this.parentRouteHistoryName, status: true })
            // if(this.$props.defaultRoute && this.$props.routeHistoryName) {
            //   console.log('pushing default route')
            //   this.$router.push({ name: this.$props.defaultRoute, params: { routeHistoryName: this.$props.routeHistoryName, parentRouteHistoryName: this.$props.parentRouteHistoryName}});
            // }
            // @ts-ignore
            // this.$props.topPage = this.computedTopPage;
            // console.log('created - this.$data.topPage - ', this.$props.topPage)
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
          methods: {
            updatePage(value): void {
              this.$data.topPage = value;
            }
          },
          watch: {
            topPage(newVal, oldVal) {
              // @ts-ignore
              if (this.computedRouteHistory && this.computedRouteHistory.routeHistory.length > 0 ) {
                // @ts-ignore
                const route: Route = this.computedRouteHistory.routeHistory[this.computedRouteHistory.routeHistory.length - 1];
                if(route.meta) {
                  route.meta.currentPage = newVal;
                  this.$store.dispatch('ComponentRouter/updateRouteHistory', { routeHistoryName: this.$props.routeHistoryName, to: route });

                }
              }
            }
          },
          computed: {
            computedCurrentRoute(): Route {
              let currentRoute!: Route;
              // @ts-ignore
              if (this.computedRouteHistory && this.computedRouteHistory.routeHistory.length > 0 ) {
                // @ts-ignore
                currentRoute = this.$store.getters['ComponentRouter/getCurrentRoute'](this.$props.routeHistoryName).default
                // if(currentRoute.meta) {
                //   currentRoute.meta.currentPage = options.router.currentRoute.name;
                //   this.$store.dispatch('ComponentRouter/updateRouteHistory', { routeHistoryName: this.$props.routeHistoryName, to: currentRoute });

                // }
                return currentRoute;
              } else {
                return currentRoute;
              }
            },
            computedRouteHistory(): IRouteHistory {
              const routeHistory: IRouteHistory = this.$store.getters['ComponentRouter/getRouteHistoryByName'](this.$props.routeHistoryName);
              return routeHistory;
            },
          },
        });



      // }
    })

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
