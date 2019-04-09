import Router, { RouteConfig } from 'vue-router';
import { Store } from 'vuex';
declare const componentRouter: (store: Store<any>, router: Router, routes: RouteConfig[]) => void;
export default componentRouter;
