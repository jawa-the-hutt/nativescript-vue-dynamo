<template>
  <Frame v-else-if="getIsNativeMode" :id="routeHistoryName">
    <StackLayout>
      <component :is="computedCurrentRoute" v-on:dynamo-event="eventHandler" :functionHandler="functionHandler" v-bind="routeParams" />
    </StackLayout>
  </Frame>  
</template>
<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { ComponentOptions, AsyncComponent } from 'vue';
  import { Route, RouteRecord } from 'vue-router';
  import { IRouteHistory } from "./component-router";

  @Component({
    name: 'Dynamo',
  })
  export default class Dynamo extends Vue {
    private routeParams!: object;
    private currentRoute!: RouteRecord;

    @Prop({ required: true }) public routeHistoryName!: string;
    @Prop({ required: true }) public defaultRoute!: string;
    @Prop({ required: false }) public functionHandler!: object | Function;
    @Prop({ required: true }) public appMode!: string;

    public created() {
      // console.log('dynamo - created - routeHistoryName - ', this.routeHistoryName);
      // console.log('dynamo - created - defaultRoute - ', this.defaultRoute);
      // // console.log('dynamo - created - parentRouteHistoryName - ', this.parentRouteHistoryName);
      // // console.log('dynamo - created - getIsNativeMode - ', this.getIsNativeMode);

      this.appMode =  this.appMode === undefined || 'native' ? 'native' : 'web';
      if (this.appMode === 'native') {
        // @ts-ignore
        this.$root.$goTo(this.defaultRoute);
      }
    }

    public eventHandler(e) {
      this.$emit(this.routeHistoryName + '-event-handler', e);
    }

    private getMatchingRouteRecord = (routeHistory: Route[]): RouteRecord[] => {
      const { matched }: { matched: RouteRecord[] } = routeHistory[routeHistory.length - 1];
      const { path }: { path: string } = routeHistory[routeHistory.length - 1];
      return matched.filter( (record: RouteRecord) => Object.keys(record).some((key: string) => record[key] && record[key] === path ));
    }

    get computedCurrentRoute(): ComponentOptions<Vue> | typeof Vue | AsyncComponent {
      let routeHistory!: Route[];
      

      // @ts-ignore
      if (this.computedRouteHistory && this.computedRouteHistory.routeHistory.length > 0) {
        // @ts-ignore
        // get the matching routeHisotry
        routeHistory = this.$store.getters['ComponentRouter/getCurrentRoute'](this.routeHistoryName);

        // get the matched route record
        this.currentRoute = this.getMatchingRouteRecord(routeHistory)[0];

        // get any passed route parameters so we can pass them into the component
        if (routeHistory[routeHistory.length - 1].params) {
          this.routeParams = routeHistory[routeHistory.length - 1].params;
        }

        // get the actual component from the RouteRecord
        return this.currentRoute.components.default;
      } else {
        return Vue;
      }
    }

    get computedRouteHistory(): IRouteHistory {
      const routeHistory: IRouteHistory = this.$store.getters['ComponentRouter/getRouteHistoryByName'](this.routeHistoryName);
      return routeHistory;
    }

    get getIsNativeMode(): boolean {
      return this.appMode === 'native' ? true : false;
    }
  }

</script>
