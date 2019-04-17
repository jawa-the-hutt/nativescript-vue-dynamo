# Nativescript-Vue-Dynamo

Nativescript-Vue-Dynamo is a dynamic component router implementation that is suitable for NativeScript-Vue.  Capabilities are included for using this with regular `Vue`, but has a lot of drawbacks over just using `Vue-router` as you normally would so please be aware of this.

It uses [Vue Dynamic Components](https://vuejs.org/v2/guide/components-dynamic-async.html) to simulate the normal navigation patterns of a `Nativescript-Vue` app.  It does this by plugging into `Vue-Router` and `Vuex`.  This implementation also supports "Child Routes" by using the same Dynamic Component behavior, in a nested manner, to allow you to navigate within the parent/child routes.

**To be clear**: we are not actually using the underlying mechanics of `Vue-Router` to navigate through the app as this has been problematic issue when trying to use `Nativescript-Vue` historically.  However, we are doing things like plugging into the main Route Config as a common shared configuration and then using a `router.afterEach` hook to update the route history that we are keeping in the state manager.  When the route history state changes, the dynamic components will cause the app to load a new route or Page.  This effectively mimcs normal navigation patterns.

**A further point must be made**:  we are also not using the underlying mechanics of `Nativescript-Vue` to navigate.  There is no `$navigateTo` or `$navigateBack` going on. Thus, we keep something similar to Nativescript's navigation stack inside of our state manager so that we can track forwards and backwards movement as needed.

This project takes many of the same ideas in [Vuex-Router-Sync](https://github.com/vuejs/vuex-router-sync) and [Nativescript-Vue-Navigator](https://github.com/nativescript-vue/nativescript-vue-navigator) and combines them in a way that simulates the traditional routing experience withing a `Nativescript-Vue` app.

## Quick Start

```shell
npm install --save nativescript-vue-dynamo
```

Inside your `main.js` (`main.native.js` if you are using the [Nativescript-Vue Plugin for vue-cli@3.0](https://github.com/nativescript-vue/vue-cli-plugin-nativescript-vue)), please note the `appMode` option being sent to the component.  If you want to use this on the native side, then `appMode` should = `native` or you can just leave it `undefined` and it will default to `native`.  If you want to use it on the web side it should = `web`. 

`native` and `web` are the standards established in the `Nativescript-Vue` CLI Plugin for vue-cli@3.0 mentioned above.  In the example below we are showing the `appMode` value coming from the state manager, but that's just an easy convention used in the demo app included in this repository.  

## Main entry point (main.js or main.native.js)

```js
import Vue from 'nativescript-vue';
import App from './App.vue';
import store from './store';
import router, { routes } from './router';

import Dynamo from 'nativescript-vue-dynamo';
Vue.use( Dynamo, {
  appMode: store.state.appMode,
  store,
  router,
  routes,
});
```

If `appMode` = `native`, then the underlying component is injecting the following:

```html
<template>
  <Frame :id="routeHistoryName">
    <StackLayout>
      <component v-bind:is="computedCurrentRoute" />
    </StackLayout>
  </Frame>
</template>
```

If `appMode` = `web`, then the underlying component is injecting the following:

```html
<template>
  <div :id="routeHistoryName">
    <component v-bind:is="computedCurrentRoute" />
  </div>
</template>
```

## Vue-Router Config

Inside or your `Vue-Router` config, you will want to split out your route config into it's own array as modeled below. You can then use many of the extra options provided by `Vue-Router` out of the box such as adding the `meta` object.  Most built in router hooks should be available to help assist you as well.

```js
export const routes = [
  {
    name: 'home',
    path: '/home',
    component: () => import(/* webpackChunkName: "home" */ '~/views/Home'),
    meta: {
      title: 'Home',
      auth: true,
    },
  },
  {
    name: 'login',
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '~/views/Login'),
    meta: {
      title: 'Login',
      auth: false
    },
  }
]
```

## App.vue

Inside of your App.vue, you can do something simple as below.  Notice we are sending a `defaultRoute` into the component.  This will make sure that the first page loaded is the one specified by this value.  It must also match an actual route in your router config.  We are also sending a `routeHistoryName` into the component.  This name will end up being the `id` of the `frame/div` loaded and will also be used to track via state manager which `frame/div` we are navigating within.  These two options are **mandatory** for this package to work correctly.

```html
<template>
  <Page actionBarHidden="true">
    <Dynamo
      :routeHistoryName="'main'"
      :defaultRoute="'home'"
    />
  </Page>
</template>
```

Inside of `App.vue`, you could even provide your own wrapper around the `Dynamo` component.  This could be a `StackLayout` or any of the other layout components such as `GridLayout`.  Just be aware that any alternative layout items will not be replaced when the `Dynamo` component updates itself.  This might be useful if you want a bottom navigation button area and then have the buttons selected switch out the item in the first row of the Grid:

```html
<template>
  <Page actionBarHidden="true">
    <GridLayout row="*, auto, auto, auto">
      <Dynamo
        :routeHistoryName="'main'"
        :defaultRoute="defaultRoute"
        row="0"
      />
      <Button text="First" @tap="$goTo('first', 'main')" row="1" />
      <Button text="Second" @tap="$goTo({ name: 'second', params: { routeHistoryName: 'main'}})" row="2" />
      <Button text="Logout" @tap="shared.$logout" row="3" />
    </GridLayout>
  </Page>
</template>
```

## Navigating

Because we are plugging into `Vue-Router`, many of the same programmatic navigation aides available there should be usable within `Nativescript-Vue`.  So things like `route.push()` and `route.back()` should work.  Others may not and if you find something that is not working, please submit an issue.

In the example above, we are providing two different ways to route within the `$goTo` navigation aide.  Refer to the Navigation Aides section below for more information about this function.
The first passes straight parameters and the second passes an object that should look similiar to something you pass for a `route.push` with `vue-router`. The second parameter is the `routeHistoryName` in the first example and in the second, we explicitly list it out as a `params` item.  The `routeHistoryName` parameter is required and is used in the same way as the parameter in the `Dynamo` component shown earlier.  We have to be able to track where we are within the app at any given time and if you don't supply it, this package will not work.

### Child routes

You can use "child route" like features as well.  You will build out your child route config as you normally would with `Vue-Router`.  Within the "parent" component, you will have to add some additional configuration options as shown in the example below.  Notice the `routeHistoryName` is different than it was previously, but we now added a `parentRouteHistoryName` parameter and it is set to what was previouly the `routeHistoryName`.  This effecively activates the parent/child relationship between components and mimics many of the parent/child functions of `Vue-Router`.

```html
<template>
  <Page>
    <ActionBar :title="navbarTitle" />
    <Dynamo
      :routeHistoryName="'first'"
      :defaultRoute="'dynamo-one'"
      :parentRouteHistoryName="'main'"
    />
  </Page>
</template>
```

You can also provide an option of simulating Nativescript's built in `clearHistory` navigation option.  You can provide a route parameter named `clearHistory` and this will reset the route history state for the corrosponding `routeHistoryName`.

For example, given you are on a Login page, and successfully log in you would navigate to the Home page with

```js
$router.push({ name: 'home', params: { routeHistoryName: 'main', clearHistory: 'true'}})
```

or 

```js
$goTo('home', 'main', 'true')
```

Note that we used `clearHistory: true` to prevent the back button from going back to the login page.

## Optional Navigation Aides

This package is also providing some additional Navigation Aides via `Vue.prototype` that will help assist you navigating within your app.

1. `$goTo(location, routeHistoryName, parentRouteHistoryName?, clearHistory?, onComplete?, onAbort?)`

    Parameter | Type | Required | Purpose
    ------------ |:-------------:|:-------------:| -------------
    location | string or Location | X | Where you want to go.  If this is a string, then it will navigate to that route.  If it is a `vue-router` Location Object, then it will take the included options into account when navigating.
    routeHistoryName | string | X | the `frame/div` you want to route to.
    parentRouteHistoryName | string |  | the parent `frame/div` of the `routeHistoryName`.  Will default to the value in `routeHistoryName`
    clearHistory | string |  | clear the navigation history being kept in the state manager.  Will default to `false`
    onComplete | Function | | Callback to be called when the navigation successfully completes (after all async hooks are resolved).
    onAbort | Error Handler | | Callback for when the navigation is aborted (navigated to the same route, or to a different route before current navigation has finished)

    For convience we are constructing a [router.push](https://router.vuejs.org/guide/essentials/navigation.html) behind the scenes. We did this as a matter of convience since we are adding a required route parameter as well as some optional route parameters to help us track navigation.  You could just as easily still use `router.push` if you want as seen in the Login example above.  
2. `$goBack(routeHistoryName)` - Just provide the name of the route level you want to navigate back within and it will take care of ensuring you can.  It will check to see if you are navigating back to a sibling route, or going backwards to a parent route.  It will also check to see if this is the last page left in the frame and if there is a parent route, it will transition to it.
3. `$goBackToParent(routeHistoryName, parentRouteHistoryName)` -  Provide the child `routeHistoryName` and the `parentRouteHistoryName` and it will navigate back up the route tree.

## Event Handling and Refs

The `Dynamo` component is acting as a "middle-man" between the components you are concerned with. Thus, the relationship looks something like this Parent -> Child(Dynamo) -> Grandchild.  This means you won't be able to handle events or use [refs](https://vuejs.org/v2/guide/components-edge-cases.html#Accessing-Child-Component-Instances-amp-Child-Elements) to call functions on the grandchild as you normally would. Because of this, we have provided a way to handle both of these common patterns.

#### Event Handling

When you call the Dynamo component, you can add an additional parameter that has a very specific way of referencing it whereby it must include the `routeHistoryName` within it.  Notice that with the `v-on` we are including `first` as the first string in the kebab case name.  The pattern you will need to use is "`routeHistoryName` + `-event-handler`".  This lets `Dynamo` know which parent component to bubble the event up to.

```html
<Dynamo
  :routeHistoryName="'first'"
  :parentRouteHistoryName="'main'"
  :defaultRoute="'dynamo-one'"
  v-on:first-event-handler="eventHandler"
  :functionHandler="functionHandler"
/>
```

Then inside your parent component you can include a function similar to this:

```js
public eventHandler(e){
  console.log('first.vue - eventHandler - ', e);
}
```

Inside your grandchild component you can then emit an event as you normally would: `this.$emit('dynamo-event', "emit event one");`.  Notice the event name is `dynamo-event`.  This is the required event name as it is hard coded into the `Dynamo` component.

In theory, you can use this single event handler to do multiple things in the parent component via something like a `switch` statement, or even get more advanced and pass an object back up through the event and convert it into calling a method somewhere else.  Here's an example object:  `{ function: 'anotherMethod', data: 'data' }` and then within your eventHandler function you could do something like below and it would automatically call your `anotherMethod` method and pass it the `data`:

```js
public eventHandler(e){
  this[e.function](e.data)
}
```

#### Refs & calling grandchild functions

 In your `Dynamo` component you can include an option named `functionHandler` and then have it reference a property in your parent component. In reality what we are doing is passing a Prop to the `Dynamo` component which in turn is passing that Prop down to the grandchild component.

 For the sake of convienence, we've named the function `functionHandler` in the example below.

```html
<Dynamo
  :routeHistoryName="'first'"
  :parentRouteHistoryName="'main'"
  :defaultRoute="'dynamo-one'"
  v-on:first-event-handler="eventHandler"
  :functionHandler="functionHandler"
/>
```

Then you could do something like below inside your `script` tag's export.  The `parentButton` method is just a convience provided in the example that is called after a button click.  In turn, the `parentButton` method replaces the value of `this.functionHandler`.  The object provided works much like the eventHandler example above, but in reverse.  It references a method to call on the grandchild: `parentToChild` and some data to pass to the grandchild's method.

```js
public functionHandler: object = {};

public parentButton() {
  console.log('parentButton clicked');
  this.functionHandler = { method: 'parentToChild', data: 'hello there' };
}
```

Then inside your grandchild component you could do something like below.  Notice we've setup the `Prop` but also setup a `watcher`.  This allows us to use this single `Prop` to act as a gateway to calling multiple methods in the grandchild component.  Think of it as a `one-to-many` relationship.  Inside the `watcher` we've included an example where we dynamically call other methods.  

In the example above, we are passing in `parentToChild` as the method to call with the data of `hello there`.  This means in the example below, we will write the following to the console: `parentToChild - hello there`.  Also notice we've included an example of emitting an event back up as well.  This is optional and is not necessary.

```js
@Prop() functionHandler: object = {};
@Watch('functionHandler')
onfunctionHandlerChanged(val: Function) {
  this[val.method](val.data);
}

public parentToChild(data: string) {
  console.log('parentToChild - ', data);
  this.$emit('dynamo-event', "emit event two from parentToChild function");
}
```

## Demo project

Take a look at the demo project for a simplistic project that implements this plugin with many of the examples discussed above.  Notice within the `utils/global-mixin-native` class file there is an example of intercepting the Android back button behavior and then plugging into the `$goBack` navigation aide.