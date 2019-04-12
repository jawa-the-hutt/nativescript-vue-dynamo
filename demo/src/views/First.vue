<template web>
  <div class="w-page">
    <div class="w-container">
      <span>This is the first page</span>
    </div>
  </div>
</template>
<template native>
  <Page ref="page">
    <ActionBar :title="navbarTitle">
      <!-- <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="this.$router.push({ name: 'first', params: { moduleName: 'ComponentRouter', childModuleName: 'FirstRouter'}})"/> -->
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="$AndroidGoBack('ComponentRouter', 'FirstRouter')"/>
    </ActionBar>
    <Frame>
      <DynamoFirstRouter />
    </Frame>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Route } from 'vue-router';
  // import { releaseNativeObject } from 'tns-core-modules/utils/utils';

  @Component({
    name: 'first',
  })
  export default class First extends Vue {
    private navbarTitle: string = `First.vue`;
    private routeHistory: Route[] = this.$store.getters['ComponentRouter' + '/getRouteHistory'];

    public created() {
      // set this to make sure backwards navigation through native API's will navigate the correct routeHistory
      if (this.$store.state.appMode === 'native') {
        (this as any).$GoBack();
        this.$router.push({ name: 'first', params: { moduleName: 'ComponentRouter', childModuleName: 'FirstRouter'}});
        this.$router.push({ name: 'dynamo-one', params: { moduleName: 'FirstRouter', parentModuleName: 'ComponentRouter'}});
      }
    }

    // public mounted() {
    //   if (this.$store.state.appMode === 'native') {
    //     // @ts-ignore
    //     console.log("First.vue - mounted - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
    //   }
    // }

    public beforeDestroy() {
      try {
        if (this.$store.state.appMode === 'native') {
          // console.log("beforeDestroy - this.$refs.page 1 - " + this.$refs.page);
          // // @ts-ignore
          // console.log("beforeDestroy - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
          // // @ts-ignore
          // console.log("beforeDestroy - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected.toString());
          // // @ts-ignore
          // // use buit in NS function to destroy the native component
          // releaseNativeObject(this.$refs.page.nativeView.nativeViewProtected);
          // console.log("RELEASED!");
          // console.log("beforeDestroy - this.$refs.page 2 - " + this.$refs.page);
          // // @ts-ignore
          // console.log("beforeDestroy - this.$refs.page.nativeView 2 - " + this.$refs.page.nativeView.toString());
          // // @ts-ignore
          // console.log("beforeDestroy - this.$refs.page.nativeView.nativeViewProtected 2 - " + this.$refs.page.nativeView.nativeViewProtected.toString());
        }
      } catch (err) {
        console.log(err);
      }
    }

    public destroyed() {
      try {
        if (this.$store.state.appMode === 'native') {
          // console.log("destroyed - this.$refs.page 1 - " + this.$refs.page);
          // // @ts-ignore
          // console.log("destroyed - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
          // // @ts-ignore
          // console.log("destroyed - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected.toString());
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~styles/style-two';
  @import '~styles/style-one';
</style>
