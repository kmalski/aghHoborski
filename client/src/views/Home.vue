<template>
  <section class="home">
    <b-alert class="alert-position" v-model="showAlert" variant="warning" dismissible>
      {{ warningMsg }}
    </b-alert>
    <app-status-icon />
    <app-logo class="split__left"></app-logo>
    <spectator-form class="split__right"></spectator-form>
  </section>
</template>

<script>
import Logo from '@/components/shared/Logo.vue';
import StatusIcon from '@/components/shared/StatusIcon.vue';
import SpectatorForm from '@/components/home/SpectatorForm.vue';

export default {
  name: 'Home',
  data: function() {
    return {
      warningMsg: '',
      showAlert: false
    };
  },
  sockets: {
    warning(msg) {
      this.warningMsg = msg;
      this.showAlert = true;
    }
  },
  components: {
    AppStatusIcon: StatusIcon,
    AppLogo: Logo,
    SpectatorForm
  }
};
</script>

<style scoped lang="scss">
@import '../scss/main.scss';

.home {
  @extend .split;
}
</style>
