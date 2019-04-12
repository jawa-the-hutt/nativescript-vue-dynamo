(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=g||self,f(g.NativescriptVueDynamo={}));}(this,function(exports){'use strict';const componentRouter = (store, router, routes, moduleName) => {
    try {
        moduleName = moduleName !== undefined ? moduleName : 'ComponentRouter';
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
                        const to = payload.to;
                        if (payload.to.meta && payload.to.params && payload.to.params.moduleName) {
                            to.meta.moduleName = payload.to.params.moduleName;
                        }
                        if (payload.to.meta && payload.to.params && payload.to.params.parentModuleName) {
                            to.meta.parentModuleName = payload.to.params.parentModuleName;
                        }
                        if (payload.to.meta && payload.to.params && payload.to.params.childModuleName) {
                            to.meta.childModuleName = payload.to.params.childModuleName;
                        }
                        if (!payload.to.params.clearHistory) {
                            if (state) {
                                newRouteHistory = [...state.routeHistory];
                            }
                            if (newRouteHistory.length > 1 && to.fullPath === newRouteHistory[newRouteHistory.length - 2].fullPath) {
                                newRouteHistory.pop();
                                commit('updateRouteHistory', newRouteHistory);
                            }
                            else if (newRouteHistory.length > 0 && to.fullPath === newRouteHistory[newRouteHistory.length - 1].fullPath) {
                                if (to.meta.childModuleName) {
                                    newRouteHistory[newRouteHistory.length - 1].meta.childModuleName = to.meta.childModuleName;
                                    commit('updateRouteHistory', newRouteHistory);
                                }
                            }
                            else {
                                newRouteHistory.push(to);
                                commit('updateRouteHistory', newRouteHistory);
                            }
                        }
                        else {
                            newRouteHistory = [];
                            newRouteHistory.push(to);
                            commit('updateRouteHistory', newRouteHistory);
                        }
                    },
                    clearRouteHistory({ state, commit }) {
                        let newRouteHistory;
                        newRouteHistory = [];
                        commit('updateRouteHistory', newRouteHistory);
                    }
                },
                getters: {
                    getCurrentRoute: state => {
                        console.log(moduleName + ' - starting getCurrentRoute');
                        try {
                            if (state.routeHistory.length > 0) {
                                return getMatchingRouteRecord(state.routeHistory)[0].components;
                            }
                            else {
                                return undefined;
                            }
                        }
                        catch (err) {
                            console.log(err);
                        }
                    },
                    getRouteHistory: state => {
                        return state.routeHistory;
                    }
                }
            });
            let isTimeTraveling = false;
            let currentPath = ``;
            const unWatch = store.watch(state => state.routeHistory, routeHistory => {
                const route = routeHistory[routeHistory.length - 1];
                const { fullPath } = route;
                if (fullPath === currentPath) {
                    return;
                }
                if (currentPath != null) {
                    isTimeTraveling = true;
                    router.push(route);
                }
                currentPath = fullPath;
            });
            const removeRouteHook = router.afterEach((to, from) => {
                try {
                    const routeHistory = store.getters[to.params.moduleName + '/getRouteHistory'];
                    if (isTimeTraveling || (routeHistory && routeHistory.length > 0 && to.fullPath === routeHistory[routeHistory.length - 1].fullPath)) {
                        console.log('we are timeTraveling so do nothing');
                        isTimeTraveling = false;
                        return;
                    }
                    currentPath = to.fullPath;
                    store.dispatch(to.params.moduleName + '/updateRouteHistory', { to, from });
                }
                catch (err) {
                    console.log('err - ', err);
                }
            });
            return () => {
                console.log(moduleName + ' - calling remove function for moduleName : ', moduleName);
                if (removeRouteHook != null) {
                    removeRouteHook();
                }
                if (unWatch != null) {
                    unWatch();
                }
                store.unregisterModule(moduleName);
            };
        }
        else {
            return () => {
            };
        }
    }
    catch (err) {
        throw err;
    }
};
const getMatchingRouteRecord = (routeHistory) => {
    const matched = routeHistory[routeHistory.length - 1].matched;
    const path = routeHistory[routeHistory.length - 1].path;
    return matched.filter((record) => Object.keys(record).some((key) => record[key] && record[key] === path));
};function install(Vue, options) {
    if (install.installed) {
        console.log('not installed');
        return;
    }
    else {
        for (const moduleName of options.moduleName) {
            console.log('not installed yet - moduleName - ', moduleName);
            install.installed = true;
            Vue.component("Dynamo" + moduleName, {
                template: options.appMode === undefined
                    ? `<component v-bind:is="computedCurrentRoute" />`
                    : options.appMode === "web"
                        ? `<div><component v-bind:is="computedCurrentRoute" /></div>`
                        : `<StackLayout><component v-bind:is="computedCurrentRoute" /></StackLayout>`,
                data() {
                    return {};
                },
                computed: {
                    computedCurrentRoute() {
                        if (this.$store.getters[moduleName + "/getRouteHistory"].length > 0) {
                            return this.$store.getters[moduleName + "/getCurrentRoute"].default;
                        }
                    }
                },
            });
            Vue.prototype['$' + moduleName] = componentRouter(options.store, options.router, options.routes, moduleName);
        }
    }
}
class Dynamo {
}
(function (install) {
})(install || (install = {}));
Dynamo.install = install;
let GlobalVue;
if (typeof window !== "undefined" && typeof window.Vue !== 'undefined') {
    GlobalVue = window.Vue;
}
else if (typeof global !== "undefined" && typeof global['Vue'] !== 'undefined') {
    GlobalVue = global['Vue'];
}
if (GlobalVue) {
    GlobalVue.use(Dynamo);
}exports.default=Dynamo;exports.install=install;Object.defineProperty(exports,'__esModule',{value:true});}));