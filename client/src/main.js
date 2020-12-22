import Vue from 'vue';
import App from './App.vue';
import router from './router';
import socket from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';
import VueShortkey from 'vue-shortkey';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

const serverAddress = process.env.VUE_APP_SERVER_ADDRESS;
const io = socket(serverAddress, {
  transports: ['polling', 'websocket'],
  allowUpgrades: true
});

Vue.use(VueSocketIOExt, io);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueShortkey);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
