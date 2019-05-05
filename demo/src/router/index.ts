import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

Vue.use(Router);

export const routes: RouteConfig[] = [
  // otherwise redirect to login
  { path: '*', redirect: '/login' },
  {
    name: 'home',
    path: '/home',
    // @ts-ignore
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "home" */ '~/views/Home'),
    meta: {
      title: 'Home',
      auth: true,
      routeHistoryName: 'main',
    },
  },
  {
    name: 'login',
    path: '/login',
    // @ts-ignore
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "login" */ '~/views/Login'),
    meta: {
      title: 'Login',
      auth: false,
      routeHistoryName: 'main',
    },
  },
  {
    name: '/',
    path: '/first',
    alias: 'first',
    // @ts-ignore
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "first" */ '~/views/First'),
    props: true,
    meta: {
      title: 'First',
      auth: true,
      routeHistoryName: 'main',
    },
    children: [
      {
        name: 'dynamo-one',
        alias: '/',
        path: '/dynamo-one',
        // @ts-ignore
        // eslint-disable-next-line
        component: () => import(/* webpackChunkName: "dynamo-one" */ '~/views/Dynamo-One'),
        meta: {
          title: 'Dynamo One',
          auth: true,
          routeHistoryName: 'first',
          parentRouteHistoryName: 'main',
        },
      },
      {
        name: 'dynamo-two',
        path: '/dynamo-two',
        // @ts-ignore
        // eslint-disable-next-line
        component: () => import(/* webpackChunkName: "dynamo-two" */ '~/views/Dynamo-Two'),
        meta: {
          title: 'Dynamo Two',
          auth: true,
          routeHistoryName: 'first',
          parentRouteHistoryName: 'main',
        },
      },
    ],
  },
  {
    name: 'second',
    path: '/second',
    // @ts-ignore
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "second" */ '~/views/Second'),
    props: true,
    meta: {
      title: 'Second',
      auth: true,
      routeHistoryName: 'main',
    },
  },
];

const router = new Router({routes})

// router.beforeEach((to, from, next) => {
//   console.log('global router.beforeEach')
//   console.log('to - ', to)
//   // console.log('from - ', from)
//   next();
// })

// router.afterEach((to, from) => {
//   console.log('global router.afterEach')
//   console.log('to - ', to)
//   // console.log('from - ', from)
// })

export default router;
