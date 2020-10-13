import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/:room/administrator',
    name: 'Administrator',
    component: () => import('../views/Administrator.vue')
  },
  {
    path: '/:room/spectator',
    name: 'Spectator',
    component: () => import('../views/Spectator.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
