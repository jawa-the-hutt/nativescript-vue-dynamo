import { Vue } from 'vue-property-decorator';
import { ComponentOptions, AsyncComponent } from 'vue';
import { IRouteHistory } from "./component-router";
export default class Dynamo extends Vue {
    private routeParams;
    private currentRoute;
    routeHistoryName: string;
    defaultRoute: string;
    functionHandler: object | Function;
    appMode: string;
    private _appMode;
    created(): void;
    eventHandler(e: any): void;
    private getMatchingRouteRecord;
    readonly computedCurrentRoute: ComponentOptions<Vue> | typeof Vue | AsyncComponent | undefined;
    readonly computedRouteHistory: IRouteHistory;
    readonly getIsNativeMode: boolean;
}
