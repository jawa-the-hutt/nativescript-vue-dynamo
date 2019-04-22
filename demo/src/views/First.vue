<template web>
  <div class="w-page">
    <div class="w-container">
      <span>This is the first page</span>
      <button id="parentButton" class="w-button" @click="parentButton">Parent</button>
      <router-view 
        :function-handler="functionHandler"
        @dynamo-event="eventHandler"
      />
    </div>
  </div>
</template>
<template native>
  <Page>
    <ActionBar :title="navbarTitle">
      <NavigationButton text="Go Back" android.systemIcon="ic_menu_back" @tap="$goBack()"/>
    </ActionBar>
    <GridLayout rows="auto, *">
      <Button text="Parent" @tap="parentButton" row="0" />
      <Dynamo
        :routeHistoryName="'first'"
        :defaultRoute="'dynamo-one'"
        :appMode="$store.state.appMode"
        :functionHandler="functionHandler"
        @first-event-handler="eventHandler"
        row="1"
      />
    </GridLayout>    
      
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    name: 'first'
  })
  export default class First extends Vue {
    private navbarTitle: string = `First.vue`;
    public functionHandler: object = {};
    public eventName: string = '';

    public created() {
      if (this.$store.state.appMode === 'native') {
        this.eventName = 'firstEventHandler';
        // set this to make sure backwards navigation through native API's will navigate the correct routeHistory
        (this as any).$interceptGoBack();  
      } else {
        this.eventName = 'firstEventHandler';
      }
    }

    public parentButton() {
      console.log('parentButton clicked ');
      this.functionHandler = { method: 'parentToChild', data: 'hello there' };
    }

    public eventHandler(e){
      console.log('first.vue - eventHandler  - ', e);
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '~styles/style-two';
  @import '~styles/style-one';
</style>
