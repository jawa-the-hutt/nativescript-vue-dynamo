const componentRouter = async (store, router, routes, appMode) => {
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
                        console.log('starting dynamo - mutations - updateRouteHistory');
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
                        if (state) {
                            newRouteHistory = state.routeHistory;
                        }
                        const index = newRouteHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);
                        if (!payload.to.params.clearHistory) {
                            console.log('updateRouteHistory - we ARE NOT clearing the route history');
                            if (index > -1) {
                                const routeHistory = newRouteHistory[index].routeHistory;
                                if (routeHistory.length > 1 && to.fullPath === routeHistory[routeHistory.length - 2].fullPath) {
                                    console.log('updateRouteHistory - we are going back from where we came from');
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
                                    console.log('updateRouteHistory - we did not actually go anywhere');
                                    recentRouteChange = { routeHistoryName, routeHistory: [to] };
                                    commit('updateRouteHistory', newRouteHistory);
                                }
                                else {
                                    console.log('updateRouteHistory - we are going forward somewhere');
                                    routeHistory.push(to);
                                    recentRouteChange = { routeHistoryName, routeHistory: [to] };
                                    commit('updateRouteHistory', newRouteHistory);
                                }
                            }
                            else {
                                console.log('updateRouteHistory - this is a brand new route level');
                                recentRouteChange = { routeHistoryName, routeHistory: [to] };
                                newRouteHistory.push(recentRouteChange);
                                commit('updateRouteHistory', newRouteHistory);
                            }
                        }
                        else {
                            console.log('updateRouteHistory - we ARE clearing the route history');
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
                        console.log(routeHistoryName + ' - starting getCurrentRoute');
                        try {
                            const index = state.routeHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);
                            console.log('getCurrentRoute - index ', index);
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
                                return undefined;
                            }
                        }
                        else {
                            return undefined;
                        }
                    },
                    getRouteHistoryByPage: (state) => (page) => {
                        console.log('starting getRouteHistoryByPage - ', page);
                        if (page) {
                            let routeHistory = state.routeHistory
                                .filter((baseRouteHistory) => baseRouteHistory.routeHistory.some((route) => route.meta.currentPage === page))
                                .map(baseRouteHistory => {
                                return Object.assign({}, baseRouteHistory, { subElements: baseRouteHistory.routeHistory.filter(route => route.meta.currentPage === page) });
                            });
                            console.log('getRouteHistoryByPage - routeHistory - ', routeHistory);
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
                }
            });
            let isTimeTraveling = false;
            let currentPath = ``;
            store.watch(state => state.ComponentRouter.routeHistory, (newValue, oldValue) => {
                console.log('dynamo - starting store.watch - recentRouteChange - ', recentRouteChange);
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
                console.log('starting afterEachUnHook');
                try {
                    const routeHistoryName = to.params.routeHistoryName;
                    console.log('afterEachUnHook - routeHistoryName - ', routeHistoryName);
                    const routeHistory = store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);
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
};

async function install(Vue, options) {
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
                        topPage: '',
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
                        console.log('dynamo - updatePage - emitted value - ', value);
                        this.$data.topPage = value;
                    }
                },
                watch: {
                    topPage(newVal, oldVal) {
                        console.log('watch - topPage - oldVal', oldVal);
                        console.log('watch - topPage - newVal', newVal);
                        if (this.computedRouteHistory && this.computedRouteHistory.length > 0) {
                            const route = this.computedRouteHistory[this.computedRouteHistory.length - 1];
                            if (route.meta) {
                                route.meta.currentPage = newVal;
                                this.$store.dispatch('ComponentRouter/updateRouteHistory', { routeHistoryName: this.$props.routeHistoryName, to: route });
                            }
                        }
                    }
                },
                computed: {
                    computedCurrentRoute() {
                        console.log('computedCurrentRoute - this.$props.routeHistoryName - ', this.$props.routeHistoryName);
                        if (this.computedRouteHistory && this.computedRouteHistory.length > 0) {
                            return this.$store.getters['ComponentRouter/getCurrentRoute'](this.$props.routeHistoryName).default;
                        }
                    },
                    computedRouteHistory() {
                        console.log('computedRouteHistory - this.$props.routeHistoryName - ', this.$props.routeHistoryName);
                        const routeHisotry = this.$store.getters['ComponentRouter/getRouteHistoryByName'](this.$props.routeHistoryName);
                        return routeHisotry;
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
}

export default Dynamo;
export { install };
