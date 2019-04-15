<template web>
  <div class="w-page">
    <nav>
      <ul class="w-navbar">
        <li class="w-title">{{ navbarTitle }}</li>
      </ul>
    </nav>
    <div class="w-container">
      <!-- <router-link id="firstButton" tag="button" class="w-button" to="{ name: first, params: { routeHistoryName: 'ComponentRouter'}}">First</router-link>
      <router-link id="secondButton" tag="button" class="w-button" to="{ name: second, params: { routeHistoryName: 'ComponentRouter'}}">Second</router-link> -->
      <!-- alternate way to route manually and use the same method as native -->
      <button id="logoutButton" class="w-button" @click="shared.$logout('main')">Logout</button>
      <router-view />
    </div>
  </div>
</template>
<template native>
  <Page ref="page">
    <ActionBar :title="navbarTitle"/>
    <GridLayout rows="auto, auto, auto">
      <Button text="First" @tap="$router.push({ name: 'first', params: { routeHistoryName: 'main'}})" row="0" /> 
      <Button text="Second" @tap="$router.push({ name: 'second', params: { routeHistoryName: 'main'}})" row="1" />
      <Button text="Logout" @tap="shared.$logout('main')" row="2" />
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { topmost } from 'tns-core-modules/ui/frame';

  @Component({
    name: 'home'
  })
  export default class Home extends Vue {
    private navbarTitle: string = `Home.vue`;
    // @ts-ignore
    private page: string = '';



    public created() {
      // set this to make sure backwards navigation through native API's will navigate the correct routeHistory
      if (this.$store.state.appMode === 'native') {
        // if (topmost()) {
        //     console.log('home.vue - created - topmost() - ', topmost())
        //   if (topmost() && topmost().currentPage ) {
        //     console.log('home.vue - created - currentPage - ', topmost().currentPage)
        //   }
        // }
        // // @ts-ignore
        // if (this.$el) {
        //   console.log('home.vue - created - this.$el is there')
        //   // @ts-ignore
        //   if (this.$el._nativeView) {
        //     // @ts-ignore
        //     console.log('home.vue - created - this.$el._nativeView.toString() - ', this.$el._nativeView.toString())
        //   }
        // }
        // // @ts-ignore
        // console.log('this.$refs.page.nativeView - ' + this.$refs.page.nativeView)
      }
    }

    public mounted() {
      // set this to make sure backwards navigation through native API's will navigate the correct routeHistory
      if (this.$store.state.appMode === 'native') {
        (this as any).$interceptGoBack('main');  
        
        // @ts-ignore
        this.page = this.$refs.page.nativeView.toString();
        // console.log("Home.vue - mounted - this.$parent - ", this.$parent)
        console.log("Home.vue - mounted - this.$refs.page.nativeView 1 - ", this.page );
        // console.log("Home.vue - mounted - this.$router.currentRoute.fullPath - ", this.$router.currentRoute.fullPath );

        this.$emit('event', this.page);

        // @ts-ignore
        //console.log('this.$refs.page.nativeView - ' + this.$refs.page.nativeView)
        // @ts-ignore
        // if (this.$el) {
        //   console.log('home.vue - created - this.$el is there')
        //   // @ts-ignore
        //   if (this.$el._nativeView) {
        //     // @ts-ignore
        //     console.log('home.vue - created - this.$el._nativeView.toString() - ', this.$el._nativeView.toString())
        //   }
        // }
      }
    }

    // public mounted(){
    //   if (this.$store.state.appMode === 'native') {
    //     // // @ts-ignore
    //     // console.log("Home.vue - mounted - this.$refs.page.nativeView - " + this.$refs.page.nativeView);

    //     // // @ts-ignore
    //     // this.$store.dispatch('updateOriginalHomePageId',  this.$refs.page.nativeView.toString() );
    //     // console.log("Home.vue - mounted - original Home.vue Page Id - " + this.originalHomePageId);

    //     // // @ts-ignore
    //     // if (this.$refs.page.nativeView.toString() === this.originalHomePageId ) {
    //     //   console.log("Home.vue - mounted - original Home.vue Page Id is the same as the current Home.vue Page");
    //     // } else {
    //     //   console.log("Home.vue - mounted - original Home.vue Page Id is NOT the same as the current Home.vue Page Id");
    //     // }
    //   }
    // }

    // public get originalHomePageId () {
    //   if (this.$store.state.appMode === 'native') {
    //     return this.$store.getters.getOriginalHomePageId;
    //   }
    // }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~styles/style-one';
</style>
