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
      auth: false
    },
  },
  {
    name: 'first',
    path: '/first',
    children: [
      {
        name: 'first',
        path: '/',
        // @ts-ignore
        // eslint-disable-next-line
        component: () => import(/* webpackChunkName: "first" */ '~/views/First'),
        meta: {
          title: 'First',
          auth: true,
        },
      },
      {
        name: 'dynamo-one',
        path: '/dynamo-one',
        // @ts-ignore
        // eslint-disable-next-line
        component: () => import(/* webpackChunkName: "dynamo-one" */ '~/views/Dynamo-One'),
        meta: {
          title: 'Dynamo One',
          auth: true,
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
    meta: {
      title: 'Second',
      auth: true,
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
