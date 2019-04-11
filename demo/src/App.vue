<template web>
  <div class="w-page">
    <component
      :is="computedCurrentRoute"
    />
    <router-view />
  </div>
</template>
<template native>
  <DynamoComponentRouter />
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import '~/utils/class-component-hooks';
  // import Dynamo from '../../';
  // import { routes } from './router';

  @Component
  export default class App extends Vue {

    // mounted() {
    //   Vue.prototype['$ComponentRouter'] = Dynamo.componentRouter( this.$store, this.$router, routes, 'ComponentRouter' );
    //   Vue.use( Dynamo, { 
    //     appMode: this.$store.state.appMode, 
    //     // store,
    //     // router,
    //     // routes,
    //     moduleName: 'ComponentRouter' 
    //   });
    // }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style web lang="scss">
  @import '~styles/style-one';

  .w-page {
    height: 100%;
    width: 100%;
  }

</style>
<style native lang="scss">
  @import '~styles/style-one';
</style>
