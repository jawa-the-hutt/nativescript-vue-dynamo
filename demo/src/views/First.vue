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
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="$router.back()"/>
    </ActionBar>
    <GridLayout>
      <Label text="This is the first page" textWrap="true" horizontalAlignment="center" verticalAlignment="center"/>
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  // import { releaseNativeObject } from 'tns-core-modules/utils/utils';
  // import { topmost } from 'tns-core-modules/ui/frame';
  
  @Component({
    name: 'first',
  })
  export default class First extends Vue {
    private navbarTitle: string = `First.vue`;

    // public created() {
    //   (this as any).$BackButton();
    // }

    // public mounted(){
    //   // console.log('First.vue - mounted - topmost().currentPage = ', topmost().currentPage);
    //   console.log("First.vue - mounted - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView);
    // }

    // public beforeDestroy() {
    //   try {
    //     console.log("beforeDestroy - this.$refs.page 1 - " + this.$refs.page);
    //     console.log("beforeDestroy - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView);
    //     console.log("beforeDestroy - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected);
    //     releaseNativeObject(this.$refs.page.nativeView.nativeViewProtected);
    //     console.log("RELEASED!");
    //     console.log("beforeDestroy - this.$refs.page 2 - " + this.$refs.page);
    //     console.log("beforeDestroy - this.$refs.page.nativeView 2 - " + this.$refs.page.nativeView);
    //     console.log("beforeDestroy - this.$refs.page.nativeView.nativeViewProtected 2 - " + this.$refs.page.nativeView.nativeViewProtected);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    // public destroyed() {
    //   try {
    //     console.log("destroyed - this.$refs.page 1 - " + this.$refs.page);
    //     console.log("destroyed - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView);
    //     console.log("destroyed - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~styles/style-two';
  @import '~styles/style-one';
</style>
