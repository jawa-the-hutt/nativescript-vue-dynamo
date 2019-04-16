<template web>
  <div class="w-page">
    <div class="w-container">
      <span>This is the second page</span>
    </div>
  </div>
</template>
<template native>
  <Page>
    <ActionBar :title="navbarTitle" />
    <GridLayout>
      <Label text="This is the second page" textWrap="true" horizontalAlignment="center" verticalAlignment="center"/>
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    name: 'second',
  })
  export default class Second extends Vue {
    private navbarTitle: string = `Second.vue`;

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
