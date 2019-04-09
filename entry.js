import Dynamo from "./components/dynamo";
import componentRouter from "./src/component-router";

// install function executed by Vue.use()
function install(Vue, options) {
  if (install.installed) return;
  install.installed = true;
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

// Create module definition for Vue.use()
const plugin = {
  install
};

// To auto-install when vue is found
/* global window global */
let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(plugin);
}

// Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()
Dynamo.install = install;

// Export component by default
export default Dynamo;

export { componentRouter };

// // const version = '__VERSION__'

// // const install = (Vue: typeof vue, options?: any): void => {

//   Vue.component('Dynamo', {
//     template: options.appMode === undefined ? `<component v-bind:is="computedCurrentRoute" />` :
// eslint-disable-next-line max-len
//     options.appMode === 'web' ? `<div><component v-bind:is="computedCurrentRoute" /></div>` :  `<StackLayout><component v-bind:is="computedCurrentRoute" /></StackLayout>`,
//     data() {
//       return {};
//     },
//     computed: {
//       computedCurrentRoute() {
//         // @ts-ignore
//         return this.$store.getters['componentRouter/getCurrentRoute'];
//       },
//     },
//   })
// }

// // const Dynamo: PluginObject<VueConstructor> = {
// //   install,
// //   // version
// // }
// // export default Dynamo

// export {
//   componentRouter,
// }

// // if (typeof window !== 'undefined' && window.Vue) {
// //   window.Vue.use(Dynamo)
// // }
