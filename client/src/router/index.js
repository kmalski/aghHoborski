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
    path: '/login',
    name: 'Login',
    component: lazyLoad('Login'),
    props: true
  },
  {
    path: '/:room/admin',
    name: 'Admin',
    component: lazyLoad('Admin')
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
