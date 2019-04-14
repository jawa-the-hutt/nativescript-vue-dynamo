import { Store } from 'vuex';

const componentRouterTracker = (store: Store<any>) => {
  console.log('starting componentRouterTracker');

  store.registerModule('componentRouterTracker', {
    namespaced: true,
    state: {
      componentRouterModules: [] as IComponentRouterModules[],
      // pages: [] as IPageTracker[],
    },
    mutations: {
      updateComponentRouterModules (state, componentRouterModules: IComponentRouterModules[]) {
        console.log('starting componentRouterTracker - mutations - updateComponentRouterModules');
        state.componentRouterModules = componentRouterModules;
      },
      // updatePages (state, pages: IPageTracker[]) {
      //   console.log('starting componentRouterTracker - mutations - updatePages');
      //   state.pages = pages;
      // }
    },
    actions:{
      updateComponentRouterModules ({state, commit}, payload: { routeHistoryName: string, parentRouteHistoryName?: string, status? :boolean }) {
        console.log('starting componentRouterTracker - actions - updateComponentRouterModules');
        const routeHistoryName = payload.routeHistoryName;
        const parentRouteHistoryName = payload.parentRouteHistoryName;
        const status = payload.status;

        let newStatus: boolean = status === undefined || status === true ? true : false;
        let newComponentRouterModules: IComponentRouterModules[] = [...state.componentRouterModules];

        if (newComponentRouterModules.findIndex(obj => obj.routeHistoryName === routeHistoryName) > -1) {
          //In the array!
          if(!newStatus) {
            // removing the array element
            newComponentRouterModules.splice(newComponentRouterModules.findIndex(obj => obj.routeHistoryName === routeHistoryName), 1);
            console.log('updateComponentRouterModules - newComponentRouterModules - ', newComponentRouterModules);
            commit('updateComponentRouterModules', newComponentRouterModules);
          }
        } else {
          //Not in the array
          if(newStatus) {
            // add the array element
            newComponentRouterModules.push({ routeHistoryName, parentRouteHistoryName });
            console.log('updateComponentRouterModules - newComponentRouterModules - ', newComponentRouterModules);
            commit('updateComponentRouterModules', newComponentRouterModules);
          }
        }

      },
      // updatePages ({state, commit}, payload: { page: IPageTracker, status? :boolean }) {
      //   console.log('starting componentRouterTracker - actions - updatePages');
      //   const page = payload.page;
      //   const status = payload.status;

      //   let newStatus: boolean = status === undefined || status === true ? true : false;
      //   let newPages: IPageTracker[] = [...state.pages];

      //   if (newPages.indexOf(page) > -1) {
      //     //In the array!
      //     if(!newStatus) {
      //       // removing the array element
      //       newPages.splice(newPages.indexOf(page), 1);
      //       console.log('updatePages - newPages - ', newPages);
      //       commit('updatePages', newPages);
      //     }
      //   } else {
      //     //Not in the array
      //     if(newStatus) {
      //       // add the array element
      //       newPages.push(page);
      //       console.log('updatePages - newPages - ', newPages);
      //       commit('updatePages', newPages);
      //     }
      //   }

      // }
    },
    getters: {
      getComponentRouterModules: state => {
        return state.componentRouterModules;
      },
      // getPages: state => {
      //   return state.pages;
      // }
    }
  });

}

// const getMatchingModule = (path: string) => {
//   const matched: RouteRecord[] = routeHistory[routeHistory.length - 1].matched;
//   const path = routeHistory[routeHistory.length - 1].path;
//   return matched.filter( (record: RouteRecord) => Object.keys(record).some((key: string) => record[key] && record[key] === path ));
// }

export interface IComponentRouterModules {
  // page: string;
  routeHistoryName: string;
  // childRouteHistoryName?: string[];
  parentRouteHistoryName?: string;
}

export default componentRouterTracker;