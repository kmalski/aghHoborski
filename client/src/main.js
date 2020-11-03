import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import socket from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

const serverAddress = process.env.VUE_APP_SERVER_ADDRESS || 'https://awantura-server.malski.pl';
const io = socket(serverAddress, {
  transports: ['websocket']
});

Vue.use(VueSocketIOExt, io, { store });
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
