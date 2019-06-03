import { VueConstructor, PluginFunction } from 'vue';
import { IRouteHistory } from "./component-router";
declare type ErrorHandler = (err: Error) => void;
export declare function install(Vue: VueConstructor, options: any): Promise<void>;
declare const interceptGoBack: () => Promise<void>;
declare const goBack: (canGoBack?: boolean | undefined) => Promise<void>;
declare const goBackToParent: (routeHistoryName: string, parentRouteHistoryName: string) => Promise<void>;
declare const goTo: (location: import("vue-router").RawLocation, clearHistory?: boolean | undefined, onComplete?: Function | undefined, onAbort?: ErrorHandler | undefined) => Promise<void>;
declare class Dynamo {
    static install: PluginFunction<never>;
}
export declare namespace install {
    let installed: boolean;
}
export { IRouteHistory, interceptGoBack, goBack, goBackToParent, goTo, };
export default Dynamo;
