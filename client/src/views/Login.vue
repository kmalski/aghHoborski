<template>
  <section class="login">
    <b-alert class="alert-position" v-model="showAlert" variant="warning" dismissible>
      {{ warningMsg }}
    </b-alert>
    <app-status-icon />
    <app-logo class="split__left"></app-logo>
    <app-admin-form class="split__right"></app-admin-form>
  </section>
</template>

<script>
import Logo from '@/components/shared/Logo.vue';
import StatusIcon from '@/components/shared/StatusIcon.vue';
import AdminForm from '@/components/login/AdminForm.vue';

export default {
  name: 'Login',
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
    AppAdminForm: AdminForm
  }
};
</script>

<style scoped lang="scss">
@import '../scss/main.scss';

.login {
  @extend .split;
}
</style>
