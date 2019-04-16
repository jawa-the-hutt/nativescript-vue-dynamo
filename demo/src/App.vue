<template web>
  <div class="w-page">
    <!-- <component
      :is="isLoggedIn === true ? 'home' : 'login'"
    /> -->
    <!-- <Dynamo
      :routeHistoryName="'main'"
      :defaultRoute="'home'"
      :topPage="pageUpdated"
    /> -->
    <!-- <router-view /> -->
    <!-- <home /> -->
  </div>
</template>
<template native>
  <Page actionBarHidden="true" ref="page">
    <Dynamo ref='main'
        :routeHistoryName="'main'"
        :defaultRoute="'home'"
    />
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component
  export default class App extends Vue {
  //   private page: string = '';

  //   public updatePage(value) {
  //     console.log('app.vue - updatePage - emitted value - ', value);
  //     this.page = value;
  //   }
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
