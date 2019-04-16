<template web>
  <div class="w-page">
    <div class="w-container">
      <router-link id="loginButton" tag="button" class="w-button" to="{ name: login, params: { routeHistoryName: 'main'}}">Login</router-link>
      <!-- <button id="loginButton" class="w-button" @click="shared.$login">Login</button> -->
    </div>
  </div>
</template>
<template native>
  <Page actionBarHidden="true">
    <GridLayout rows="auto">
      <Button text="Login" @tap="shared.$login('main')" row="0"/>
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    name: 'login',
  })
  export default class About extends Vue {

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
  @import '~styles/style-two';
  @import '~styles/style-one';
</style>
