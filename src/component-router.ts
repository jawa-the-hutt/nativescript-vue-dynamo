import Router, { Route, RouteConfig, RouteRecord } from 'vue-router';
import { Store } from 'vuex';

const componentRouter = (store: Store<any>, router: Router, routes: RouteConfig[], moduleName: string) => {
  // console.log('starting componentRouter function');

  try {
    moduleName = moduleName !== undefined ? moduleName : 'ComponentRouter';
    // console.log('moduleName - ', moduleName);
    // console.log(moduleName + ' - !store.state[moduleName] - ', store.state[moduleName])
    
    if(!store.state[moduleName]) {
      // module does not exist in the store
      // console.log(moduleName + ' - module does not exist in the store');
      store.registerModule(moduleName, {
        namespaced: true,
        state: {
          routeHistory: [] as Route[],
        },
        mutations: {
          updateRouteHistory (state, routeHistory: Route[]) {
            // console.log(moduleName + ' - starting dynamo - mutations - updateRouteHistory')
            state.routeHistory = routeHistory;
          }
        },
        actions:{
          updateRouteHistory ({state, commit}, payload: { to: Route, from: Route}) {
            // console.log(moduleName + ' - starting dynamo - actions - updateRouteHistory')

            let newRouteHistory!: Route[];
            const to = payload.to;

            // add current moduleName to meta tag in the route history
            if(payload.to.meta && payload.to.params && payload.to.params.moduleName) {
              to.meta.moduleName = payload.to.params.moduleName;
            }

            // add the parent moduleName (if it exists) to meta tag in the route history
            if(payload.to.meta && payload.to.params && payload.to.params.parentModuleName) {
              to.meta.parentModuleName = payload.to.params.parentModuleName;
            }

            // add the child moduleName (if it exists) to meta tag in the route history
            if(payload.to.meta && payload.to.params && payload.to.params.childModuleName) {
              to.meta.childModuleName = payload.to.params.childModuleName;
            }
            
            if (!payload.to.params.clearHistory) {
              // we ARE NOT clearing the route history
              if(state) {
                newRouteHistory = [...state.routeHistory];
              }

              if(newRouteHistory.length > 1 && to.fullPath === newRouteHistory[newRouteHistory.length - 2].fullPath) {  
                // we're going back from where we came from
                newRouteHistory.pop();
                              
                // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
                commit('updateRouteHistory', newRouteHistory);

              } else if (newRouteHistory.length > 0 && to.fullPath === newRouteHistory[newRouteHistory.length - 1].fullPath) { 
                // we didn't actually go anywhere

                // add the child moduleName (if it exists) to the most current route history
                if(to.meta.childModuleName) {
                  newRouteHistory[newRouteHistory.length - 1].meta.childModuleName = to.meta.childModuleName;
                  
                  // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
                  commit('updateRouteHistory', newRouteHistory);
                }
              } else {  
                // we're going forward somewhere
                newRouteHistory.push(to);
              
                // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
                commit('updateRouteHistory', newRouteHistory);
              }
            } else {
              // we ARE clearing the route history
              newRouteHistory = [];
              newRouteHistory.push(to);

              // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
              commit('updateRouteHistory', newRouteHistory);
            }

            
          },
          clearRouteHistory ({state, commit}) {
            // console.log(moduleName + ' - starting dynamo - actions - clearRouteHistory')

            let newRouteHistory!: Route[];

            // we ARE clearing the route history
            newRouteHistory = [];

            // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
            commit('updateRouteHistory', newRouteHistory);
          }
        },
        getters: {
          getCurrentRoute: state => {
            console.log(moduleName + ' - starting getCurrentRoute');
            try {
              if (state.routeHistory.length > 0 ) {
                return getMatchingRouteRecord(state.routeHistory)[0].components; 
              } else {
                return undefined;
              }
            } catch (err) {
              console.log(err)
            }
          },
          getRouteHistory: state => {
            return state.routeHistory;
          }
        }
      })

      let isTimeTraveling: boolean = false
      let currentPath: string = ``;

      // sync router on store change
      const unWatch = store.watch(
        state => state.routeHistory,
        routeHistory => {
          // console.log('dyname - starting store.watch')
          const route  = routeHistory[routeHistory.length - 1];
          const { fullPath } = route
          if (fullPath === currentPath) {
            // console.log('fullPath === currentPath');
            return
          }
          if (currentPath != null) {
            // console.log('currentPath != null');
            isTimeTraveling = true
            router.push(route)
          }
          currentPath = fullPath
        },
      )

      // sync store on router navigation
      const removeRouteHook = router.afterEach((to: Route, from: Route) => {
        // console.log('starting afterEachUnHook');
        try {
          const routeHistory = store.getters[to.params.moduleName + '/getRouteHistory'];
          // console.log('routeHistory - ', routeHistory)
          if (isTimeTraveling || (routeHistory && routeHistory.length > 0 && to.fullPath === routeHistory[routeHistory.length - 1].fullPath)) {
            console.log('we are timeTraveling so do nothing');
            isTimeTraveling = false
            return
          }

          currentPath = to.fullPath

          //console.log('dynamo - afterEach - store - ', store);
          store.dispatch(to.params.moduleName + '/updateRouteHistory', { to, from });
        } catch (err) {
          console.log('err - ', err);
        }
      })

      return () => {
        console.log(moduleName + ' - calling remove function for moduleName : ', moduleName);
        // On unsync, remove router hook
        if (removeRouteHook != null) {
          removeRouteHook();
        }

        // On unsync, remove store watch
        if (unWatch != null) {
          unWatch();
        }

        // On unsync, unregister Module with store
        store.unregisterModule(moduleName);
      }
    } else {
      return () => {
        Error(`The module named: ${moduleName} already exists in the store!`);
      }
    }
  } catch(err) {
    throw err;
  }
}

const getMatchingRouteRecord = (routeHistory: Route[]) => {
  const matched: RouteRecord[] = routeHistory[routeHistory.length - 1].matched;
  const path = routeHistory[routeHistory.length - 1].path;
  return matched.filter( (record: RouteRecord) => Object.keys(record).some((key: string) => record[key] && record[key] === path ));
}

const getMatchingRouteConfig = (routes: RouteConfig[], path: string ) => {
  return routes.filter( (route: RouteConfig) => Object.keys(route).some((key: string) => route[key] && route[key] === path ));
}

export default componentRouter;