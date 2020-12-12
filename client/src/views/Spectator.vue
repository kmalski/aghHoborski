<template>
  <section class="spectator">
    <app-status-icon></app-status-icon>
    <app-question-section></app-question-section>
    <app-one-on-one-section></app-one-on-one-section>
    <app-amounts-section></app-amounts-section>
  </section>
</template>

<script>
import StatusIcon from '@/components/shared/StatusIcon';
import OneOnOneSection from '@/components/spectator/OneOnOneSection';
import AmountsSection from '@/components/spectator/AmountsSection';
import SpectatorQuestionSection from '@/components/spectator/SpectatorQuestionSection';

export default {
  name: 'Spectator',
  created() {
    this.$socket.client.emit('joinRoom', {
      name: this.$route.params.room
    });
  },
  methods: {
    returnHome(msg) {
      this.$router.push({
        name: 'Home',
        params: { initialMsg: msg }
      });
    }
  },
  sockets: {
    warning(msg) {
      this.returnHome(msg);
    },
    gameReset() {
      this.$router.go(0);
    }
  },
  components: {
    AppStatusIcon: StatusIcon,
    AppAmountsSection: AmountsSection,
    AppOneOnOneSection: OneOnOneSection,
    AppQuestionSection: SpectatorQuestionSection
  }
};
</script>

<style scoped lang="scss">
.spectator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
}
</style>
