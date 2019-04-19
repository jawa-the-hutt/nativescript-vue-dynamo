<template web>
  <div class="w-page">
    <Dynamo
      :route-history-name="'main'"
      :default-route="defaultRoute"
    />
  </div>
</template>
<template native>
  <Page actionBarHidden="true">
    <Dynamo
      :routeHistoryName="'main'"
      :defaultRoute="defaultRoute"
      :appMode="'native'"
    />
  </Page>
</template>
<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component
  export default class App extends Vue {
    @Prop({default: 'login'}) public defaultRoute!: string;
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
