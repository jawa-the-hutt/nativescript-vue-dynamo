import { VueConstructor } from 'vue';
import Router, { Route, RouteConfig, RouteRecord } from 'vue-router';
import { Store } from 'vuex';
import clone from 'clone';

const componentRouter = async (store: Store<any>, router: Router, routes: RouteConfig[], appMode: string, Vue: VueConstructor) => {
  console.log('starting componentRouter function');

  try {
    let recentRouteChange!: IRouteHistory;
    const moduleName = 'ComponentRouter';

    if(!store.state[moduleName]) {
      // module does not exist in the store
      store.registerModule(moduleName, {
        namespaced: true,
        state: {
          routeHistory: [] as IRouteHistory[],
        },
        mutations: {
          updateRouteHistory (state, routeHistory: IRouteHistory[]) {
            state.routeHistory = routeHistory;
          }
        },
        actions:{
          updateRouteHistory ({state, commit}, payload: { routeHistoryName: string, to: Route, from?: Route}) {
            let newRouteHistory!: IRouteHistory[];
            const routeHistoryName = payload.routeHistoryName;
            const to = payload.to;
            const from = payload.from;
            let clearHistory: boolean = false;

            // add current routeHistoryName to meta tag in the route history
            if(payload.to.params && payload.to.params.clearHistory === 'true') {
              clearHistory = true;
            }

            if(state) {
              // using the clone library to get a deep clone since routeHistory includes
              // functions, getters, setters, circular references, etc
              newRouteHistory = clone(state.routeHistory);
            }
            
            // get the specific route history matching the name passed in
            const index = newRouteHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);

            if (!clearHistory) {
              // we ARE NOT clearing the route history

              if(index > -1) {
                const routeHistory = newRouteHistory[index].routeHistory;

                if(routeHistory.length > 1 && to.fullPath === routeHistory[routeHistory.length - 2].fullPath) {  
                  // we're going back from where we came from
                  routeHistory.pop();
                  if(routeHistory.length === 0) {
                    // we have removed the last routeHistory for this node, so delete it out of the parent array
                    newRouteHistory.splice(index, 1);
                  } else {
                    recentRouteChange = { routeHistoryName, routeHistory: [to] }
                  }

                  commit('updateRouteHistory', newRouteHistory);
                } else if (routeHistory.length > 0 && to.fullPath === routeHistory[routeHistory.length - 1].fullPath) { 
                  // we didn't actually go anywhere
                  recentRouteChange = { routeHistoryName, routeHistory: [to] }

                  commit('updateRouteHistory', newRouteHistory);
                } else {  
                  // we're going forward somewhere
                  routeHistory.push(to);
                  recentRouteChange = { routeHistoryName, routeHistory: [to] }

                  commit('updateRouteHistory', newRouteHistory);
                }
              } else {
                // this is a brand new route level. most likely a child route unless it's the first ever created in the app
                // we're going forward somewhere
                recentRouteChange = { routeHistoryName, routeHistory: [to] }
                newRouteHistory.push(recentRouteChange);
                commit('updateRouteHistory', newRouteHistory);
              }
            } else {
              // we ARE clearing the route history
              newRouteHistory.splice(index, 1);
              recentRouteChange = { routeHistoryName, routeHistory: [to] }
              newRouteHistory.push(recentRouteChange);
              commit('updateRouteHistory', newRouteHistory);
            }
          },
          clearRouteHistory ({state, commit}, payload?: {routeHistoryName: string}) {

            let newRouteHistory!: IRouteHistory[];

            if (payload) {
              const routeHistoryName = payload.routeHistoryName;

              if(state) {
                // using the clone library to get a deep clone since routeHistory includes
                // functions, getters, setters, circular references, etc
                newRouteHistory = clone(state.routeHistory);
              }

              // get the specific route history matching the name passed in
              const index = newRouteHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);
              newRouteHistory.splice(index, 1);
              commit('updateRouteHistory', newRouteHistory);

            } else {
              // we ARE clearing the entire route history for EVERYTHING
              newRouteHistory = [];
              commit('updateRouteHistory', newRouteHistory);
            }
          }
        },
        getters: {
          getCurrentRoute: (state) => (routeHistoryName: string) => {
            try {
              // get the specific route history matching the name passed in
              const index = state.routeHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);

              if (index > -1 && state.routeHistory[index].routeHistory.length > 0 ) {
                return getMatchingRouteRecord(state.routeHistory[index].routeHistory)[0].components; 
              } else {
                return undefined;
              }
            } catch (err) {
              console.log(err)
            }
          },
          getRouteHistoryByName: (state) => (routeHistoryName: string) => {
            try {
              if(routeHistoryName) {
                // get the specific route history matching the name passed in
                const index = state.routeHistory
                  .findIndex((baseRouteHistory: IRouteHistory) => baseRouteHistory.routeHistoryName === routeHistoryName);

                if (index > -1 && state.routeHistory[index].routeHistory && state.routeHistory[index].routeHistory.length > 0 ) {
                  return state.routeHistory[index];
                } else {
                  return undefined;
                }
              } else {
                return undefined; 
              }
            } catch (err) {
              console.log(err)
            }
          },
          getRouteHistoryByRouteName: (state) => (name: string) => {
            try {
              if (name) {
              const routeHistory = state.routeHistory
                .filter((baseRouteHistory: IRouteHistory) => 
                  baseRouteHistory.routeHistory.some((route) => route.name === name))
                // .map(baseRouteHistory => {
                //   return Object.assign({}, baseRouteHistory, {routeHistory : baseRouteHistory.routeHistory.filter(route => route.name === name)});
                // }); 

                if (routeHistory.length > 0 ) {
                  return routeHistory[0]; 
                } else {
                  return undefined;
                }
              } else {
                return undefined;
              }
            } catch (err) {
              console.log(err)
            }
          },
          getRouteHistoryByPage: (state) => (page: string) => {
            try {
              if (page) {
              const routeHistory = state.routeHistory
                .filter((baseRouteHistory: IRouteHistory) => 
                  baseRouteHistory.routeHistory.some((route) => route.meta.currentPage === page))
                // .map(baseRouteHistory => {
                //   return Object.assign({}, baseRouteHistory, {routeHistory : baseRouteHistory.routeHistory.filter(route => route.meta.currentPage === page)});
                // }); 

                if (routeHistory.length > 0 ) {
                  return routeHistory[0]; 
                } else {
                  return undefined;
                }
              } else {
                return undefined;
              }
            } catch (err) {
              console.log(err)
            }
          }
        }
      })

      let isTimeTraveling: boolean = false
      let currentPath: string = ``;


      // sync router on store change
      store.watch(
        state => state.ComponentRouter.routeHistory,
        (newValue, oldValue) => {
          const route  = recentRouteChange.routeHistory[0]; 
          const { fullPath } = route
          if (fullPath === currentPath) {
            return
          }
          if (currentPath !== null) {
            isTimeTraveling = true
            Vue.prototype.$goTo( route.name, recentRouteChange.routeHistoryName )
          }
          currentPath = fullPath
        },
        {
          deep: true
        }
      )

      // sync store on router navigation
      router.afterEach((to: Route, from: Route) => {
        try {

          let routeHistoryName = '';
          if (to.matched.length > 1 && to.path === to.matched[0].path) {
            // we are dealing with a default child route so we want the routeHistoryName to be the parents
            routeHistoryName = to.matched[0].meta.routeHistoryName
          } else {
            routeHistoryName = to.meta.routeHistoryName;
          }

          const routeHistory = store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);

          if (isTimeTraveling || (routeHistory && routeHistory.routeHistory.length > 0 && to.fullPath === routeHistory.routeHistory[routeHistory.routeHistory.length - 1].fullPath)) {
            isTimeTraveling = false
            return
          }

          currentPath = to.fullPath
          store.dispatch('ComponentRouter/updateRouteHistory', { routeHistoryName, to, from } );
        } catch (err) {
          console.log('err - ', err);
        }
      })

      return;

    } else {
      return Error(`The module named: ${moduleName} already exists in the store!`);
      
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

export interface IRouteHistory {
  routeHistoryName: string;
  routeHistory: Route[];
}

export default componentRouter;