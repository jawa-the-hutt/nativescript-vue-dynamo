var NativescriptVueDynamo=(function(exports,application,frame,platform,clone,vuePropertyDecorator){'use strict';clone=clone&&clone.hasOwnProperty('default')?clone['default']:clone;const componentRouter = async (store, router, routes, appMode, Vue) => {
    console.log('starting componentRouter function');
    try {
        let recentRouteChange;
        const moduleName = 'ComponentRouter';
        if (!store.state[moduleName]) {
            store.registerModule(moduleName, {
                namespaced: true,
                state: {
                    routeHistory: [],
                },
                mutations: {
                    updateRouteHistory(state, routeHistory) {
                        state.routeHistory = routeHistory;
                    }
                },
                actions: {
                    updateRouteHistory({ state, commit }, payload) {
                        let newRouteHistory;
                        const routeHistoryName = payload.routeHistoryName;
                        const to = payload.to;
                        const from = payload.from;
                        let clearHistory = false;
                        if (payload.to.params && payload.to.params.clearHistory === 'true') {
                            clearHistory = true;
                        }
                        if (state) {
                            newRouteHistory = clone(state.routeHistory);
                        }
                        const index = newRouteHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);
                        if (!clearHistory) {
                            if (index > -1) {
                                const routeHistory = newRouteHistory[index].routeHistory;
                                if (routeHistory.length > 1 && to.fullPath === routeHistory[routeHistory.length - 2].fullPath
                                    && (!to.params || (to.params && routeHistory[routeHistory.length - 2].params && to.params.defaultRoute === routeHistory[routeHistory.length - 2].params.defaultRoute))) {
                                    routeHistory.pop();
                                    if (routeHistory.length === 0) {
                                        newRouteHistory.splice(index, 1);
                                    }
                                    else {
                                        recentRouteChange = { routeHistoryName, routeHistory: [to] };
                                    }
                                    commit('updateRouteHistory', newRouteHistory);
                                }
                                else if (routeHistory.length > 0 && to.fullPath === routeHistory[routeHistory.length - 1].fullPath) {
                                    recentRouteChange = { routeHistoryName, routeHistory: [to] };
                                    commit('updateRouteHistory', newRouteHistory);
                                }
                                else {
                                    routeHistory.push(to);
                                    recentRouteChange = { routeHistoryName, routeHistory: [to] };
                                    commit('updateRouteHistory', newRouteHistory);
                                }
                            }
                            else {
                                recentRouteChange = { routeHistoryName, routeHistory: [to] };
                                newRouteHistory.push(recentRouteChange);
                                commit('updateRouteHistory', newRouteHistory);
                            }
                        }
                        else {
                            newRouteHistory.splice(index, 1);
                            recentRouteChange = { routeHistoryName, routeHistory: [to] };
                            newRouteHistory.push(recentRouteChange);
                            commit('updateRouteHistory', newRouteHistory);
                        }
                    },
                    clearRouteHistory({ state, commit }, payload) {
                        let newRouteHistory;
                        if (payload) {
                            const routeHistoryName = payload.routeHistoryName;
                            if (state) {
                                newRouteHistory = clone(state.routeHistory);
                            }
                            const index = newRouteHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);
                            newRouteHistory.splice(index, 1);
                            commit('updateRouteHistory', newRouteHistory);
                        }
                        else {
                            newRouteHistory = [];
                            commit('updateRouteHistory', newRouteHistory);
                        }
                    }
                },
                getters: {
                    getCurrentRoute: (state) => (routeHistoryName) => {
                        try {
                            const index = state.routeHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);
                            if (index > -1 && state.routeHistory[index].routeHistory.length > 0) {
                                return state.routeHistory[index].routeHistory;
                            }
                            else {
                                return undefined;
                            }
                        }
                        catch (err) {
                            console.log(err);
                        }
                    },
                    getRouteHistoryByName: (state) => (routeHistoryName) => {
                        try {
                            if (routeHistoryName) {
                                const index = state.routeHistory
                                    .findIndex((baseRouteHistory) => baseRouteHistory.routeHistoryName === routeHistoryName);
                                if (index > -1 && state.routeHistory[index].routeHistory && state.routeHistory[index].routeHistory.length > 0) {
                                    return state.routeHistory[index];
                                }
                                else {
                                    return undefined;
                                }
                            }
                            else {
                                return undefined;
                            }
                        }
                        catch (err) {
                            console.log(err);
                        }
                    },
                    getRouteHistoryByRouteName: (state) => (name) => {
                        try {
                            if (name) {
                                const routeHistory = state.routeHistory
                                    .filter((baseRouteHistory) => baseRouteHistory.routeHistory.some((route) => route.name === name));
                                if (routeHistory.length > 0) {
                                    return routeHistory[0];
                                }
                                else {
                                    return undefined;
                                }
                            }
                            else {
                                return undefined;
                            }
                        }
                        catch (err) {
                            console.log(err);
                        }
                    },
                    getRouteHistoryByPage: (state) => (page) => {
                        try {
                            if (page) {
                                const routeHistory = state.routeHistory
                                    .filter((baseRouteHistory) => baseRouteHistory.routeHistory.some((route) => route.meta.currentPage === page));
                                if (routeHistory.length > 0) {
                                    return routeHistory[0];
                                }
                                else {
                                    return undefined;
                                }
                            }
                            else {
                                return undefined;
                            }
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                }
            });
            let isTimeTraveling = false;
            let currentPath = ``;
            store.watch(state => state.ComponentRouter.routeHistory, (newValue, oldValue) => {
                const route = recentRouteChange.routeHistory[0];
                const { fullPath } = route;
                if (fullPath === currentPath) {
                    return;
                }
                if (currentPath !== null) {
                    isTimeTraveling = true;
                    Vue.prototype.$goTo(route.name, recentRouteChange.routeHistoryName);
                }
                currentPath = fullPath;
            }, {
                deep: true
            });
            router.afterEach((to, from) => {
                try {
                    let routeHistoryName = '';
                    if (to.matched.length > 1 && to.path === to.matched[0].path) {
                        routeHistoryName = to.matched[0].meta.routeHistoryName;
                    }
                    else {
                        routeHistoryName = to.meta.routeHistoryName;
                    }
                    const routeHistory = store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);
                    if (isTimeTraveling || (routeHistory && routeHistory.routeHistory.length > 0 && to.fullPath === routeHistory.routeHistory[routeHistory.routeHistory.length - 1].fullPath)) {
                        isTimeTraveling = false;
                        return;
                    }
                    currentPath = to.fullPath;
                    store.dispatch('ComponentRouter/updateRouteHistory', { routeHistoryName, to, from });
                }
                catch (err) {
                    console.log('err - ', err);
                }
            });
            return;
        }
        else {
            return Error(`The module named: ${moduleName} already exists in the store!`);
        }
    }
    catch (err) {
        throw err;
    }
};/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}let Dynamo = class Dynamo extends vuePropertyDecorator.Vue {
    constructor() {
        super(...arguments);
        this.componentKey = 0;
        this.getMatchingRouteRecord = (routeHistory) => {
            const { matched } = routeHistory[routeHistory.length - 1];
            const { path } = routeHistory[routeHistory.length - 1];
            return matched.filter((record) => Object.keys(record).some((key) => record[key] && record[key] === path));
        };
    }
    created() {
        this._appMode = this.appMode === undefined ? 'native' : this.appMode === 'native' ? 'native' : 'web';
        if (this._appMode === 'native') {
            this.$root.$goTo(this.defaultRoute);
        }
    }
    eventHandler(e) {
        this.$emit(this.routeHistoryName + '-event-handler', e);
    }
    get computedComponentKey() {
        this.componentKey += 1;
        return this.componentKey;
    }
    get computedCurrentRoute() {
        let routeHistory;
        if (this.computedRouteHistory && this.computedRouteHistory.routeHistory.length > 0) {
            routeHistory = this.$store.getters['ComponentRouter/getCurrentRoute'](this.routeHistoryName);
            this.currentRoute = this.getMatchingRouteRecord(routeHistory);
            if (routeHistory[routeHistory.length - 1].params) {
                this.routeParams = routeHistory[routeHistory.length - 1].params;
            }
            return this.currentRoute[0].components.default;
        }
        else {
            return undefined;
        }
    }
    get computedRouteHistory() {
        const routeHistory = this.$store.getters['ComponentRouter/getRouteHistoryByName'](this.routeHistoryName);
        return routeHistory;
    }
    get getIsNativeMode() {
        return this._appMode === 'native' ? true : false;
    }
};
__decorate([
    vuePropertyDecorator.Prop({ required: true })
], Dynamo.prototype, "routeHistoryName", void 0);
__decorate([
    vuePropertyDecorator.Prop({ required: true })
], Dynamo.prototype, "defaultRoute", void 0);
__decorate([
    vuePropertyDecorator.Prop({ required: false })
], Dynamo.prototype, "functionHandler", void 0);
__decorate([
    vuePropertyDecorator.Prop({ required: false })
], Dynamo.prototype, "appMode", void 0);
Dynamo = __decorate([
    vuePropertyDecorator.Component({
        name: 'Dynamo',
    })
], Dynamo);
var script = Dynamo;function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('StackLayout',[(_vm.getIsNativeMode)?_c('Frame',{attrs:{"id":_vm.routeHistoryName}},[_c('StackLayout',[_c(_vm.computedCurrentRoute,_vm._b({key:_vm.computedComponentKey,tag:"component",attrs:{"functionHandler":_vm.functionHandler},on:{"dynamo-event":_vm.eventHandler}},'component',_vm.routeParams,false))],1)],1):_vm._e()],1)};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var component = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );let router;
let store;
let appMode;
async function install(Vue, options) {
    if (install.installed) {
        console.log('not installed');
        return;
    }
    else {
        appMode = options.appMode === undefined || 'native' ? 'native' : 'web';
        install.installed = true;
        if (appMode === 'native') {
            store = options.store;
            router = options.router;
            componentRouter(store, router, options.routes, appMode, Vue);
            Vue.component('Dynamo', component);
        }
        Vue.mixin({
            created() {
                if (appMode === 'native') {
                    this.$interceptGoBack();
                }
            },
            methods: {
                async $interceptGoBack() {
                    interceptGoBack();
                },
                async $goBack(canGoBack) {
                    goBack(canGoBack);
                },
                async $goBackToParent(routeHistoryName, parentRouteHistoryName) {
                    goBackToParent(routeHistoryName, parentRouteHistoryName);
                },
                async $goTo(location, clearHistory, onComplete, onAbort) {
                    goTo(location, clearHistory, onComplete, onAbort);
                }
            },
        });
    }
}
const interceptGoBack = async () => {
    console.log(`$interceptGoBack`);
    if (platform.isAndroid) {
        const activity = application.android.startActivity || application.android.foregroundActivity;
        activity.onBackPressed = async () => {
            console.log(`activity.onBackPressed `);
            goBack(frame.topmost().canGoBack());
        };
    }
};
const goBack = async (canGoBack) => {
    console.log(`$goBack`);
    canGoBack = canGoBack === undefined ? true : true;
    const routeHistoryName = router.currentRoute.meta.routeHistoryName;
    if (appMode === 'native') {
        let routeHistory = await store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);
        const currentRoute = routeHistory.routeHistory[routeHistory.routeHistory.length - 1];
        if (canGoBack && routeHistory.routeHistory.length > 1) {
            goTo(routeHistory.routeHistory[routeHistory.routeHistory.length - 2].name, routeHistoryName);
        }
        else {
            if (routeHistory.routeHistory.length === 1 && currentRoute.meta.parentRouteHistoryName && currentRoute.meta.parentRouteHistoryName !== routeHistoryName) {
                goBackToParent(routeHistoryName, currentRoute.meta.parentRouteHistoryName);
            }
        }
    }
    else if (appMode === 'web') {
        router.back();
    }
};
const goBackToParent = async (routeHistoryName, parentRouteHistoryName) => {
    console.log('$goBackToParent ');
    if (appMode === 'native') {
        store.dispatch('ComponentRouter/clearRouteHistory', { routeHistoryName });
        const parentRouteHistory = await store.getters['ComponentRouter/getRouteHistoryByName'](parentRouteHistoryName);
        const newCurrentRoute = parentRouteHistory.routeHistory[parentRouteHistory.routeHistory.length - 2];
        goTo(newCurrentRoute.name);
    }
};
const goTo = async (location, clearHistory, onComplete, onAbort) => {
    console.log('$goTo');
    let tmpLocation = {};
    clearHistory = clearHistory === undefined || false ? false : true;
    if (typeof location === 'string') {
        tmpLocation.name = location;
        tmpLocation.params = Object.assign({}, { clearHistory: clearHistory.toString() });
    }
    else {
        tmpLocation = location;
    }
    if (onComplete && onAbort) {
        router.push(tmpLocation, onComplete, onAbort);
    }
    else if (onComplete && !onAbort) {
        router.push(tmpLocation, onComplete);
    }
    else if (!onComplete && onAbort) {
        router.push(tmpLocation, onAbort);
    }
    else {
        router.push(tmpLocation);
    }
};
class Dynamo$1 {
}
(function (install) {
})(install || (install = {}));
Dynamo$1.install = install;
let GlobalVue;
if (typeof window !== "undefined" && typeof window.Vue !== 'undefined') {
    GlobalVue = window.Vue;
}
else if (typeof global !== "undefined" && typeof global['Vue'] !== 'undefined') {
    GlobalVue = global['Vue'];
}
if (GlobalVue) {
    GlobalVue.use(Dynamo$1);
}exports.default=Dynamo$1;exports.goBack=goBack;exports.goBackToParent=goBackToParent;exports.goTo=goTo;exports.install=install;exports.interceptGoBack=interceptGoBack;return exports;}({},application,frame,platform,clone,vuePropertyDecorator));