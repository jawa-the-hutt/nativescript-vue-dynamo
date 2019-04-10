<template web>
  <div class="w-page">
    <component
      :is="computedCurrentRoute"
    />
    <router-view />
  </div>
</template>
<template native>
  <Dynamo />
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';


  @Component
  export default class App extends Vue {

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
