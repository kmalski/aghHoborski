<template>
  <section class="admin">
    <app-menu></app-menu>
    <section class="admin__content">
      <app-timer></app-timer>
      <div class="admin__row">
        <app-category-card></app-category-card>
        <app-one-on-one-card :disabled="true"></app-one-on-one-card>
      </div>
      <div class="admin__row">
        <app-team-card team-name="Niebiescy" variant="blue" shortcut="1"></app-team-card>
        <app-team-card team-name="Zieloni" variant="green" shortcut="2"></app-team-card>
        <app-team-card team-name="Żółci" variant="yellow" shortcut="3"></app-team-card>
        <app-team-card team-name="Czerwoni" variant="red" shortcut="4"></app-team-card>
        <app-team-card team-name="Mistrzowie" variant="masters" shortcut="5"></app-team-card>
      </div>
      <div class="admin__row">
        <app-reset-card></app-reset-card>
        <app-hint-card :disabled="true"></app-hint-card>
        <app-money-pool-card></app-money-pool-card>
      </div>
      <b-alert
        class="alert-position"
        variant="warning"
        dismissible
        :show="alert.dismissCountDown"
        @dismiss-count-down="countDownChanged"
      >
        {{ alert.msg }}
      </b-alert>
    </section>
    <app-status-icon />
  </section>
</template>

<script>
import MoneyPoolCard from '@/components/admin/MoneyPoolCard';
import CategoryCard from '@/components/admin/CategoryCard';
import OneOnOneCard from '@/components/admin/OneOnOneCard';
import StatusIcon from '@/components/shared/StatusIcon';
import ResetCard from '@/components/admin/ResetCard';
import HintCard from '@/components/admin/HintCard';
import TeamCard from '@/components/admin/TeamCard';
import Timer from '@/components/admin/Timer';
import Menu from '@/components/admin/Menu';

export default {
  name: 'Admin',
  data() {
    return {
      alert: {
        msg: '',
        dismissCountDown: 0
      }
    };
  },
  created() {
    this.$socket.client.emit('authorize', {
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
    },
    countDownChanged(dismissCountDown) {
      this.alert.dismissCountDown = dismissCountDown;
    }
  },
  sockets: {
    unauthorized(msg) {
      this.forceLogout(msg);
    },
    warning(msg) {
      this.alert.msg = msg;
      this.alert.dismissCountDown = 3;
    }
  },
  components: {
    AppMoneyPoolCard: MoneyPoolCard,
    AppCategoryCard: CategoryCard,
    AppOneOnOneCard: OneOnOneCard,
    AppStatusIcon: StatusIcon,
    AppResetCard: ResetCard,
    AppHintCard: HintCard,
    AppTeamCard: TeamCard,
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
    flex-flow: column;
    justify-content: center;
    position: relative;
    width: 85vw;
    height: 100vh;
    padding: 0 1rem;
  }

  &__row {
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    margin: 1rem auto;
  }
}
</style>
