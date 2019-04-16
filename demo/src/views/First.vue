<template web>
  <div class="w-page">
    <div class="w-container">
      <span>This is the first page</span>
    </div>
  </div>
</template>
<template native>
  <Page>
    <ActionBar :title="navbarTitle">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="$goBack('first')"/>
    </ActionBar>
      <Dynamo
        :routeHistoryName="'first'"
        :parentRouteHistoryName="'main'"
        :defaultRoute="'dynamo-one'"
      />
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    name: 'first',
  })
  export default class First extends Vue {
    private navbarTitle: string = `First.vue`;

    public created() {
      if (this.$store.state.appMode === 'native') {
        // set this to make sure backwards navigation through native API's will navigate the correct routeHistory
        (this as any).$interceptGoBack();  
      }
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~styles/style-two';
  @import '~styles/style-one';
</style>
