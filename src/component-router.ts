import Router, { Route, RouteConfig } from 'vue-router';
import { Store } from 'vuex';

const componentRouter = (store: Store<any>, router: Router, routes: RouteConfig[]) => {
  console.log('starting componentRouter');
  const moduleName: string ='componentRouter';

  store.registerModule(moduleName, {
    namespaced: true,
    state: {
      routeHistory: [] as Route[],
    },
    mutations: {
      updateRouteHistory (state, routeHistory: Route[]) {
        console.log('starting dynamo - mutations - updateRouteHistory')
        state.routeHistory = routeHistory;
      }
    },
    actions:{
      updateRouteHistory ({state, commit}, payload: { to: Route, from: Route}) {
        console.log('starting dynamo - actions - updateRouteHistory')

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
        console.log('starting getCurrentRoute');

        if (state.routeHistory.length > 0 ) {
          const path = state.routeHistory[state.routeHistory.length - 1].path;
          const filter = routes.filter( (route: RouteConfig) => Object.keys(route).some((key: string) => route[key] && route[key] === path ));

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
  store.watch(
    state => state.routeHistory,
    routeHistory => {
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
  router.afterEach((to: Route, from: Route) => {
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

}

export default componentRouter;