# Nativescript-Vue-Dynamo

Nativescript-Vue-Dynamo is a dynamic component router implementation that is suitable for NativeScript-Vue.  Capabilities are included for using this with regular `Vue`, but has a lot of drawbacks over just using `Vue-router` as you normally would so please be aware of this.

It uses [Vue Dynamic Components](https://vuejs.org/v2/guide/components-dynamic-async.html) to simulate the normal navigation patterns of a `Nativescript-Vue` app.  It does this by plugging into `Vue-Router` and `Vuex`.  This implementation also supports "Child Routes" but using the same Dynamic Component behavior to allow you to next routes.

**To be clear**: we are not actually using the underlying mechanics of `Vue-Router` to navigate through the app as this has been problematic issue when trying to use `Nativescript-Vue` historically.  However, we are doing things like plugging into the main Route Config as a common shared configuration and then using a `router.afterEach` hook to update the route history that we are keeping in the `Vuex` state.  When the route history state changes, the dynamic components will cause the app to load a new route or Page.  This effectively mimcs normal navigation patterns.

**A further point must be made**:  we are not using the underlying mechanics of `Nativescript-Vue` to navigate.  There is no `$navigateTo` or `$navigateBack` going on. Thus, we keep something similar to Nativescript's navigation stack inside of our state manager `vuex` so that we can track forwards and backwards movement as needed.  We are also using multiple frames to help us keep track of where we are in the app.

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
      <Button text="First" @tap="$router.push({ name: 'first', params: { routeHistoryName: 'main'}})" row="1" />
      <Button text="Second" @tap="$router.push({ name: 'second', params: { routeHistoryName: 'main'}})" row="2" />
      <Button text="Logout" @tap="shared.$logout" row="3" />
    </GridLayout>
  </Page>
</template>
```

## Navigating

Because we are plugging into `Vue-Router`, many of the same programmatic navigation aides available there should be usable within `Nativescript-Vue`.  So things like `route.push()` and `route.back()` should work.  Others may not and if you find something that is not working, please submit an issue.

In the example above, we are providing a route parameter named `routeHistoryName`.  This parameter is required and is used in the same way as the component parameter shown earlier.  We need to be able to track where we are within the app at any given time and if you don't supply it, this package will not work.

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
router.push({ name: 'home', params: { routeHistoryName: 'main', clearHistory: 'true'}})
```

Note that we used `clearHistory: true` to prevent the back button from going back to the login page.

## Optional Navigation Aides

This package is also providing some additional Navigation Aides via `Vue.prototype` that will help assist you navigating within your app.

1. `$goBack(routeHistoryName)` - Just provide the name of the route level you want to navigate back within and it will take care of ensuring you can.  It will check to see if you are navigating back to a sibling route, or going backwards to a parent route.  It will also check to see if this is the last page left in the frame and if there is a parent route, it will transition to it.
2. `$goBackToParent(routeHistoryName, parentRouteHistoryName)` -  Provide the child `routeHistoryName` and the `parentRouteHistoryName` and it will navigate back up the route tree.

### Demo project

Take a look at the demo project for a simplistic project that implements this plugin.  Notice within the `utils/global-mixin-native` class file there is an example of intercepting the Android back button behavior and then plugging into the `$goBack` navigation aide.