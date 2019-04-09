import Vue from 'vue';
import Router, { RouteConfig } from 'vue-router';

Vue.use(Router);

export const routes: RouteConfig[] = [
  // otherwise redirect to home
  // { path: '*', redirect: '/' },
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
    // @ts-ignore
    // eslint-disable-next-line
    component: () => import(/* webpackChunkName: "first" */ '~/views/First'),
    meta: {
      title: 'First',
      auth: true,
    },
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

export default router;
