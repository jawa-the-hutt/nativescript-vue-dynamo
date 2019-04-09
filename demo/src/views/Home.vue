<template web>
  <div class="w-page">
    <nav>
      <ul class="w-navbar">
        <li class="w-title">{{ navbarTitle }}</li>
      </ul>
    </nav>
    <div class="w-container">
      <router-link id="firstButton" tag="button" class="w-button" to="first">First</router-link>
      <router-link id="secondButton" tag="button" class="w-button" to="second">Second</router-link>
      <!-- alternate way to route manually and use the same method as native -->
      <button id="logoutButton" class="w-button" @click="shared.$logout">Logout</button>
      <router-view />
    </div>
  </div>
</template>
<template native>
  <Page ref="page">
    <ActionBar :title="navbarTitle"/>
    <GridLayout rows="auto, auto, auto">
      <!-- <Button text="First" @tap="shared.$goTo('first')" row="0" />
      <Button text="Second" @tap="shared.$goTo('second')" row="1" /> -->
      <Button text="First" @tap="$router.push('first')" row="0" />
      <Button text="Second" @tap="$router.push('second')" row="1" />
      <Button text="Logout" @tap="shared.$logout" row="2" />
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  // import { topmost } from 'tns-core-modules/ui/frame';
  // @ts-ignore
  // import Second from "./Second";

  @Component({
    name: 'home'
  })
  export default class Home extends Vue {
    private navbarTitle: string = `Home.vue`;

    // public created() {
    //   (this as any).$BackButton();
    // }

    // public mounted(){
    //   // console.log('Home.vue - mounted - topmost().currentPage = ', topmost().currentPage);
    //   console.log("Home.vue - mounted - this.$refs.page.nativeView 1 - " + this.$refs.page.nativeView);
    // }

    // public goTo(route: string) {
    //   // @ts-ignore
    //   this.$router.push(route)
    // }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~styles/style-one';
</style>
