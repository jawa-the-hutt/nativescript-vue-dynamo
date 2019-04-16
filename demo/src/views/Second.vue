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
    <GridLayout>
      <Label text="This is the second page" textWrap="true" horizontalAlignment="center" verticalAlignment="center"/>
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { topmost } from 'tns-core-modules/ui/frame';

  @Component({
    name: 'second',
  })
  export default class Second extends Vue {
    private navbarTitle: string = `Second.vue`;
    private originalPageId: string = ``;
    private checkCount: number = 0;
    private maxChecks: number = 10;
    private timerEnd!: number;
    private msWait: number = 50;
    private totalMSWait: number = 0;

    public created() {
      // set this to make sure backwards navigation through native API's will navigate the correct routeHistory
      if (this.$store.state.appMode === 'native') {
        // (this as any).$interceptGoBack();
        // console.log('Second.vue - created - currentPage - ', topmost().currentPage.toString())
      }
    }

    public mounted(){
      if (this.$store.state.appMode === 'native') {
        // // @ts-ignore
        // console.log("Second.vue - mounted - this.$refs.page.nativeView - " + this.$refs.page.nativeView.toString());
        // // @ts-ignore
        // this.originalPageId =  this.$refs.page.nativeView.toString();
        
        // @ts-ignore
        this.$emit('event', this.$refs.page.nativeView.toString());
      }
    }

    public check() {
      try {
        if (this.$store.state.appMode === 'native') {
          // if (topmost().currentPage === undefined  && this.checkCount <= this.maxChecks) {
          //   console.log('Second.vue - Page is UNDEFINED');
          //   // @ts-ignore
          //   clearInterval(this.timerEnd);
          //   return;
          // } else if (topmost().currentPage !== undefined && topmost().currentPage.toString() !== this.originalPageId) {
          //   console.log(`Second.vue - the current Page no longer equals the original Page so the original page has been garbage collected`);
          //   // @ts-ignore
          //   clearInterval(this.timerEnd);
          //   return;
          // } else if (topmost().currentPage !== undefined && this.checkCount > this.maxChecks) {
          //   console.log(`Second.vue - checkCount hit maxChecks = ${this.maxChecks}, but the Page is still there so we will exit`);
          //   // @ts-ignore
          //   clearInterval(this.timerEnd);
          //   return;       
          // } else {
          //   this.totalMSWait += this.msWait;
          //   console.log(`Second.vue - ${topmost().currentPage.toString()} is still there after ${this.checkCount} checks and ${this.totalMSWait} milliseconds`);
          //   // console.log(`we have checked ${this.checkCount} times`);
          //   this.checkCount++;
          //   return;
          // }
        }

      } catch (err) {
        console.log(err);
      }
    }
    public timer() {
      // @ts-ignore
      this.timerEnd = setInterval(this.check, this.msWait)
    }

    public beforeDestroy() {
      try {
        if (this.$store.state.appMode === 'native') {
          // console.log("beforeDestroy - this.$refs.page 1 - " + this.$refs.page);
          // // @ts-ignore
          // console.log("beforeDestroy - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
          // // @ts-ignore
          // console.log("beforeDestroy - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected.toString());
          // console.log("beforeDestroy - topmost().currentPage 1 - " + topmost().currentPage.toString());
        }
      } catch (err) {
        console.log(err);
      }
    }

    public destroyed() {
      try {
        if (this.$store.state.appMode === 'native') {
          // console.log("destroyed - this.$refs.page 1 - " + this.$refs.page.toString());
          // console.log("destroyed - topmost().currentPage 1 - " + topmost().currentPage.toString());

          // // check to see when the currentPage is garbage collected
          // this.timer();
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
