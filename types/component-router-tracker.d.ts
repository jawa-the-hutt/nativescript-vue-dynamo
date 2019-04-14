import { Store } from 'vuex';
declare const componentRouterTracker: (store: Store<any>) => void;
export interface IComponentRouterModules {
    routeHistoryName: string;
    parentRouteHistoryName?: string;
}
export default componentRouterTracker;
