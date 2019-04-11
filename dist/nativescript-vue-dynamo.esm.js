const componentRouter = (store, router, routes, moduleName) => {
    console.log('starting componentRouter function');
    try {
        moduleName = moduleName !== undefined ? moduleName : 'componentRouter';
        console.log('moduleName - ', moduleName);
        console.log(moduleName + ' - !store.state[moduleName] - ', store.state[moduleName]);
        if (!store.state[moduleName]) {
            console.log(moduleName + ' - module does not exist in the store');
            store.registerModule(moduleName, {
                namespaced: true,
                state: {
                    routeHistory: [],
                },
                mutations: {
                    updateRouteHistory(state, routeHistory) {
                        console.log(moduleName + ' - starting dynamo - mutations - updateRouteHistory');
                        state.routeHistory = routeHistory;
                    }
                },
                actions: {
                    updateRouteHistory({ state, commit }, payload) {
                        console.log(moduleName + ' - starting dynamo - actions - updateRouteHistory');
                        let newRouteHistory;
                        if (!payload.to.params.clearHistory) {
                            if (state) {
                                newRouteHistory = [...state.routeHistory];
                            }
                            if (newRouteHistory.length > 1 && payload.to.fullPath === newRouteHistory[newRouteHistory.length - 2].fullPath) {
                                newRouteHistory.pop();
                            }
                            else if (newRouteHistory.length > 0 && payload.to.fullPath === newRouteHistory[newRouteHistory.length - 1].fullPath) ;
                            else {
                                newRouteHistory.push(payload.to);
                            }
                        }
                        else {
                            newRouteHistory = [];
                            newRouteHistory.push(payload.to);
                        }
                        commit('updateRouteHistory', newRouteHistory);
                    }
                },
                getters: {
                    getCurrentRoute: state => {
                        console.log(moduleName + ' - starting getCurrentRoute');
                        if (state.routeHistory.length > 0) {
                            const path = state.routeHistory[state.routeHistory.length - 1].path;
                            const filter = routes.filter((route) => Object.keys(route).some((key) => route[key] && route[key] === path));
                            return filter[0].component;
                        }
                        else {
                            return undefined;
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
                console.log('dyname - starting store.watch');
                const route = routeHistory[routeHistory.length - 1];
                const { fullPath } = route;
                if (fullPath === currentPath) {
                    console.log('fullPath === currentPath');
                    return;
                }
                if (currentPath != null) {
                    console.log('currentPath != null');
                    isTimeTraveling = true;
                    router.push(route);
                }
                currentPath = fullPath;
            });
            const removeRouteHook = router.afterEach((to, from) => {
                console.log('starting afterEachUnHook');
                try {
                    if (isTimeTraveling) {
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

function install(Vue, options) {
    for (const moduleName of options.moduleName) {
        console.log('not installed yet - moduleName - ', moduleName);
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
                    return this.$store.getters[moduleName + "/getCurrentRoute"];
                }
            },
        });
        Vue.prototype['$' + moduleName] = componentRouter(options.store, options.router, options.routes, moduleName);
    }
}
class Dynamo {
    static componentRouter(store, router, routes, moduleName) {
        console.log('moduleName - ', moduleName);
        return componentRouter(store, router, routes, moduleName);
    }
    ;
}
(function (install) {
})(install || (install = {}));
Dynamo.install = install;
Dynamo.componentRouter = componentRouter;
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
