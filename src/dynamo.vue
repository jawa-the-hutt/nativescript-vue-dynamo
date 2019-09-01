<template>
  <!-- <StackLayout @swipe="onSwipe"> -->
  <StackLayout>
    <Frame v-if="getIsNativeMode" :id="routeHistoryName">
      <StackLayout >
        <component :is="computedCurrentRoute" :key="computedComponentKey" v-on:dynamo-event="eventHandler" :functionHandler="functionHandler" v-bind="routeParams" />
      </StackLayout>
    </Frame>
  </StackLayout>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { ComponentOptions, AsyncComponent } from 'vue';
  import { Route, RouteRecord } from 'vue-router';
  import { IRouteHistory } from "./component-router";
  // import { SwipeDirection } from 'tns-core-modules/ui/gestures';

  @Component({
    name: 'Dynamo',
  })
  export default class Dynamo extends Vue {
    // public notBackButton: boolean = true;

    private routeParams!: object;
    private currentRoute!: RouteRecord[];
    private componentKey: number = 0;

    @Prop({ required: true }) public routeHistoryName!: string;
    @Prop({ required: true }) public defaultRoute!: string;
    @Prop({ required: false }) public functionHandler!: object | Function;
    @Prop({ required: false }) public appMode!: string;

    private _appMode!: string;

    public created() {
      // console.log('dynamo - created - routeHistoryName - ', this.routeHistoryName);
      // console.log('dynamo - created - defaultRoute - ', this.defaultRoute);
      // // console.log('dynamo - created - parentRouteHistoryName - ', this.parentRouteHistoryName);
      // // console.log('dynamo - created - getIsNativeMode - ', this.getIsNativeMode);

      
      this._appMode =  this.appMode === undefined ? 'native' : this.appMode === 'native' ? 'native' : 'web';
      if (this._appMode === 'native') {
        // @ts-ignore
        this.$root.$goTo(this.defaultRoute);
      }
    }

    // public onSwipe(args) {
    //   let direction =
    //     args.direction == SwipeDirection.down
    //       ? "down"
    //       : args.direction == SwipeDirection.up
    //         ? "up"
    //         : args.direction == SwipeDirection.left
    //           ? "left"
    //           : "right";
    //   console.log("You performed a " + direction + " swipe");
    // }

    public eventHandler(e) {
      this.$emit(this.routeHistoryName + '-event-handler', e);
    }

    private getMatchingRouteRecord = (routeHistory: Route[]): RouteRecord[] => {
      const { matched }: { matched: RouteRecord[] } = routeHistory[routeHistory.length - 1];
      const { path }: { path: string } = routeHistory[routeHistory.length - 1];
      return matched.filter( (record: RouteRecord) => Object.keys(record).some((key: string) => record[key] && record[key] === path ));
    }

    get computedComponentKey(): number {
      this.componentKey += 1;
      return this.componentKey;
    }


    get computedCurrentRoute(): ComponentOptions<Vue> | typeof Vue | AsyncComponent | undefined {
      let routeHistory!: Route[];
      

      // @ts-ignore
      if (this.computedRouteHistory && this.computedRouteHistory.routeHistory.length > 0) {
        // @ts-ignore
        // get the matching routeHisotry
        routeHistory = this.$store.getters['ComponentRouter/getCurrentRoute'](this.routeHistoryName);

        // get the matched route record
        this.currentRoute = this.getMatchingRouteRecord(routeHistory);

        // get any passed route parameters so we can pass them into the component
        if (routeHistory[routeHistory.length - 1].params) {
          this.routeParams = routeHistory[routeHistory.length - 1].params;
        }

        // get the actual component from the RouteRecord
        return this.currentRoute[0].components.default;
      } else {
        return undefined;
      }
    }

    get computedRouteHistory(): IRouteHistory {
      const routeHistory: IRouteHistory = this.$store.getters['ComponentRouter/getRouteHistoryByName'](this.routeHistoryName);
      return routeHistory;
    }

    get getIsNativeMode(): boolean {
      return this._appMode === 'native' ? true : false;
    }
  }

</script>
