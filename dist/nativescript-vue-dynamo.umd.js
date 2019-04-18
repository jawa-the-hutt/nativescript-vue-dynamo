(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('clone')):typeof define==='function'&&define.amd?define(['exports','clone'],f):(g=g||self,f(g.NativescriptVueDynamo={},g.clone));}(this,function(exports, clone){'use strict';clone=clone&&clone.hasOwnProperty('default')?clone['default']:clone;const componentRouter = async (store, router, routes, appMode, Vue) => {
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
                        if (payload.to.meta && payload.to.params && payload.to.params.routeHistoryName) {
                            to.meta.routeHistoryName = payload.to.params.routeHistoryName;
                        }
                        if (payload.to.meta && payload.to.params && payload.to.params.parentRouteHistoryName) {
                            to.meta.parentRouteHistoryName = payload.to.params.parentRouteHistoryName;
                        }
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
                                if (routeHistory.length > 1 && to.fullPath === routeHistory[routeHistory.length - 2].fullPath) {
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
                                return getMatchingRouteRecord(state.routeHistory[index].routeHistory)[0].components;
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
                    const routeHistoryName = to.params.routeHistoryName;
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
};
const getMatchingRouteRecord = (routeHistory) => {
    const matched = routeHistory[routeHistory.length - 1].matched;
    const path = routeHistory[routeHistory.length - 1].path;
    return matched.filter((record) => Object.keys(record).some((key) => record[key] && record[key] === path));
};async function install(Vue, options) {
    if (install.installed) {
        console.log('not installed');
        return;
    }
    else {
        const appMode = options.appMode === undefined || 'native' ? 'native' : 'web';
        componentRouter(options.store, options.router, options.routes, appMode, Vue).then(() => {
            install.installed = true;
            Vue.component('Dynamo', {
                name: 'Dynamo',
                template: appMode === 'native'
                    ? `<Frame :id="routeHistoryName"><StackLayout><component v-bind:is="computedCurrentRoute" v-on:dynamo-event="eventHandler" :functionHandler="functionHandler" /></StackLayout></Frame>`
                    : `<div :id="routeHistoryName"><component v-bind:is="computedCurrentRoute" v-on:dynamo-event="eventHandler" :functionHandler="functionHandler" /></div>`,
                data() {
                    return {};
                },
                created() {
                    console.log('dynamo - created - routeHistoryName - ', this.$props.routeHistoryName);
                    console.log('dynamo - created - routeHistoryName - ', this.$props.defaultRoute);
                    console.log('dynamo - created - routeHistoryName - ', this.$props.parentRouteHistoryName);
                    Vue.prototype.$goTo(this.$props.defaultRoute, this.$props.routeHistoryName, this.$props.parentRouteHistoryName);
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
                        required: true
                    },
                    functionHandler: {
                        required: false
                    }
                },
                methods: {
                    eventHandler(e) {
                        this.$emit(this.$props.routeHistoryName + '-event-handler', e);
                    },
                },
                computed: {
                    computedCurrentRoute() {
                        let currentRoute;
                        if (this.computedRouteHistory && this.computedRouteHistory.routeHistory.length > 0) {
                            currentRoute = options.store.getters['ComponentRouter/getCurrentRoute'](this.$props.routeHistoryName).default;
                            return currentRoute;
                        }
                        else {
                            return currentRoute;
                        }
                    },
                    computedRouteHistory() {
                        const routeHistory = options.store.getters['ComponentRouter/getRouteHistoryByName'](this.$props.routeHistoryName);
                        return routeHistory;
                    },
                },
            });
        });
        Vue.prototype.$goBack = async (routeHistoryName, canGoBack) => {
            console.log(`$goBack`);
            canGoBack = canGoBack === true || undefined ? true : false;
            let routeHistory = await options.store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);
            const currentRoute = routeHistory.routeHistory[routeHistory.routeHistory.length - 1];
            if (canGoBack && routeHistory.routeHistory.length > 1) {
                Vue.prototype.$goTo(routeHistory.routeHistory[routeHistory.routeHistory.length - 2].name, routeHistoryName);
            }
            else {
                if (routeHistory.routeHistory.length === 1 && currentRoute.meta.parentRouteHistoryName && currentRoute.meta.parentRouteHistoryName !== routeHistoryName) {
                    Vue.prototype.$goBackToParent(routeHistoryName, currentRoute.meta.parentRouteHistoryName);
                }
            }
        };
        Vue.prototype.$goBackToParent = async (routeHistoryName, parentRouteHistoryName) => {
            console.log('$goBackToParent');
            options.store.dispatch('ComponentRouter/clearRouteHistory', { routeHistoryName });
            const parentRouteHistory = await options.store.getters['ComponentRouter/getRouteHistoryByName'](parentRouteHistoryName);
            const newCurrentRoute = parentRouteHistory.routeHistory[parentRouteHistory.routeHistory.length - 2];
            Vue.prototype.$goTo(newCurrentRoute.name, parentRouteHistoryName, newCurrentRoute.meta.parentRouteHistoryName);
        };
        Vue.prototype.$goTo = async (location, routeHistoryName, parentRouteHistoryName, clearHistory, onComplete, onAbort) => {
            console.log('$goTo');
            let tmpLocation = {};
            parentRouteHistoryName = !parentRouteHistoryName ? routeHistoryName : parentRouteHistoryName;
            clearHistory = !clearHistory ? 'false' : 'true';
            if (typeof location === 'string') {
                tmpLocation.name = location;
                tmpLocation.params = Object.assign({}, { routeHistoryName, parentRouteHistoryName, clearHistory });
            }
            else {
                tmpLocation = location;
            }
            if (onComplete && onAbort) {
                options.router.push(tmpLocation, onComplete, onAbort);
            }
            else if (onComplete && !onAbort) {
                options.router.push(tmpLocation, onComplete);
            }
            else if (!onComplete && onAbort) {
                options.router.push(tmpLocation, onAbort);
            }
            else {
                options.router.push(tmpLocation);
            }
        };
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