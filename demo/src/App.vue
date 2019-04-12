<template web>
  <div class="w-page">
    <!-- <component
      :is="isLoggedIn === true ? 'home' : 'login'"
    /> -->
    <DynamoComponentRouter />
    <!-- <router-view /> -->
    <!-- <home /> -->
  </div>
</template>
<template native>
  <DynamoComponentRouter />
</template>
<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  // import Home from './views/Home.vue';
  // import Login from './views/Login.vue';


  @Component({
    // components: {
    //   'home': Home,
    //   'login': Login,
    // }
  })
  export default class App extends Vue {
    @Prop({default: false}) public isLoggedIn!: boolean;
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style web lang="scss">
  @import '~styles/style-one';

  .w-page {
    height: 100%;
    width: 100%;
  }

</style>
<style native lang="scss">
  @import '~styles/style-one';
</style>
