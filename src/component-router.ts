import Router, { Route, RouteConfig, RouteRecord } from 'vue-router';
import { Store } from 'vuex';
// // import { getCurrentPage } from  './native-current-page';

const componentRouter = async (store: Store<any>, router: Router, routes: RouteConfig[], appMode: string) => {
  console.log('starting componentRouter function');

  try {
    let currentPage: string = '';
    
    // if(appMode === 'native') {
    //   console.log('componentRouter - appMode - ', appMode);

    //   // (async () => {
    //   // // //   // const getCurrentPage = './native-current-page';
    //   // // const mod = await import('./native-current-page')
    //   // // console.log('componentRouter - module - ', mod.d)
    //   // // //   currentPage = module.getCurrentPage();
    //   // // //   console.log('componentRouter - currentPage - ', currentPage)
    //   // // //   // // → logs 'Hi from the default export!'
    //   // // //   // module.doStuff();
    //   // // //   // // → logs 'Doing stuff…'
    //   // })();


    //   // const myModule = './native-current-page.js';
    //   // import(myModule).then(x => { 
    //   //   console.log('x - ', x)
    //   //   x.getCurrentPage();
    //   // });


    //   // return await import('./native-current-page').then((m) => {
    //   // const page = getCurrentPage();
    //   // console.log('componentRouter - page - ', getCurrentPage)
    //   //   // const page = await nativeCurrentPage.getCurrentPage();
    //   //   // console.log('componentRouter - page - ', page)
    //   //   // return page;
    //   // });

    //   // const topmost = await import('tns-core-modules/ui/frame').then((module) => {
    //   //   const {topmost} = module;
    //   //   return topmost;
    //   // });

    //   // console.log('componentRouter - currentPage - ', topmost().currentPage.toString())

    // } else if (appMode === 'web') {
    //   currentPage = router.currentRoute.fullPath;
    // } else {
    // }


    const moduleName = 'ComponentRouter'; // routeHistoryName !== undefined ? routeHistoryName : 'ComponentRouter';
    // console.log('routeHistoryName - ', routeHistoryName);
    // console.log(routeHistoryName + ' - !store.state[routeHistoryName] - ', store.state[routeHistoryName])

    if(!store.state[moduleName]) {
      // module does not exist in the store
      // console.log(routeHistoryName + ' - module does not exist in the store');
      store.registerModule(moduleName, {
        namespaced: true,
        state: {
          routeHistory: [] as IRouteHistory[],
        },
        mutations: {
          updateRouteHistory (state, routeHistory: IRouteHistory[]) {
            console.log('starting dynamo - mutations - updateRouteHistory', routeHistory)
            state.routeHistory = routeHistory;
          }
        },
        actions:{
          async updateRouteHistory ({state, commit}, payload: { routeHistoryName: string, to: Route, from: Route}) {
            console.log(payload.routeHistoryName + ' - starting dynamo - actions - updateRouteHistory')

            let newRouteHistory!: IRouteHistory[];
            const routeHistoryName = payload.routeHistoryName;
            const to = payload.to;
            const from = payload.from;

            // add current routeHistoryName to meta tag in the route history
            if(payload.to.meta && payload.to.params && payload.to.params.routeHistoryName) {
              to.meta.routeHistoryName = payload.to.params.routeHistoryName;
            }

            // add the parent routeHistoryName (if it exists) to meta tag in the route history
            if(payload.to.meta && payload.to.params && payload.to.params.parentRouteHistoryName) {
              to.meta.parentRouteHistoryName = payload.to.params.parentRouteHistoryName;
            }

            // add the child routeHistoryName (if it exists) to meta tag in the route history
            if(payload.to.meta && payload.to.params && payload.to.params.childRouteHistoryName) {
              to.meta.childRouteHistoryName = payload.to.params.childRouteHistoryName;
            }

            if(payload.to.meta) {
              console.log('updateRouteHistory - currentPage -', currentPage)
              to.meta.currentPage = currentPage;
            }

            if(state) {
              newRouteHistory = [...state.routeHistory];
            }
            
            // get the specific route history matching the name passed in
            const index = newRouteHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);

            if (!payload.to.params.clearHistory) {
              // we ARE NOT clearing the route history
              if(index > -1) {
                const routeHistory = newRouteHistory[index].routeHistory;

                if(routeHistory.length > 1 && to.fullPath === routeHistory[routeHistory.length - 2].fullPath) {  
                  // we're going back from where we came from
                  routeHistory.pop();
                  if(routeHistory.length === 0) {
                    // we have removed the last routeHistory for this node, so delete it out of the parent array
                    newRouteHistory.splice(index, 1);
                  }

                  // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
                  commit('updateRouteHistory', newRouteHistory);

                } else if (routeHistory.length > 0 && to.fullPath === routeHistory[routeHistory.length - 1].fullPath) { 
                  // we didn't actually go anywhere

                  // add the child routeHistoryName (if it exists) to the most current route history
                  if(to.meta.childRouteHistoryName) {
                    routeHistory[routeHistory.length - 1].meta.childRouteHistoryName = to.meta.childRouteHistoryName;
                    
                    // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
                    commit('updateRouteHistory', newRouteHistory);
                  }
                } else {  
                  // we're going forward somewhere
                  routeHistory.push(to);
                
                  // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
                  commit('updateRouteHistory', newRouteHistory);
                }


              } else {
                // this is a brand new route level. most likel a child route unless it's the first ever created in the app

                // we're going forward somewhere
                newRouteHistory.push({routeHistoryName, routeHistory: [to]});
                commit('updateRouteHistory', newRouteHistory);
              }

            
            } else {
              // we ARE clearing the route history
              newRouteHistory.splice(index, 1);
              newRouteHistory.push({routeHistoryName, routeHistory: [to]});

              // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
              commit('updateRouteHistory', newRouteHistory);
            }

            
          },
          clearRouteHistory ({state, commit}, payload?: {routeHistoryName: string}) {
            // console.log(payload.name + ' - starting dynamo - actions - clearRouteHistory')
            let newRouteHistory!: IRouteHistory[];

            if (payload) {
              const routeHistoryName = payload.routeHistoryName;

              if(state) {
                newRouteHistory = [...state.routeHistory];
              }
              
              // get the specific route history matching the name passed in
              const index = newRouteHistory.findIndex(obj => obj.routeHistoryName === routeHistoryName);
              newRouteHistory.splice(index, 1);

              // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
              commit('updateRouteHistory', newRouteHistory);

            } else {
              //let newRouteHistory!: Route[];

              // we ARE clearing the entire route history for EVERYTHING
              newRouteHistory = [];

              // console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
              commit('updateRouteHistory', newRouteHistory);
            }
          }
        },
        getters: {
          getCurrentRoute: (state) => (routeHistoryName: string) => {
            console.log(routeHistoryName + ' - starting getCurrentRoute');
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
          getRouteHistoryByName: (state) => (routeHistoryName?: string) => {
            console.log('starting getRouteHistoryByName - ', routeHistoryName);

            if(routeHistoryName) {
              // get the specific route history matching the name passed in
              const index = state.routeHistory.findIndex((baseRouteHistory: IRouteHistory) => baseRouteHistory.routeHistoryName === routeHistoryName);
              console.log('getRouteHistoryByName - index -', index);

              if (index > -1 && state.routeHistory[index].routeHistory && state.routeHistory[index].routeHistory.length > 0 ) {
                return state.routeHistory[index].routeHistory; // getMatchingRouteHistory(state.routeHistory, index);
              } else {
                return state.routeHistory;
              }
            } else {
              return state.routeHistory; 
            }
          },
          // getRouteHistoryByPage: (state) => (page?: string) => {
          //   console.log(page + ' - starting getRouteHistoryByPage');

          //   if (page) {
          //     const index = state.routeHistory.filter( (baseRouteHistory: IRouteHistory) => Object.keys(baseRouteHistory).some((key: string) => baseRouteHistory[key] && baseRouteHistory[key] === page ));
          //     console.log('getRouteHistoryByPage - page - ', index)
          //     return index;
          //   } else {
          //     return state.routeHistory;
          //   }
          // }
        }
      })

      let isTimeTraveling: boolean = false
      let currentPath: string = ``;

      // sync router on store change
      // const unWatch = () => {
        for(const attribute in store.state.routeHistory) {

          store.watch(
            state => state.routeHistory[attribute],
            (newValue, oldValue) => {
              console.log('dynamo - starting store.watch')
              console.log('newValue - ', newValue)
              console.log('oldValue - ', oldValue)
              // const route  = routeHistory[routeHistory.length - 1];
              // const { fullPath } = route
              // if (fullPath === currentPath) {
              //   // console.log('fullPath === currentPath');
              //   return
              // }
              // if (currentPath != null) {
              //   // console.log('currentPath != null');
              //   isTimeTraveling = true
              //   router.push(route)
              // }
              // currentPath = fullPath
            },
          )

        // }
      }

      // sync store on router navigation
      // const removeRouteHook = 
      router.afterEach(async (to: Route, from: Route) => {
        console.log('starting afterEachUnHook');
        try {

        // async () => {
          // const topmost = require('tns-core-modules/ui/frame').topmost // .then(({topmost}) => {
            // const {topmost} = module;
            
          //   return topmost;
          // });
        // };



          const routeHistoryName = to.params.routeHistoryName;
          console.log('afterEachUnHook - routeHistoryName - ', routeHistoryName);

          const routeHistory = store.getters['ComponentRouter/getRouteHistoryByName'](routeHistoryName);
          console.log('routeHistory - ', routeHistory)
          if (isTimeTraveling || (routeHistory && routeHistory.length > 0 && to.fullPath === routeHistory[routeHistory.length - 1].fullPath)) {
            console.log('we are timeTraveling so do nothing');
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
      // return () => {
      //   console.log(moduleName + ' - calling remove function for routeHistoryName : ', moduleName);
      //   // On unsync, remove router hook
      //   if (removeRouteHook != null) {
      //     removeRouteHook();
      //   }

      //   // On unsync, remove store watch
      //   if (unWatch != null) {
      //     unWatch();
      //   }

      //   // On unsync, unregister Module with store
      //   store.unregisterModule(moduleName);
      // }
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

const getMatchingRouteHistory = (routeHistory: IRouteHistory[], index?: number) => {
  if(index) {
    return routeHistory[index].routeHistory;
  } else {
    return routeHistory;
  }
}

const getMatchingRouteConfig = (routes: RouteConfig[], path: string ) => {
  return routes.filter( (route: RouteConfig) => Object.keys(route).some((key: string) => route[key] && route[key] === path ));
}

export interface IRouteHistory {
  routeHistoryName: string;
  routeHistory: Route[];
}

export default componentRouter;