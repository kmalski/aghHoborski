<template>
  <div class="admin-card" :class="{ [variant + '-border']: inGame }">
    <div class="card-row">
      <label class="team-name" :class="[variant + '-font']">{{ teamName }}</label>
      <b-button class="blue-shadow rectangle-btn" :variant="buttonVariant" @click="toggleInGame">
        {{ inGame ? 'Gra' : 'Nie gra' }}
      </b-button>
    </div>
    <div class="card-row">
      <label>Licytacja</label>
      <b-form-input :disabled="!inGame" v-model="auctionAmount" />
    </div>
    <div class="card-row">
      <label>Stan konta</label>
      <b-form-input :disabled="!inGame" v-model="accountBalance" />
    </div>
    <div class="card-row">
      <label>Podpowiedzi</label>
      <b-form-input :disabled="!inGame" v-model="hintsCount" />
    </div>
    <div class="card-row">
      <label>Czarna skrzynka</label>
      <b-button :disabled="!inGame" class="blue-shadow square-btn" variant="primary" @click="toggleBlackBox">
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
        return ['blue', 'green', 'yellow', 'red', 'masters'].includes(value);
      }
    }
  },
  data() {
    return {
      styles: {
        border: true
      },
      accountBalance: null,
      auctionAmount: null,
      hintsCount: null,
      hasBlackBox: false,
      isAnswering: false, // TODO: implement color background depending on isAnswering
      inGame: false
    };
  },
  created() {
    this.$socket.client.emit('getTeamState', { teamName: this.variant });
    this.$socket.client.on(this.variant + 'TeamState', this.fillData);
    this.$socket.client.on(this.variant + 'BlackBoxChanged', this.changeBlackBox);
    this.$socket.client.on(this.variant + 'TeamStatusChanged', this.changeInGame);
  },
  computed: {
    buttonVariant() {
      return this.inGame ? 'primary' : 'light';
    }
  },
  methods: {
    fillData(data) {
      this.accountBalance = data.accountBalance;
      this.auctionAmount = data.auctionAmount;
      this.hintsCount = data.hintsCount;
      this.hasBlackBox = data.hasBlackBox;
      this.inGame = data.inGame;
    },
    toggleInGame() {
      this.$socket.client.emit('changeTeamStatus', { teamName: this.variant, desiredState: !this.inGame });
    },
    changeInGame(data) {
      this.inGame = data.state;
    },
    toggleHint() {
      this.hasHint = !this.hasHint;
    },
    toggleBlackBox() {
      this.$socket.client.emit('changeBlackBox', { teamName: this.variant, desiredState: !this.hasBlackBox });
    },
    changeBlackBox(data) {
      this.hasBlackBox = data.state;
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
