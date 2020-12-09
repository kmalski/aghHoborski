<template>
  <section class="login">
    <b-alert class="alert-position" v-model="alert.show" variant="warning" dismissible>
      {{ alert.msg }}
    </b-alert>
    <app-status-icon></app-status-icon>
    <div class="split__left">
      <app-logo></app-logo>
      <app-scene></app-scene>
    </div>
    <div class="split__right">
      <app-login-form></app-login-form>
    </div>
  </section>
</template>

<script>
import Logo from '@/components/shared/Logo.vue';
import Scene from '@/components/three/Scene.vue';
import StatusIcon from '@/components/shared/StatusIcon.vue';
import LoginFormMixin from '@/mixins/LoginFormMixin';

export default {
  name: 'LoginMixin',
  props: {
    initialMsg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      alert: {
        msg: this.initialMsg,
        show: this.initialMsg !== ''
      }
    };
  },
  methods: {
    showAlert(msg) {
      this.alert.msg = msg;
      this.alert.show = true;
    }
  },
  sockets: {
    unauthorized(msg) {
      this.showAlert(msg);
    },
    warning(msg) {
      this.showAlert(msg);
    }
  },
  components: {
    AppLogo: Logo,
    AppScene: Scene,
    AppStatusIcon: StatusIcon,
    AppLoginForm: LoginFormMixin // default
  }
};
</script>
