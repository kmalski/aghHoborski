<template>
  <div class="admin-card" :class="{ [variant + '-border']: isInGame }">
    <div class="card-row">
      <label class="team-name" :class="[variant + '-font']">{{ teamName }}</label>
      <b-button class="blue-shadow rectangle-btn" :variant="buttonVariant" @click="toggleInGame">
        {{ isInGame ? 'Gra' : 'Nie gra' }}
      </b-button>
    </div>
    <div class="card-row">
      <label>Licytacja</label>
      <b-form-input :disabled="!isInGame" v-model="auctionAmount" />
    </div>
    <div class="card-row">
      <label>Stan konta</label>
      <b-form-input :disabled="!isInGame" v-model="accountBalance" />
    </div>
    <div class="card-row">
      <label>Podpowiedzi</label>
      <b-form-input :disabled="!isInGame" v-model="hintCount" />
    </div>
    <div class="card-row">
      <label>Czarna skrzynka</label>
      <b-button :disabled="!isInGame" class="blue-shadow square-btn" variant="primary" @click="toggleBlackBox">
        <b-icon :icon="hasBlackBox ? 'check2' : 'x'"></b-icon>
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TeamCard',
  props: {
    teamName: {
      type: String,
      required: true
    },
    variant: {
      type: String,
      required: true,
      validator(value) {
        return ['blue', 'green', 'yellow', 'red', 'master'].includes(value);
      }
    }
  },
  data() {
    return {
      styles: {
        border: true
      },
      accountBalance: 1000,
      auctionAmount: 200,
      hintCount: 0,
      hasBlackBox: false,
      isAnswering: false,
      isInGame: true
    };
  },
  computed: {
    buttonVariant() {
      return this.isInGame ? 'primary' : 'light';
    }
  },
  methods: {
    toggleInGame() {
      this.isInGame = !this.isInGame;
    },
    toggleHint() {
      this.hasHint = !this.hasHint;
    },
    toggleBlackBox() {
      this.hasBlackBox = !this.hasBlackBox;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.admin-card {
  @extend .base-card;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-height: fit-content;
  max-width: 15vw;
  margin: auto;

  .team-name {
    font-weight: 500;
  }

  .card-row {
    display: grid;
    grid-template: 1fr / 2fr 1fr;
    align-items: center;
    justify-content: space-between;
    margin: 0.25rem auto;
    width: 100%;

    > :first-child {
      text-align: left;
      justify-self: start;
      align-self: center;
      grid-area: 1 / 1 / 2 / 2;
    }

    > :last-child {
      align-self: center;
      justify-self: end;
      grid-area: 1 / 2 / 2 / 3;
    }
  }
}
</style>
