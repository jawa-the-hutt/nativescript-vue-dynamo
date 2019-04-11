import Router, { Route, RouteConfig } from 'vue-router';
import Vuex, { Store } from 'vuex';

const componentRouter = (store: Store<any>, router: Router, routes: RouteConfig[], moduleName: string) => {
  console.log('starting componentRouter function');
  // const moduleName: string ='componentRouter';

  try {
    moduleName = moduleName !== undefined ? moduleName : 'componentRouter';
    console.log('moduleName - ', moduleName);
    console.log(moduleName + ' - !store.state[moduleName] - ', store.state[moduleName])
    
    if(!store.state[moduleName]) {
      // module does not exist in the store
      console.log(moduleName + ' - module does not exist in the store');
      store.registerModule(moduleName, {
        namespaced: true,
        state: {
          routeHistory: [] as Route[],
        },
        mutations: {
          updateRouteHistory (state, routeHistory: Route[]) {
            console.log(moduleName + ' - starting dynamo - mutations - updateRouteHistory')
            state.routeHistory = routeHistory;
          }
        },
        actions:{
          updateRouteHistory ({state, commit}, payload: { to: Route, from: Route}) {
            console.log(moduleName + ' - starting dynamo - actions - updateRouteHistory')

            let newRouteHistory!: Route[];
            if (!payload.to.params.clearHistory) {

              if(state) {
                newRouteHistory = [...state.routeHistory];
              }

              // we ARE NOT clearing the route history
              if(newRouteHistory.length > 1 && payload.to.fullPath === newRouteHistory[newRouteHistory.length - 2].fullPath) {  
                // we're going back from where we came from
                newRouteHistory.pop();
              } else if (newRouteHistory.length > 0 && payload.to.fullPath === newRouteHistory[newRouteHistory.length - 1].fullPath) { 
                // we didn't actually go anywhere so don't do anything         
              } else {  
                // we're going forward somewhere
                newRouteHistory.push(payload.to);
              }
            } else {
              // we ARE clearing the route history
              newRouteHistory = [];
              newRouteHistory.push(payload.to);
            }

            // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
            commit('updateRouteHistory', newRouteHistory);
          }
        },
        getters: {
          getCurrentRoute: state => {
            console.log(moduleName + ' - starting getCurrentRoute');

            if (state.routeHistory.length > 0 ) {
              const path = state.routeHistory[state.routeHistory.length - 1].path;
              const filter = routes.filter( (route: RouteConfig) => Object.keys(route).some((key: string) => route[key] && route[key] === path ));
              // console.log(moduleName + ' - getCurrentRoute - filter[0].component - ', filter[0].component)
              return filter[0].component; 
            } else {
              return undefined;
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
          console.log('dyname - starting store.watch')
          const route  = routeHistory[routeHistory.length - 1];
          const { fullPath } = route
          if (fullPath === currentPath) {
            console.log('fullPath === currentPath');
            return
          }
          if (currentPath != null) {
            console.log('currentPath != null');
            isTimeTraveling = true
            router.push(route)
          }
          currentPath = fullPath
        },
        // { sync: true }
      )

      // sync store on router navigation
      const removeRouteHook = router.afterEach((to: Route, from: Route) => {
        console.log('starting afterEachUnHook');
        try {
          if (isTimeTraveling) {
            console.log('we are timeTraveling so do nothing');
            isTimeTraveling = false
            return
          }

          currentPath = to.fullPath

          //console.log('dynamo - afterEach - store - ', store);
          store.dispatch(moduleName + '/updateRouteHistory', { to, from });
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

export default componentRouter;