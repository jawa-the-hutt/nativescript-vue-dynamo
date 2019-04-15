import { VueConstructor, PluginFunction } from 'vue';
export declare function install(Vue: VueConstructor, options: any): Promise<void>;
declare class Dynamo {
    static install: PluginFunction<never>;
}
export declare namespace install {
    let installed: boolean;
}
export default Dynamo;
