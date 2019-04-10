import { VueConstructor, PluginFunction } from 'vue';
import Router, { RouteConfig } from 'vue-router';
import { Store } from 'vuex';
export declare function install(Vue: VueConstructor, options: any): void;
declare class Dynamo {
    static install: PluginFunction<never>;
    static componentRouter(store: Store<any>, router: Router, routes: RouteConfig[], moduleName: string): PluginFunction<any>;
}
export declare namespace install {
    let installed: boolean;
}
export default Dynamo;
