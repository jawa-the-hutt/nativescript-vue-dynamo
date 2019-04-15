(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports,require('tns-core-modules/ui/frame')):typeof define==='function'&&define.amd?define(['exports','tns-core-modules/ui/frame'],f):(g=g||self,f(g.NativescriptVueDynamo={},g.frame));}(this,function(exports, frame){'use strict';const componentRouter = async (store, router, routes, appMode) => {
    console.log('starting componentRouter function');
    try {
        let currentPage = '';
        const moduleName = 'ComponentRouter';
        if (!store.state[moduleName]) {
            store.registerModule(moduleName, {
                namespaced: true,
                state: {
                    routeHistory: [],
                },
                mutations: {
                    updateRouteHistory(state, routeHistory) {
                        console.log('starting dynamo - mutations - updateRouteHistory', routeHistory);
                        state.routeHistory = routeHistory;
                    }
                },
                actions: {
                    async updateRouteHistory({ state, commit }, payload) {
                        console.log(payload.routeHistoryName + ' - starting dynamo - actions - updateRouteHistory');
                        let newRouteHistory;
                        const routeHistoryName = payload.routeHistoryName;
                        const to = payload.to;
                        const from = payload.from;
                        if (payload.to.meta && payload.to.params && payload.to.params.routeHistoryName) {
                            to.meta.routeHistoryName = payload.to.params.routeHistoryName;
                        }
                        if (payload.to.meta && payload.to.params && payload.to.params.parentRouteHistoryName) {
                            to.meta.parentRouteHistoryName = payload.to.params.parentRouteHistoryName;
                        }
                        if (payload.to.meta && payload.to.params && payload.to.params.childRouteHistoryName) {
                            to.meta.childRouteHistoryName = payload.to.params.childRouteHistoryName;
                        }
                        if (payload.to.meta) {
                            console.log('updateRouteHistory - currentPage -', currentPage);
                            to.meta.currentPage = currentPage;
                        }
                        if (state) {
                            newRouteHistory = [...state.routeHistory];
                        }
                        const index = newRouteHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);
                        if (!payload.to.params.clearHistory) {
                            if (index > -1) {
                                const routeHistory = newRouteHistory[index].routeHistory;
                                if (routeHistory.length > 1 && to.fullPath === routeHistory[routeHistory.length - 2].fullPath) {
                                    routeHistory.pop();
                                    if (routeHistory.length === 0) {
                                        newRouteHistory.splice(index, 1);
                                    }
                                    commit('updateRouteHistory', newRouteHistory);
                                }
                                else if (routeHistory.length > 0 && to.fullPath === routeHistory[routeHistory.length - 1].fullPath) {
                                    if (to.meta.childRouteHistoryName) {
                                        routeHistory[routeHistory.length - 1].meta.childRouteHistoryName = to.meta.childRouteHistoryName;
                                        commit('updateRouteHistory', newRouteHistory);
                                    }
                                }
                                else {
                                    routeHistory.push(to);
                                    commit('updateRouteHistory', newRouteHistory);
                                }
                            }
                            else {
                                newRouteHistory.push({ routeHistoryName, routeHistory: [to] });
                                commit('updateRouteHistory', newRouteHistory);
                            }
                        }
                        else {
                            newRouteHistory.splice(index, 1);
                            newRouteHistory.push({ routeHistoryName, routeHistory: [to] });
                            commit('updateRouteHistory', newRouteHistory);
                        }
                    },
                    clearRouteHistory({ state, commit }, payload) {
                        let newRouteHistory;
                        if (payload) {
                            const routeHistoryName = payload.routeHistoryName;
                            if (state) {
                                newRouteHistory = [...state.routeHistory];
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
                        console.log(routeHistoryName + ' - starting getCurrentRoute');
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
                        console.log('starting getRouteHistoryByName - ', routeHistoryName);
                        if (routeHistoryName) {
                            const index = state.routeHistory.findIndex((baseRouteHistory) => baseRouteHistory.routeHistoryName === routeHistoryName);
                            console.log('getRouteHistoryByName - index -', index);
                            if (index > -1 && state.routeHistory[index].routeHistory && state.routeHistory[index].routeHistory.length > 0) {
                                return state.routeHistory[index].routeHistory;
                            }
                            else {
                                return state.routeHistory;
                            }
                        }
                        else {
                            return state.routeHistory;
                        }
                    },
                }
            });
            let isTimeTraveling = false;
            let currentPath = ``;
            for (const attribute in store.state.routeHistory) {
                store.watch(state => state.routeHistory[attribute], (newValue, oldValue) => {
                    console.log('dynamo - starting store.watch');
                    console.log('newValue - ', newValue);
                    console.log('oldValue - ', oldValue);
                });
            }
            router.afterEach(async (to, from) => {
                console.log('starting afterEachUnHook');
                try {
                    const routeHistoryName = to.params.routeHistoryName;
                    console.log('afterEachUnHook - routeHistoryName - ', routeHistoryName);
                    const routeHistory = store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);
                    console.log('routeHistory - ', routeHistory);
                    if (isTimeTraveling || (routeHistory && routeHistory.length > 0 && to.fullPath === routeHistory[routeHistory.length - 1].fullPath)) {
                        console.log('we are timeTraveling so do nothing');
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
        componentRouter(options.store, options.router, options.routes, options.appMode).then(() => {
            console.log('back from componentRouter');
            install.installed = true;
            Vue.component('Dynamo', {
                template: options.appMode === undefined
                    ? `<component v-bind:is="computedCurrentRoute" />`
                    : options.appMode === "web"
                        ? `<div><component v-bind:is="computedCurrentRoute" /></div>`
                        : `<StackLayout><component v-bind:is="computedCurrentRoute" /></StackLayout>`,
                data() {
                    return {};
                },
                created() {
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
                        console.log('computedCurrentRoute - this.$props.routeHistoryName - ', this.$props.routeHistoryName);
                    }
                },
            });
            Vue.mixin({
                mounted() {
                    console.log('router.afterEach - currentPage - ', frame.topmost().canGoBack());
                }
            });
        });
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