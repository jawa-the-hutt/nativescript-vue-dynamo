const componentRouter = (store, router, routes) => {
    console.log('starting componentRouter');
    const moduleName = 'componentRouter';
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
            updateRouteHistory({ state, commit }, payload) {
                console.log('starting dynamo - actions - updateRouteHistory');
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
                console.log('starting getCurrentRoute');
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
    store.watch(state => state.routeHistory, routeHistory => {
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
    router.afterEach((to, from) => {
        console.log('starting afterEachUnHook');
        try {
            if (isTimeTraveling) {
                console.log('we are timeTraveling so do nothing');
                isTimeTraveling = false;
                return;
            }
            currentPath = to.fullPath;
            store.dispatch(moduleName + '/updateRouteHistory', { to, from });
        }
        catch (err) {
            console.log('err - ', err);
        }
    });
};

function install(Vue, options) {
    if (install.installed) {
        return;
    }
    else {
        install.installed = true;
        Vue.component("Dynamo", {
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
                    return this.$store.getters["componentRouter/getCurrentRoute"];
                }
            }
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
export { componentRouter, install };
