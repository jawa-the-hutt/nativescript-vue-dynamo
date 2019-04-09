# Nativescript-Vue-Dynamo

Nativescript-Vue-Dynamo is a dynamic component router implementation that is suitable for NativeScript-Vue and Vue.
It uses a single top level [Vue Dynamic Component](https://vuejs.org/v2/guide/components-dynamic-async.html) to simulate the normal navigation patterns of a Nativescript-Vue app.  It does this by plugging into `Vue-Router` and `Vuex`.

To be clear: we are not actually using the underlying mechanics of `Vue-Router` to navigate through the app, but we are plugging into the main Route Config as a common shared configuration and then using a `router.afterEach` hook to update the route history that we are keeping in the `Vuex` state.  When the route history state changes, the dynamic component will cause the app to load a new route or Page.

This project takes many of the same ideas in [Vuex-Router-Sync](https://github.com/vuejs/vuex-router-sync) and [Nativescript-Vue-Navigator](https://github.com/nativescript-vue/nativescript-vue-navigator) and combines them in a way that simulates the traditional routing experience withing a Nativescript-Vue app.

## Quick Start

```
npm install --save nativescript-vue-dynamo
```

Inside your `main.js` or `main.native.js` if you are using the [Nativescript-Vue Plugin for vue-cli@3.0](https://github.com/nativescript-vue/vue-cli-plugin-nativescript-vue).

```js
import Vue from 'nativescript-vue';
import App from './App.vue';
import store from './store';
import router, { routes } from './router';

import Dynamo, { componentRouter } from '../../';
componentRouter( store, router, routes );
Vue.use( Dynamo, { appMode: store.state.appMode } );
```

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

Inside of your App.vue,  you can do something simple like this:
```html
<template>
  <Dynamo />
</template>
```

## Navigating

Because we are pluggin into `Vue-Router` many of the same programattic navigation aides available there should be usable within `Nativescript-Vue`.  So things like `route.push()` and `route.back()` should work.  Others may not and if you find something that is not working, please submit an issue.

There is even the option of simulating Nativescript's built in `clearHistory` navigation option.  You can provide a route parameter named `clearHistory` and this will reset the route history state.
 
For example, given you are on a Login page, and successfully log in you would navigate to the Home page with
```js
router.push({ name: 'home', params: { clearHistory: 'true'}})
```
Note that we used `clearHistory: true` to prevent the back button from going back to the login page.

### Demo project
Take a look at the demo project for a simplistic project that implements this plugin.