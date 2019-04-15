<template web>
  <div class="w-page">
    <div class="w-container">
      <router-link id="dynamoOneButton" tag="button" class="w-button" to="{ name: dynamo-one, params: { routeHistoryName: 'first', parentRouteHistoryName: 'main'}}">Dynamo One</router-link>
    </div>
  </div>
</template>
<template native>
  <Page actionBarHidden="true" ref="page">
    <GridLayout rows="auto">
      <Button text="Dynamo One" @tap="$router.push({ name: 'dynamo-one', params: { routeHistoryName: 'first', parentRouteHistoryName: 'main'}})" row="0" />
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  // import { releaseNativeObject } from 'tns-core-modules/utils/utils';

  @Component({
    name: 'dynamo-two',
  })
  export default class DynamoTwo extends Vue {

    public created() {
      // set this to make sure backwards navigation through native API's will navigate the correct routeHistory
      if (this.$store.state.appMode === 'native') {
        (this as any).$interceptGoBack('first');
      }
    }

    public mounted() {
      if (this.$store.state.appMode === 'native') {
        // @ts-ignore
        console.log("DynamoTwo.vue - mounted - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
        console.log("DynamoTwo.vue - mounted - this.$router.currentRoute.fullPath - " + this.$router.currentRoute.fullPath );
      }
    }

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
