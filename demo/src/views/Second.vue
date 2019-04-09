<template web>
  <div class="w-page">
    <div class="w-container">
      <span>This is the second page</span>
    </div>
  </div>
</template>
<template native>
  <Page ref="page">
    <ActionBar :title="navbarTitle" />
      <!-- <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="$router.back()"/>
    </ActionBar> -->
    <GridLayout>
      <Label text="This is the second page" textWrap="true" horizontalAlignment="center" verticalAlignment="center"/>
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  // import { topmost } from 'tns-core-modules/ui/frame';

  @Component({
    name: 'second',
  })
  export default class Second extends Vue {
    private navbarTitle: string = `Second.vue`;
    // private checkCount: number = 0;
    // private maxChecks: number = 5;
    // private timerEnd!: number;

    // public created() {
    //   (this as any).$BackButton();
    // }

    // public mounted(){
    //   // console.log('Second.vue - mounted - topmost().currentPage = ', topmost().currentPage);
    //   console.log("Second.vue - mounted - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView);
    // }

    // public check() {
    //   try {
    //     if (topmost().currentPage === undefined  && this.checkCount <= this.maxChecks) {
    //       console.log('Second.vue - topmost().currentPage is UNDEFINED');
    //       // @ts-ignore
    //       clearInterval(this.timerEnd);
    //       return;
    //     } else if (topmost().currentPage !== undefined && this.checkCount > this.maxChecks) {
    //       console.log('Second.vue - checkCount hit 100, but topmost().currentPage is still there so we will exit');
    //       // @ts-ignore
    //       clearInterval(this.timerEnd);
    //       return;        
    //     } else {
    //       console.log(`Second.vue - ${topmost().currentPage} is still there after ${this.checkCount} checks`);
    //       // console.log(`we have checked ${this.checkCount} times`);
    //       this.checkCount++;
    //       return;
    //     }

    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    // public timer() {
    //   // @ts-ignore
    //   this.timerEnd = setInterval(this.check, 50)
    // }

    // public beforeDestroy() {
    //   try {
    //     console.log("beforeDestroy - this.$refs.page 1 - " + this.$refs.page);
    //     console.log("beforeDestroy - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView);
    //     console.log("beforeDestroy - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected);
    //     console.log("beforeDestroy - topmost().currentPage 1 - " + topmost().currentPage);

    //   } catch (err) {
    //     console.log(err);
    //   }
    // }

    // public destroyed() {
    //   try {
    //     console.log("destroyed - this.$refs.page 1 - " + this.$refs.page);
    //     // console.log("destroyed - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView);
    //     // console.log("destroyed - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected);

    //     console.log("destroyed - topmost().currentPage 1 - " + topmost().currentPage);
    //     // check to see when the currentPage is garbage collected
    //     this.timer();
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
