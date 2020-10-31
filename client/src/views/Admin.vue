<template>
  <section class="admin">
    <app-menu></app-menu>
    <section class="admin__content">
      <app-timer></app-timer>
      <div>
        <app-category-card></app-category-card>
      </div>
      <div class="admin__teams">
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
import CategoryCard from '../components/admin/CategoryCard';
import TeamCard from '../components/admin/TeamCard';
import Timer from '../components/admin/Timer';
import Menu from '../components/admin/Menu';

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
  sockets: {
    unauthorized(msg) {
      this.$router.push({
        name: 'Login',
        params: { initialShowAlert: true, initialMsg: msg }
      });
    }
  },
  components: {
    AppCategoryCard: CategoryCard,
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
    justify-content: flex-start;
    width: 85vw;
    padding: 0 1rem;
  }

  &__teams {
    display: flex;
    flex-flow: row wrap;
    width: auto;
  }
}
</style>
