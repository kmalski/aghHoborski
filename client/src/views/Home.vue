<template>
  <section class="home">
    <b-alert class="alert-position" v-model="showAlert" variant="warning" dismissible>
      {{ msg }}
    </b-alert>
    <app-status-icon />
    <div class="split__left">
      <app-logo></app-logo>
      <app-scene></app-scene>
    </div>
    <div class="split__right">
      <app-spectator-form></app-spectator-form>
    </div>
  </section>
</template>

<script>
import Logo from '@/components/shared/Logo.vue';
import Scene from '@/components/three/Scene.vue';
import StatusIcon from '@/components/shared/StatusIcon.vue';
import SpectatorForm from '@/components/home/SpectatorForm.vue';

export default {
  name: 'Home',
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
    warning(msg) {
      this.msg = msg;
      this.showAlert = true;
    }
  },
  components: {
    AppLogo: Logo,
    AppScene: Scene,
    AppStatusIcon: StatusIcon,
    AppSpectatorForm: SpectatorForm
  }
};
</script>

<style scoped lang="scss">
@import '../scss/main.scss';

.home {
  @extend .split;
  background-image: $home-background-image;
}
</style>
