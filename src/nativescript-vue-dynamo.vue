<template v-if="appMode === 'web'">
  <div :id="routeHistoryName">
    <!-- <component v-bind:is="computedCurrentRoutes" v-on:dynamo-event="eventHandler" :functionHandler="functionHandler" /> -->
    <span>This is the hellllllp page</span>
  </div>
</template>
<template v-else-if="appMode === 'native'">
  <Frame :id="routeHistoryName">
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
    name: 'dynamo',
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
      console.log('dynamo - created - routeHistoryName - ', this.parentRouteHistoryName);
      console.log('dynamo - created - getIsNativeMode - ', this.getIsNativeMode);

      // if (options.store.state.appMode === 'native') {
      Vue.prototype.$goTo(this.defaultRoute, this.routeHistoryName, this.parentRouteHistoryName);
      // }
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
