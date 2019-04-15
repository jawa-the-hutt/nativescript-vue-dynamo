import { Module, VuexModule, MutationAction } from 'vuex-module-decorators';
// import store from '~/store';
import Vuex from 'vuex';
import { routes } from '~/router';
import { Route } from 'vue-router';

@Module({
  namespaced: true,
  name: 'componentRouter',
})
export default class ComponentRouter extends VuexModule {

  public currentRoute: any = '';
  public routeHistory: Route[] = [];

  // // @ts-ignore
  // @MutationAction({ mutate: ['currentRoute'], rawError: true })
  // // eslint-disable-next-line
  // public async updateCurrentRoute(): Promise<{ currentRoute: any }> {
  //   console.log('starting updateCurrentRoute');
  //   try {
  //     let newRouteHistory!: Route[];

  //     if(this.state) {
  //       // @ts-ignore
  //       newRouteHistory = [...this.state.routeHistory];
  //     }

  //     const path = newRouteHistory[newRouteHistory.length - 1].path;
  //     // console.log('updateCurrentRoute - path - ', path);

  //     // eslint-disable-next-line
  //     const filter = routes.filter( (route) => Object.keys(route).some((key) => route[key] && route[key] === path ));
  //     // console.log('updateCurrentRoute - filter - ', filter);

  //     return { currentRoute: filter.length === 0 ? name : filter[0].component };
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // @ts-ignore
  @MutationAction({ mutate: ['routeHistory'], rawError: true })
  public async updateRouteHistory(to: Route, from?: Route): Promise<{ routeHistory: Route[] }> {
    console.log('updateRouteHistory - route - ', to);
    try {
      let newRouteHistory!: Route[];
      
      if (!to.params.clearHistory) {

        if(this.state) {
          // @ts-ignore
          newRouteHistory = [...this.state.routeHistory];
        }

        // we ARE NOT clearing the route history
        if(newRouteHistory.length > 1 && to.fullPath === newRouteHistory[newRouteHistory.length - 2].fullPath) {  // we're going back from where we came from
          newRouteHistory.pop();
        } else if (newRouteHistory.length > 0 && to.fullPath === newRouteHistory[newRouteHistory.length - 1].fullPath) { // we didn't actually go anywhere so don't do anything

        
        } else {  // we're going forward somewhere
          newRouteHistory.push(to);

        }
      } else {
        // we ARE clearing the route history
        newRouteHistory = [];
        newRouteHistory.push(to);
      }

      console.log('updateRouteHistory - newRouteHistory - ', newRouteHistory)
      return { routeHistory: newRouteHistory};
    } catch (err) {
      throw err;
    }
  }

  // // @ts-ignore
  // @MutationAction({ mutate: ['routeHistory'], rawError: true })
  // public async goTo(route: Route): Promise<{ routeHistory: Route[] }> {
  //   console.log('goTo - route - ', route.path);
  //   try {
  //     let newRouteHistory!: Route[];
  //     if(this.state) {
  //       // @ts-ignore
  //       newRouteHistory = [...this.state.routeHistory];
  //     }

  //     newRouteHistory.push(route);
  //     // console.log('goTo - newRouteHistory - ', newRouteHistory)

  //     return { routeHistory: newRouteHistory};
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // // @ts-ignore
  // @MutationAction({ mutate: ['routeHistory'], rawError: true })
  // public async goBack(): Promise<{ routeHistory: Route[] }> {
  //   console.log('starting goBack');
  //   try {
  //     let newRouteHistory!: Route[];
  //     if(this.state) {
  //       // @ts-ignore
  //       newRouteHistory = [...this.state.routeHistory];
  //     }

  //     if(newRouteHistory.length > 0) {
  //       newRouteHistory.pop();
  //     }

  //     return { routeHistory: newRouteHistory };
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  // // @ts-ignore
  // @MutationAction({ mutate: ['routeHistory'], rawError: true })
  // public async clearHistory(): Promise<{ routeHistory: Route[] }> {
  //   console.log('starting clearHistory');
  //   try {
  //     const newRouteHistory: Route[] = [];

  //     return { routeHistory: newRouteHistory};
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  public get getCurrentRoute(): any {

    const path = this.routeHistory[this.routeHistory.length - 1].path;
    // eslint-disable-next-line
    const filter = routes.filter( (route) => Object.keys(route).some((key) => route[key] && route[key] === path ));

    return filter[0].component;   
    // return this.currentRoute;
  }

  public get getRouteHistoryByName(): Route[] {
    return this.routeHistory;
  }

}
