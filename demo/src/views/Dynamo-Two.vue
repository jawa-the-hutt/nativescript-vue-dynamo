<template web>
  <div class="w-page">
    <div class="w-container">
      <router-link id="dynamoOneButton" tag="button" class="w-button" to="dynamo-one">Dynamo One</router-link>
    </div>
  </div>
</template>
<template native>
  <Page actionBarHidden="true">
    <GridLayout rows="auto">
      <Button text="Dynamo One" @tap="$router.push('dynamo-one')" row="0" />
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { releaseNativeObject } from 'tns-core-modules/utils/utils';

  @Component({
    name: 'dynamo-two',
  })
  export default class DynamoTwo extends Vue {

    public mounted(){
      // @ts-ignore
      console.log("DynamoTwo.vue - mounted - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
    }

    public beforeDestroy() {
      try {
        console.log("beforeDestroy - this.$refs.page 1 - " + this.$refs.page);
        // @ts-ignore
        console.log("beforeDestroy - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
        // @ts-ignore
        console.log("beforeDestroy - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected.toString());
        // @ts-ignore
        // use buit in NS function to destroy the native component
        releaseNativeObject(this.$refs.page.nativeView.nativeViewProtected);
        console.log("RELEASED!");
        console.log("beforeDestroy - this.$refs.page 2 - " + this.$refs.page);
        // @ts-ignore
        console.log("beforeDestroy - this.$refs.page.nativeView 2 - " + this.$refs.page.nativeView.toString());
        // @ts-ignore
        console.log("beforeDestroy - this.$refs.page.nativeView.nativeViewProtected 2 - " + this.$refs.page.nativeView.nativeViewProtected.toString());
      } catch (err) {
        console.log(err);
      }
    }

    public destroyed() {
      try {
        console.log("destroyed - this.$refs.page 1 - " + this.$refs.page);
        // @ts-ignore
        console.log("destroyed - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
        // @ts-ignore
        console.log("destroyed - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected.toString());
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
