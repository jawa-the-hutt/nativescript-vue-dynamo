<template web>
  <div class="w-page">
    <div class="w-container">
      <router-link id="dynamoTwoButton" tag="button" class="w-button" :to="{ path: '/dynamo-two' }">Dynamo Two</router-link>
    </div>
  </div>
</template>
<template native>
  <Page actionBarHidden="true">
    <GridLayout rows="auto">
      <Button text="Dynamo Two" @tap="$goTo('dynamo-two')" row="0" />
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

  @Component({
    name: 'dynamo-one',
  })
  export default class DynamoOne extends Vue {

    @Prop() functionHandler!: object | Function;
    @Watch('functionHandler')
    onfunctionHandlerChanged(val: Function) { 
      // @ts-ignore
      this[val.method](val.data);
    }
    public created() {
      if (this.$store.state.appMode === 'native') {
        // set this to make sure backwards navigation through native API's will navigate the correct routeHistory
        (this as any).$interceptGoBack();  
      }
    }

    public mounted() {
      this.$emit('dynamo-event', "emit event one ");

    }

    public parentToChild(data: string) {
      console.log('parentToChild - ', data);
      this.$emit('dynamo-event', "emit  event two from parentToChild function");
    }


  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~styles/style-two';
  @import '~styles/style-one';
</style>
