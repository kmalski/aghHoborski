<template>
  <section class="login">
    <b-alert class="alert-position" v-model="showAlert" variant="warning" dismissible>
      {{ msg }}
    </b-alert>
    <app-status-icon />
    <div class="split__left">
      <app-logo></app-logo>
      <app-scene></app-scene>
    </div>
    <app-login-form class="split__right"></app-login-form>
  </section>
</template>

<script>
import Logo from '@/components/shared/Logo.vue';
import Scene from '@/components/three/Scene.vue';
import StatusIcon from '@/components/shared/StatusIcon.vue';
import LoginForm from '@/components/login/LoginForm.vue';

export default {
  name: 'Login',
  props: {
    initialMsg: {
      type: String,
      defalut: ''
    },
    initialShowAlert: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      msg: this.initialMsg,
      showAlert: this.initialShowAlert
    };
  },
  sockets: {
    unauthorized(msg) {
      this.msg = msg;
      this.showAlert = true;
    },
    warning(msg) {
      this.msg = msg;
      this.showAlert = true;
    }
  },
  components: {
    AppLogo: Logo,
    AppScene: Scene,
    AppStatusIcon: StatusIcon,
    AppLoginForm: LoginForm
  }
};
</script>

<style scoped lang="scss">
@import '../scss/main.scss';

.login {
  @extend .split;

  background-image: $home-background-image;
}
</style>
