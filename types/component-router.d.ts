import Router, { Route, RouteConfig } from 'vue-router';
import { Store } from 'vuex';
declare const componentRouter: (store: Store<any>, router: Router, routes: RouteConfig[]) => () => void;
export interface IRouteHistory {
    routeHistoryName: string;
    routeHistory: Route[];
}
export default componentRouter;
