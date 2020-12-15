<template>
  <div class="one-on-one-card">
    <label class="ooo-label">Jeden na jeden</label>
    <div class="categories">
      <b-form-checkbox
        v-for="category in categories"
        v-model="category.enabled"
        :key="category.name"
        :disabled="!isOneOnOne || isSelectedTeam"
        @input="toggleCategory(category)"
        >{{ category.name }}
      </b-form-checkbox>
    </div>
    <div class="buttons">
      <b-button
        class="blue-shadow confirm-btn"
        variant="primary"
        @click="confirmCategory"
        :disabled="!oneCategoryLeft || isSelectedTeam"
      >
        Zatwierdź kategorię
      </b-button>
      <b-form-select
        class="default-input"
        v-model="selectedTeam"
        :options="teams"
        :disabled="!isOneOnOne || !selectedCategory"
        @change="chooseTeam"
      ></b-form-select>
    </div>
  </div>
</template>

<script>
import TeamNameMixin from '@/mixins/TeamNameMixin';

export default {
  name: 'OneOnOneCard',
  mixins: [TeamNameMixin],
  data() {
    return {
      isOneOnOne: false,
      categories: [],
      teams: [],
      selectedTeam: null,
      selectedCategory: null
    };
  },
  created() {
    this.$socket.client.emit('getOneOnOneState');
  },
  computed: {
    oneCategoryLeft() {
      const enabled = this.categories.filter(category => category.enabled === true);
      return enabled.length === 1;
    },
    isSelectedTeam() {
      return this.selectedTeam != null;
    }
  },
  methods: {
    toggleCategory(category) {
      this.$socket.client.emit('changeCategoryState', { category: category.name, enabled: category.enabled });
    },
    confirmCategory() {
      this.$socket.client.emit('confirmCategory');
    },
    chooseTeam(team) {
      this.$socket.client.emit('chooseTeam', { teamName: team });
    },
    setTeams(teams) {
      this.teams = this.dumpTeams();
      teams.forEach(team => this.teams.push({ value: team, text: this.translateTeamName(team) }));
    },
    dumpCategories() {
      const dumpCategories = [];
      for (let i = 0; i <= 7; i++) {
        dumpCategories.push({ name: `Kategoria ${i}`, enabled: false });
      }
      return dumpCategories;
    },
    dumpTeams() {
      return [{ value: null, text: 'Wybierz zespół', disabled: true }];
    }
  },
  sockets: {
    oneOnOneState(data) {
      if (data.roundStage === 'oneOnOne' || (data.roundStage === 'answering' && data.categories != null)) {
        this.isOneOnOne = true;
      }
      if (this.isOneOnOne) {
        this.categories = data.categories;
        this.selectedTeam = data.team;
        this.selectedCategory = data.category;
        this.setTeams(data.teams);
      } else {
        this.categories = this.dumpCategories();
        this.teams = this.dumpTeams();
      }
    },
    oneOnOneStarted(data) {
      this.isOneOnOne = true;
      this.categories = data.categories;
      this.setTeams(data.teams);
    },
    categoryStateChanged(data) {
      const category = this.categories.find(category => category.name === data.category);
      if (category) {
        category.enabled = data.enabled;
      }
    },
    categoryConfirmed(data) {
      this.selectedCategory = data.category;
    },
    teamChosen(data) {
      this.selectedTeam = data.team;
    },
    roundFinished() {
      if (!this.isOneOnOne) return;
      this.isOneOnOne = false;
      this.categories = this.dumpCategories();
      this.teams = this.dumpTeams();
      this.selectedTeam = null;
      this.selectedCategory = null;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.one-on-one-card {
  @extend .base-card;

  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: space-evenly;
  height: 35vh;
  width: 25vw;
  margin: auto;

  .ooo-label {
    @extend .card-title;
    margin: 0.5rem 0;
  }

  .categories {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;

    * {
      flex: 1 0 49%;
      text-align: left;
    }
  }

  .buttons {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .confirm-btn {
      @extend .default-btn;
      font-size: 0.75rem;
    }

    * {
      flex: 1 0 35%;
      text-align: center;
    }

    > :first-child {
      margin-right: 0.35rem;
    }

    > :last-child {
      margin-left: 0.35rem;
    }
  }
}
</style>
