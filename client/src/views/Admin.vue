<template>
  <section class="admin">
    <app-status-icon />
    <app-menu></app-menu>
    <section class="admin__content">
      <app-timer></app-timer>
      <div class="admin__row">
        <app-category-card></app-category-card>
        <app-one-on-one-card :disabled="true"></app-one-on-one-card>
      </div>
      <div class="admin__row">
        <app-team-card team-name="Niebiescy" variant="blue"></app-team-card>
        <app-team-card team-name="Zieloni" variant="green"></app-team-card>
        <app-team-card team-name="Żółci" variant="yellow"></app-team-card>
        <app-team-card team-name="Czerwoni" variant="red"></app-team-card>
        <app-team-card team-name="Mistrzowie" variant="master"></app-team-card>
      </div>
      <div class="admin__row to-left">
        <app-reset-card></app-reset-card>
        <app-hint-card :disabled="true"></app-hint-card>
        <app-bid-card :disabled="true"></app-bid-card>
      </div>
    </section>
  </section>
</template>

<script>
import StatusIcon from '@/components/shared/StatusIcon.vue';
import CategoryCard from '@/components/admin/CategoryCard';
import OneOnOneCard from '@/components/admin/OneOnOneCard';
import ResetCard from '@/components/admin/ResetCard';
import HintCard from '@/components/admin/HintCard';
import TeamCard from '@/components/admin/TeamCard';
import BidCard from '@/components/admin/BidCard';
import Timer from '@/components/admin/Timer';
import Menu from '@/components/admin/Menu';

export default {
  name: 'Admin',
  data() {
    return {
      example: ''
    };
  },
  created() {
    this.$socket.client.emit('adminGetState', {
      name: this.$route.params.room,
      token: localStorage.awanturaToken
    });
  },
  methods: {
    forceLogout(msg) {
      this.$router.push({
        name: 'Login',
        params: { initialShowAlert: true, initialMsg: msg }
      });
    }
  },
  sockets: {
    unauthorized(msg) {
      this.forceLogout(msg);
    },
    warning(msg) {
      this.forceLogout(msg);
    }
  },
  components: {
    AppCategoryCard: CategoryCard,
    AppOneOnOneCard: OneOnOneCard,
    AppStatusIcon: StatusIcon,
    AppResetCard: ResetCard,
    AppHintCard: HintCard,
    AppTeamCard: TeamCard,
    AppBidCard: BidCard,
    AppTimer: Timer,
    AppMenu: Menu
  }
};
</script>

<style scoped lang="scss">
.admin {
  display: flex;
  flex-direction: row;

  &__content {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
    position: relative;
    width: 85vw;
    height: 100vh;
    padding: 0 1rem;
  }

  .to-left {
    justify-content: flex-start;
  }

  &__row {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    margin: 1rem auto;

    // &__element {
    //   display: flex;
    //   flex-flow: column wrap;

    //   * {
    //     flex: 1 0 50%;
    //     margin: 0.5rem;
    //   }
    // }
  }
}
</style>
