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
    <!-- <GridLayout>
      <Label text="This is the first page" textWrap="true" horizontalAlignment="center" verticalAlignment="center"/>
    </GridLayout> -->
    <Frame>
      <!-- <component v-bind:is="'one'" /> -->
      <!-- <DynamoFirstVueRouter /> -->
    </Frame>
  </Page>


</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  // import { releaseNativeObject } from 'tns-core-modules/utils/utils';
  // import router, { routes } from '../router';
  // import Dynamo from '../../../';
  // import store from '../store';
  // import DynamoOne from './Dynamo-One.vue'


      // Vue.prototype['$' + this.moduleName] = Dynamo.componentRouter( store, router, routes, 'FirstVueRouter' );
      // Vue.use( Dynamo, { appMode: store.state.appMode, moduleName: 'FirstVueRouter' } );

  @Component({
    name: 'first',
    // components: {
    //   dynamoFirstVueRouter: Dynamo
    // }
  })
  export default class First extends Vue {
    private navbarTitle: string = `First.vue`;
    public moduleName: string = 'FirstVueRouter';

    public created() {
      // const moduleName = 'firstVueRouter';
      // Vue.prototype['$' + this.moduleName] = Dynamo.componentRouter( this.$store, this.$router, routes, this.moduleName );
      // Vue.use( Dynamo, { appMode: this.$store.state.appMode, moduleName: this.moduleName } );
      //  Vue.use( Dynamo, { appMode: store.state.appMode, store, router, routes, moduleName: 'FirstVueRouter' } );

    }

    public mounted(){
      try {
        // const dfd = Dynamo.componentRouter( this.$store, this.$router, routes, this.moduleName );
        // Vue.use( Dynamo, { appMode: this.$store.state.appMode, moduleName: this.moduleName } );

      } catch(err) {
        throw err;
      }
      // // @ts-ignore
      // console.log("First.vue - mounted - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
    }

    public beforeDestroy() {
      try {
        Vue.prototype['$' + this.moduleName]();

    //     console.log("beforeDestroy - this.$refs.page 1 - " + this.$refs.page);
    //     // @ts-ignore
    //     console.log("beforeDestroy - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
    //     // @ts-ignore
    //     console.log("beforeDestroy - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected.toString());
    //     // @ts-ignore
    //     // use buit in NS function to destroy the native component
    //     releaseNativeObject(this.$refs.page.nativeView.nativeViewProtected);
    //     console.log("RELEASED!");
    //     console.log("beforeDestroy - this.$refs.page 2 - " + this.$refs.page);
    //     // @ts-ignore
    //     console.log("beforeDestroy - this.$refs.page.nativeView 2 - " + this.$refs.page.nativeView.toString());
    //     // @ts-ignore
    //     console.log("beforeDestroy - this.$refs.page.nativeView.nativeViewProtected 2 - " + this.$refs.page.nativeView.nativeViewProtected.toString());
      } catch (err) {
        console.log(err);
      }
    }

    // public destroyed() {
    //   try {
    //     console.log("destroyed - this.$refs.page 1 - " + this.$refs.page);
    //     // @ts-ignore
    //     console.log("destroyed - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView.toString());
    //     // @ts-ignore
    //     console.log("destroyed - this.$refs.page.nativeView.nativeViewProtected 1 - " + this.$refs.page.nativeView.nativeViewProtected.toString());
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
