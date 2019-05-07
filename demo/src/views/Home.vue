<template web>
  <div class="w-page">
    <nav>
      <ul class="w-navbar">
        <li class="w-title">{{ navbarTitle }}</li>
      </ul>
    </nav>
    <div class="w-container">
      <router-link id="firstButton" tag="button" class="w-button" :to="{ path: '/first' }">First</router-link>
      <router-link id="secondButton" tag="button" class="w-button" to="/second">Second</router-link>
      <!-- alternate way to route manually and use the same method as native -->
      <button id="logoutButton" class="w-button" @click="$logout('main')">Logout</button>
      <router-view />
    </div>
  </div>
</template>
<template native>
  <Page>
    <ActionBar :title="navbarTitle">
      <NavigationButton visibility="collapsed" />
    </ActionBar>
    <GridLayout rows="auto, auto, auto">
      <Button text="First" @tap="$goTo({ path: '/first'})" row="0" /> 
      <Button text="Second" @tap="$goTo({ name: 'second', params: { msg: 'Hello, this is a prop' }})" row="1" />
      <Button text="Logout" @tap="$logout('main')" row="2" />
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

    public created() {
      if (this.$store.state.appMode === 'native') {
        // set this to make sure backwards navigation through native API's will navigate the correct routeHistory
        (this as any).$interceptGoBack();  
      }
    }

  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~styles/style-one';
</style>
