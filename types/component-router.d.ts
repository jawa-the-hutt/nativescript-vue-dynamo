import Router, { RouteConfig } from 'vue-router';
import { Store } from 'vuex';
declare const componentRouter: (store: Store<any>, router: Router, routes: RouteConfig[], moduleName: string) => () => void;
export default componentRouter;
