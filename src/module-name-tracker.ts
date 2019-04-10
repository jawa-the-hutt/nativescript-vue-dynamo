import { Store } from 'vuex';

const componentRouterTracker = (store: Store<any>, moduleName: string) => {
  console.log('starting componentRouterTracker');

  store.registerModule('componentRouterTracker', {
    namespaced: true,
    state: {
      componentRouterModuleNames: [] as string[],
    },
    mutations: {
      updateComponentRouterModuleNames (state, componentRouterModuleNames: string[]) {
        console.log('starting componentRouterTracker - mutations - updateComponentRouterModuleNames');
        state.componentRouterModuleNames = componentRouterModuleNames;
      }
    },
    actions:{
      updateComponentRouterModuleNames ({state, commit}, moduleName: string, action? :boolean) {
        console.log('starting componentRouterTracker - actions - updateComponentRouterModuleNames')
        let newAction: boolean = action !== undefined && action === true ?  true : false;
        let newComponentRouterModuleNames: string[] = [...state.componentRouterModuleNames];

        // // if(!action || action !== undefined) {
        // //   newAction = false;
        // // }

        if (newComponentRouterModuleNames.indexOf(moduleName) > -1) {
          //In the array!
          if(!newAction) {
            // removing the array element
            newComponentRouterModuleNames.splice(newComponentRouterModuleNames.indexOf("moduleName"), 1);
            console.log('updateComponentRouterModuleNames - newComponentRouterModuleNames - ', newComponentRouterModuleNames);
            commit('updateComponentRouterModuleNames', newComponentRouterModuleNames);
          }
        } else {
          //Not in the array
          if(newAction) {
            // add the array element
            newComponentRouterModuleNames.push(moduleName);
            console.log('updateComponentRouterModuleNames - newComponentRouterModuleNames - ', newComponentRouterModuleNames);
            commit('updateComponentRouterModuleNames', newComponentRouterModuleNames);
          }
        }

      }
    },
    getters: {
      getComponentRouterModuleNames: state => {
        return state.componentRouterModuleNames;
      }
    }
  });

}

export default componentRouterTracker;