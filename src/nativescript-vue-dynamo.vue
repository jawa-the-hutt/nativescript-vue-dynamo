<template>
  <div></div>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { Route } from 'vue-router';
  import { IRouteHistory } from "./component-router";

  @Component({
    name: 'dynamo',
  })
  export default class Dynamo extends Vue {

    @Prop({ required: true }) public routeHistoryName!: string;
    @Prop({ required: true }) public defaultRoute!: string;
    @Prop({ required: false }) public parentRouteHistoryName!: string;
    @Prop({ required: false }) public functionHandler!: object | Function;

    public created() {
      console.log('dynamo - created - routeHistoryName - ', this.routeHistoryName);
      console.log('dynamo - created - routeHistoryName - ', this.parentRouteHistoryName);

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
  }

</script>
