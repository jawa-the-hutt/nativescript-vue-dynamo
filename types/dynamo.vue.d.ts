import { Vue } from 'vue-property-decorator';
import { Route } from 'vue-router';
import { IRouteHistory } from "./component-router";
export default class Dynamo extends Vue {
    private template;
    routeHistoryName: string;
    defaultRoute: string;
    parentRouteHistoryName: string;
    functionHandler: object | Function;
    appMode: string;
    created(): void;
    eventHandler(e: any): void;
    readonly computedCurrentRoute: Route;
    readonly computedRouteHistory: IRouteHistory;
    readonly getIsNativeMode: boolean;
}
