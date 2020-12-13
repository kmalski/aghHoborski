<template>
  <section class="host">
    <app-status-icon></app-status-icon>
    <app-question-section></app-question-section>
    <app-prize-banner></app-prize-banner>
    <app-one-on-one-section></app-one-on-one-section>
    <app-amounts-section></app-amounts-section>
  </section>
</template>

<script>
import StatusIcon from '@/components/shared/StatusIcon';
import PrizeBanner from '@/components/spectator/PrizeBanner';
import AmountsSection from '@/components/spectator/AmountsSection';
import OneOnOneSection from '@/components/spectator/OneOnOneSection';
import HostQuestionSection from '@/components/host/HostQuestionSection';

export default {
  name: 'Host',
  created() {
    this.$socket.client.emit('authorize', {
      name: this.$route.params.room,
      token: localStorage.awanturaToken
    });
  },
  methods: {
    forceLogout(msg) {
      this.$router.push({
        name: 'HostLogin',
        params: { initialMsg: msg }
      });
    }
  },
  sockets: {
    unauthorized(msg) {
      this.forceLogout(msg);
    },
    gameReset() {
      this.$router.go(0);
    }
  },
  components: {
    AppStatusIcon: StatusIcon,
    AppPrizeBanner: PrizeBanner,
    AppAmountsSection: AmountsSection,
    AppOneOnOneSection: OneOnOneSection,
    AppQuestionSection: HostQuestionSection
  }
};
</script>

<style scoped lang="scss">
.host {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
}
</style>
