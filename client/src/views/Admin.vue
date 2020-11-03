<template>
  <section class="admin">
    <app-menu></app-menu>
    <section class="admin__content">
      <app-timer></app-timer>
      <div class="admin__row">
        <app-category-card></app-category-card>
        <div class="admin__row__element">
          <app-reset-card></app-reset-card>
          <app-hint-card :disabled="true"></app-hint-card>
        </div>
        <app-one-on-one-card :disabled="true"></app-one-on-one-card>
      </div>
      <div class="admin__row">
        <app-team-card team-name="Niebiescy" variant="blue"></app-team-card>
        <app-team-card team-name="Zieloni" variant="green"></app-team-card>
        <app-team-card team-name="Żółci" variant="yellow"></app-team-card>
        <app-team-card team-name="Czerwoni" variant="red"></app-team-card>
        <app-team-card team-name="Mistrzowie" variant="master"></app-team-card>
      </div>
    </section>
  </section>
</template>

<script>
import CategoryCard from '@/components/admin/CategoryCard';
import OneOnOneCard from '@/components/admin/OneOnOneCard';
import ResetCard from '@/components/admin/ResetCard';
import HintCard from '@/components/admin/HintCard';
import TeamCard from '@/components/admin/TeamCard';
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
  overflow: hidden;

  &__content {
    justify-content: flex-start;
    width: 85vw;
    padding: 0 1rem;
  }

  &__row {
    display: flex;
    flex-flow: row wrap;
    width: auto;
    margin: 2rem auto;

    &__element {
      display: flex;
      flex-flow: column wrap;

      * {
        margin: 0.5rem auto;
      }
    }
  }
}
</style>
