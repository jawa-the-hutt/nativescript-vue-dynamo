import { VueConstructor, PluginFunction } from 'vue';
import { Route } from 'vue-router';
import componentRouter, { IRouteHistory } from "./component-router";
import { topmost, getFrameById } from 'tns-core-modules/ui/frame';

// // // import componentRouterTracker from "./component-router-tracker";

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
              topPage: '' as String,
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
            updatePage(value) {
              console.log('dynamo - updatePage - emitted value - ', value);
              this.$data.topPage = value;
            }
          },
          watch: {
            topPage(newVal, oldVal) {
              console.log('watch - topPage - oldVal', oldVal);
              console.log('watch - topPage - newVal', newVal);
              // @ts-ignore
              if (this.computedRouteHistory && this.computedRouteHistory.length > 0 ) {
                // @ts-ignore
                const route = this.computedRouteHistory[this.computedRouteHistory.length - 1];
                    
                if(route.meta) {
                  route.meta.currentPage = newVal;
                  this.$store.dispatch('ComponentRouter/updateRouteHistory', { routeHistoryName: this.$props.routeHistoryName, to: route });

                }
              }
            }
          },
          computed: {
            computedCurrentRoute() {
              console.log('computedCurrentRoute - this.$props.routeHistoryName - ', this.$props.routeHistoryName);

              // @ts-ignore
              if (this.computedRouteHistory && this.computedRouteHistory.length > 0 ) {
                // // @ts-ignore
                // console.log('computedCurrentRoute - this.computedRouteHistory - ', this.computedRouteHistory)
                // @ts-ignore
                return this.$store.getters['ComponentRouter/getCurrentRoute'](this.$props.routeHistoryName).default;
              }
            },
            computedRouteHistory() {
              console.log('computedRouteHistory - this.$props.routeHistoryName - ', this.$props.routeHistoryName);
              const routeHisotry = this.$store.getters['ComponentRouter/getRouteHistoryByName'](this.$props.routeHistoryName);
              return routeHisotry;
            },
            // // // computedTopPage() {
            // // //   // @ts-ignore
            // // //   console.log('computedTopPage - this.$data.topPage - ', this.$data.topPage);

            // // //   // @ts-ignore
            // // //   if (this.computedRouteHistory && this.computedRouteHistory.length > 0 ) {
            // // //     // @ts-ignore
            // // //     const topRoute = this.computedRouteHistory[0];
                    
            // // //     if(topRoute.meta) {
            // // //       topRoute.meta.currentPage = this.$data.topPage;
            // // //       this.$store.dispatch('ComponentRouter/updateRouteHistory', { routeHistoryName: this.$props.routeHistoryName, to: topRoute });
            // // //       console.log('firstPage - ', this.$data.topPage)
            // // //       return this.$data.topPage;
            // // //     }
            // // //   }


              
            // // // //   // // @ts-ignore
            // // // //   // if (this.$el && this.computedRouteHistory && this.computedRouteHistory.length > 0 ) {
            // // // //   //   // @ts-ignore
            // // // //   //   if (this.$el._nativeView) {
            // // // //   //     // @ts-ignore
            // // // //   //     const firstPage = this.$el._nativeView.__vue_element_ref__.childNodes[0]._nativeView.toString();
            // // // //   //     // @ts-ignore
            // // // //   //     const topRoute = this.computedRouteHistory[0];
                  
            // // // //   //     if(topRoute.meta) {
            // // // //   //       topRoute.meta.currentPage = firstPage;
            // // // //   //       this.$store.dispatch('ComponentRouter/updateRouteHistory', { routeHistoryName: this.$props.routeHistoryName, to: topRoute });
            // // // //   //       return firstPage;
            // // // //   //     }
            // // // //   //   }
            // // // //   // }
            // // // }
          },
        });



      // }
    })

    // Vue.mixin({
    //   mounted() {
    //     // @ts-ignore
    //     // if (this.$el) {
    //     //   console.log('mixin - mounted - this.$el is there')
    //     //   // @ts-ignore
    //     //   if (this.$el._nativeView) {
    //     //     // @ts-ignore
    //     //     console.log('mixin - mounted - this.$el._nativeView.toString() - ', this.$el._nativeView.toString())
    //     //   }
    //     // }
    //   }
    // })

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
