<template>
  <section class="home">
    <b-alert class="alert-position" v-model="showAlert" variant="warning" dismissible>
      {{ msg }}
    </b-alert>
    <app-status-icon />
    <app-logo class="split__left"></app-logo>
    <app-spectator-form class="split__right"></app-spectator-form>
  </section>
</template>

<script>
import Logo from '@/components/shared/Logo.vue';
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
  data: function() {
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
    AppStatusIcon: StatusIcon,
    AppLogo: Logo,
    AppSpectatorForm: SpectatorForm
  }
};
</script>

<style scoped lang="scss">
@import '../scss/main.scss';

.home {
  @extend .split;
}
</style>
