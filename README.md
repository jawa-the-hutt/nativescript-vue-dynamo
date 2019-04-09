# Nativescript-Vue-Dynamo

Nativescript-Vue-Dynamo is a dynamic component router implementation that is suitable for NativeScript-Vue and Vue.
It uses a single top level [Vue Dynamic Component](https://vuejs.org/v2/guide/components-dynamic-async.html) to simulate the normal navigation patterns of a Nativescript-Vue app.  It does this by plugging into `Vue-Router` and `Vuex`.

To be clear: we are not actually using the underlying mechanics of `Vue-Router` to navigate through the app, but we are plugging into the main Route Config as a common shared configuration and then using a `router.afterEach` hook to update the route history that we are keeping in the `Vuex` state.  When the route history state changes, the dynamic component will cause the app to load a new route or Page.

A further point must be made:  we are not using the underlying mechanics of Nativescript-Vue to navigate.  There is no `$navigateTo` or `$navigateBack` going on.  In essence, there is only ever one entry in navigation stack as Vue is building and tearing down the page each time so nothing is added to it.  This is why we keep something similar in `vuex` so that we can track forwards and backwards movement as needed.

This project takes many of the same ideas in [Vuex-Router-Sync](https://github.com/vuejs/vuex-router-sync) and [Nativescript-Vue-Navigator](https://github.com/nativescript-vue/nativescript-vue-navigator) and combines them in a way that simulates the traditional routing experience withing a Nativescript-Vue app.

## Quick Start

```shell
npm install --save nativescript-vue-dynamo
```

Inside your `main.js` or `main.native.js` if you are using the [Nativescript-Vue Plugin for vue-cli@3.0](https://github.com/nativescript-vue/vue-cli-plugin-nativescript-vue).  Please note the `appMode` option being sent to the component.  If you want to use this on the native side, then `appMode` should = `native` and on the web side it should = `web`.  These are this standards established in the Nativescript-Vue Plugin for vue-cli@3.0 mentioned above.  In the example below we are showing this coming from the state manager, but that's an artifact of the demo app included in this repository where we are storing the value.  

## Main entry point (main.js or main.native.js)

```js
import Vue from 'nativescript-vue';
import App from './App.vue';
import store from './store';
import router, { routes } from './router';

import Dynamo, { componentRouter } from '../../';
componentRouter( store, router, routes );
Vue.use( Dynamo, { appMode: store.state.appMode } );
```

If `appMode` = `native`, then the underlying component is injecting the following:

```html
<template>
  <StackLayout>
    <component v-bind:is="computedCurrentRoute" />
  </StackLayout>
</template>
```

If `appMode` = `web`, then the underlying component is injecting the following:

```html
<template>
  <div>
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

Inside of your App.vue,  you can do something simple like this:

```html
<template>
  <Dynamo />
</template>
```

Regarding the `appMode` discussion earlier:  If you do not supply anything for `appMode`, then we don't provide the `StackLayout` or `div` wrapper at all and it injects the following:

```html
<template>
    <component v-bind:is="computedCurrentRoute" />
</template>
```

Then inside of `App.vue`, you would then need to provide your own wrapper.  This could still be a `StackLayout` or any of the other layout components such as `GridLayout`.  Just be aware that any alternative layout items will not be replaced when the `Dynamo` component updates itself.  This might be useful if you want a bottom navigation button area and then have the buttons selected switch out the item in the first row of the Grid:

```html
<template>
  <GridLayout row="*, auto, auto, auto">
    <Dynamo row="0"/>
    <Button text="First" @tap="$router.push('first')" row="0" />
    <Button text="Second" @tap="$router.push('second')" row="1" />
    <Button text="Logout" @tap="shared.$logout" row="2" />
  </GridLayout>
</template>
```

## Navigating

Because we are plugging into `Vue-Router` many of the same programmatic navigation aides available there should be usable within `Nativescript-Vue`.  So things like `route.push()` and `route.back()` should work.  Others may not and if you find something that is not working, please submit an issue.

There is even the option of simulating Nativescript's built in `clearHistory` navigation option.  You can provide a route parameter named `clearHistory` and this will reset the route history state.

For example, given you are on a Login page, and successfully log in you would navigate to the Home page with

```js
router.push({ name: 'home', params: { clearHistory: 'true'}})
```

Note that we used `clearHistory: true` to prevent the back button from going back to the login page.

### Demo project

Take a look at the demo project for a simplistic project that implements this plugin.