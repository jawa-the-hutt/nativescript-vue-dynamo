import Router, { Route, RouteConfig, RouteRecord } from 'vue-router';
import { Store } from 'vuex';

const componentRouter = (store: Store<any>, router: Router, routes: RouteConfig[], moduleName: string) => {
  // console.log('starting componentRouter function');

  try {
    moduleName = moduleName !== undefined ? moduleName : 'componentRouter';
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
            console.log('to - ', to);
            if(payload.to.meta && payload.to.params && payload.to.params.moduleName) {
              to.meta.moduleName = payload.to.params.moduleName;
            }


            if (!payload.to.params.clearHistory) {

              if(state) {
                newRouteHistory = [...state.routeHistory];
              }

              // const record = getMatchingRouteRecord([to]); 
              // console.log('record - ', record);

              // if (record[0].parent) {

              // }
              // const matchingRoute = getMatchingRouteConfig(routes, record[0].path);
              // console.log('record - ', record);


              // we ARE NOT clearing the route history
              if(newRouteHistory.length > 1 && to.fullPath === newRouteHistory[newRouteHistory.length - 2].fullPath) {  
                // we're going back from where we came from
                newRouteHistory.pop();
              } else if (newRouteHistory.length > 0 && to.fullPath === newRouteHistory[newRouteHistory.length - 1].fullPath) { 
                // we didn't actually go anywhere so don't do anything
                console.log('why are we navigating to the same place: ', to.fullPath)
              } else {  
                // we're going forward somewhere
                newRouteHistory.push(to);
              }
            } else {
              // we ARE clearing the route history
              newRouteHistory = [];
              newRouteHistory.push(to);
            }

            // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
            commit('updateRouteHistory', newRouteHistory);
          }
        },
        getters: {
          getCurrentRoute: state => {
            // console.log(moduleName + ' - starting getCurrentRoute');
            try {
              if (state.routeHistory.length > 0 ) {
                // const matched: RouteRecord[] = state.routeHistory[state.routeHistory.length - 1].matched;
                // const path = state.routeHistory[state.routeHistory.length - 1].path;
                // const record = matched.filter( (record: RouteRecord) => Object.keys(record).some((key: string) => record[key] && record[key] === path ));
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
          if (isTimeTraveling || (routeHistory.length > 0 && to.fullPath === routeHistory[routeHistory.length - 1].fullPath)) {
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