import { VueConstructor } from 'vue';
import Router, { Route, RouteConfig } from 'vue-router';
import { Store } from 'vuex';
declare const componentRouter: (store: Store<any>, router: Router, routes: RouteConfig[], appMode: string, Vue: VueConstructor<import("vue").default>) => Promise<Error | undefined>;
export interface IRouteHistory {
    routeHistoryName: string;
    routeHistory: Route[];
}
export default componentRouter;
