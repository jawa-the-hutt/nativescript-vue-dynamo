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
      <Button text="First" @tap="$router.push({ name: 'first', params: { moduleName: 'ComponentRouter'}})" row="0" />
      <Button text="Second" @tap="$router.push({ name: 'second', params: { moduleName: 'ComponentRouter'}})" row="1" />
      <Button text="Logout" @tap="shared.$logout" row="2" />
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    name: 'home'
  })
  export default class Home extends Vue {
    private navbarTitle: string = `Home.vue`;

    public mounted(){
      // @ts-ignore
      console.log("Home.vue - mounted - this.$refs.page.nativeView - " + this.$refs.page.nativeView);
      // @ts-ignore
      this.$store.dispatch('updateOriginalHomePageId',  this.$refs.page.nativeView.toString() );
      console.log("Home.vue - mounted - original Home.vue Page Id - " + this.originalHomePageId);

      // @ts-ignore
      if (this.$refs.page.nativeView.toString() === this.originalHomePageId ) {
        console.log("Home.vue - mounted - original Home.vue Page Id is the same as the current Home.vue Page");
      } else {
        console.log("Home.vue - mounted - original Home.vue Page Id is NOT the same as the current Home.vue Page Id");
      }
    }

    public get originalHomePageId () {
      return this.$store.getters.getOriginalHomePageId;
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~styles/style-one';
</style>
