<template>
  <Frame v-else-if="getIsNativeMode" :id="routeHistoryName">
    <StackLayout>
      <component v-bind:is="computedCurrentRoute" v-on:dynamo-event="eventHandler" :functionHandler="functionHandler" />
    </StackLayout>
  </Frame>  
</template>
<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { Route } from 'vue-router';
  import { IRouteHistory } from "./component-router";

  @Component({
    name: 'Dynamo',
  })
  export default class Dynamo extends Vue {
    private template: string = '';

    @Prop({ required: true }) public routeHistoryName!: string;
    @Prop({ required: true }) public defaultRoute!: string;
    @Prop({ required: false }) public parentRouteHistoryName!: string;
    @Prop({ required: false }) public functionHandler!: object | Function;
    @Prop({ required: true }) public appMode!: string;

    public created() {
      console.log('dynamo - created - routeHistoryName - ', this.routeHistoryName);
      console.log('dynamo - created - defaultRoute - ', this.defaultRoute);
      console.log('dynamo - created - parentRouteHistoryName - ', this.parentRouteHistoryName);
      console.log('dynamo - created - getIsNativeMode - ', this.getIsNativeMode);

      if (this.appMode === 'native') {
        // @ts-ignore
        this.$root.$goTo(this.defaultRoute, this.routeHistoryName, this.parentRouteHistoryName);
      }
    }

    public eventHandler(e) {
      this.$emit(this.routeHistoryName + '-event-handler', e);
    }

    get computedCurrentRoute(): Route {
      let currentRoute!: Route;
      // @ts-ignore
      if (this.computedRouteHistory && this.computedRouteHistory.routeHistory.length > 0) {
        // @ts-ignore
        currentRoute = this.$store.getters['ComponentRouter/getCurrentRoute'](this.routeHistoryName).default
        return currentRoute;
      } else {
        return currentRoute;
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
