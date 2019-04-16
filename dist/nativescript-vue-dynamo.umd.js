(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=g||self,f(g.NativescriptVueDynamo={}));}(this,function(exports){'use strict';const componentRouter = async (store, router, routes, appMode) => {
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
                    async updateRouteHistory({ state, commit }, payload) {
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
                        if (state) {
                            newRouteHistory = state.routeHistory;
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
                console.log('dynamo - starting store.watch');
                const route = recentRouteChange.routeHistory[0];
                const { fullPath } = route;
                if (fullPath === currentPath) {
                    return;
                }
                if (currentPath !== null) {
                    isTimeTraveling = true;
                    router.push({ name: route.name, params: { routeHistoryName: recentRouteChange.routeHistoryName } });
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
        componentRouter(options.store, options.router, options.routes, options.appMode).then(() => {
            console.log('back from componentRouter');
            install.installed = true;
            Vue.component('Dynamo', {
                template: options.appMode === undefined
                    ? `<component v-bind:is="computedCurrentRoute" v-on:event="updatePage" />`
                    : options.appMode === "web"
                        ? `<div><component v-bind:is="computedCurrentRoute" v-on:event="updatePage"/></div>`
                        : `<Frame :id="routeHistoryName"><StackLayout><component v-bind:is="computedCurrentRoute" v-on:event="updatePage" /></StackLayout></Frame>`,
                data() {
                    return {
                        topPage: 'Page(-1)',
                    };
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
                    },
                    defaultRoute: {
                        type: String,
                        required: false
                    },
                },
                methods: {
                    updatePage(value) {
                        this.$data.topPage = value;
                    }
                },
                watch: {
                    topPage(newVal, oldVal) {
                        if (this.computedRouteHistory && this.computedRouteHistory.routeHistory.length > 0) {
                            const route = this.computedRouteHistory.routeHistory[this.computedRouteHistory.routeHistory.length - 1];
                            if (route.meta) {
                                route.meta.currentPage = newVal;
                                this.$store.dispatch('ComponentRouter/updateRouteHistory', { routeHistoryName: this.$props.routeHistoryName, to: route });
                            }
                        }
                    }
                },
                computed: {
                    computedCurrentRoute() {
                        let currentRoute;
                        if (this.computedRouteHistory && this.computedRouteHistory.routeHistory.length > 0) {
                            currentRoute = this.$store.getters['ComponentRouter/getCurrentRoute'](this.$props.routeHistoryName).default;
                            return currentRoute;
                        }
                        else {
                            return currentRoute;
                        }
                    },
                    computedRouteHistory() {
                        const routeHistory = this.$store.getters['ComponentRouter/getRouteHistoryByName'](this.$props.routeHistoryName);
                        return routeHistory;
                    },
                },
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