<template>
  <section class="spectator">
    <app-status-icon />
    <app-question-section></app-question-section>
    <app-amounts-section></app-amounts-section>
  </section>
</template>

<script>
import StatusIcon from '@/components/shared/StatusIcon.vue';
import QuestionSection from '@/components/spectator/QuestionSection.vue';
import AmountsSection from '@/components/spectator/AmountsSection.vue';

export default {
  name: 'Spectator',
  data() {
    return {
      example: ''
    };
  },
  created() {
    this.$socket.client.emit('joinRoom', {
      name: this.$route.params.room
    });
  },
  methods: {
    returnHome(msg) {
      this.$router.push({
        name: 'Home',
        params: { initialShowAlert: true, initialMsg: msg }
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
    AppQuestionSection: QuestionSection,
    AppAmountsSection: AmountsSection
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
