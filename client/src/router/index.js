import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

function lazyLoad(view) {
  return () => import(`@/views/${view}.vue`);
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    props: true
  },
  {
    path: '/login-admin',
    name: 'AdminLogin',
    component: lazyLoad('AdminLogin'),
    props: true
  },
  {
    path: '/login-host',
    name: 'HostLogin',
    component: lazyLoad('HostLogin'),
    props: true
  },
  {
    path: '/:room/admin',
    name: 'Admin',
    component: lazyLoad('Admin')
  },
  {
    path: '/:room/host',
    name: 'Host',
    component: lazyLoad('Host')
  },
  {
    path: '/:room/spectator',
    name: 'Spectator',
    component: lazyLoad('Spectator')
  },
  { path: '*', name: 'NotFound', component: lazyLoad('NotFound') }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
