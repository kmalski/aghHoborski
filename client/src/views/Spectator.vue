<template>
  <section class="spectator">
    <app-status-icon />
    <app-question-section></app-question-section>
    <app-auction-section></app-auction-section>
  </section>
</template>

<script>
import StatusIcon from '@/components/shared/StatusIcon.vue';
import QuestionSection from '@/components/spectator/QuestionSection.vue';
import AuctionSection from '@/components/spectator/AuctionSection.vue';

export default {
  name: 'Spectator',
  data: function() {
    return {
      example: ''
    };
  },
  created() {
    this.$socket.client.emit('getState', { name: this.$route.params.room });
  },
  components: {
    AppStatusIcon: StatusIcon,
    AppQuestionSection: QuestionSection,
    AppAuctionSection: AuctionSection
  }
};
</script>

<style scoped lang="scss">
.spectator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  align-content: space-between;
  min-height: 100vh;
}
</style>
