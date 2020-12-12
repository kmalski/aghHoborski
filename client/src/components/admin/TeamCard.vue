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
      <b-form-input
        class="rectangle-input"
        :disabled="!isInGame || !isAuction || hasLost"
        v-shortkey.focus="['ctrl', shortcut]"
        @focus="event => event.target.select()"
        @keyup.enter="emitAuctionAmountChange"
        v-model="auctionAmount"
        number
      />
    </div>
    <div class="card-row">
      <label>Stan konta</label>
      <b-form-input
        class="rectangle-input"
        :disabled="!isInGame"
        @keyup.enter="emitAccountBalanceChange"
        @focus="event => event.target.select()"
        v-model="accountBalance"
        number
      />
    </div>
    <div class="card-row">
      <label>Podpowiedzi</label>
      <b-form-input
        class="rectangle-input"
        :disabled="!isInGame"
        @keyup.enter="emitHintsCountChange"
        @focus="event => event.target.select()"
        v-model="hintsCount"
        number
      />
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
        return ['blue', 'green', 'yellow', 'red', 'masters'].includes(value);
      }
    },
    shortcut: {
      type: String,
      required: true
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
      isAuction: false,
      isInGame: false,
      hasLost: false
    };
  },
  created() {
    this.$socket.client.emit('getTeamState', { teamName: this.variant });
    this.$socket.client.on(this.variant + 'TeamState', this.fillData);
    this.$socket.client.on(this.variant + 'TeamStatusChanged', this.changeInGame);
    this.$socket.client.on(this.variant + 'AuctionAmountChanged', this.changeAuctionAmount);
    this.$socket.client.on(this.variant + 'AccountBalanceChanged', this.changeAccountBalance);
    this.$socket.client.on(this.variant + 'HintsCountChanged', this.changeHintsCount);
    this.$socket.client.on(this.variant + 'BlackBoxChanged', this.changeBlackBox);
    this.$socket.client.on(this.variant + 'HasLostChanged', this.changeHasLost);
  },
  computed: {
    buttonVariant() {
      return this.isInGame ? 'primary' : 'light';
    },
    validateAuctionAmount() {
      return (
        (this.auctionAmount >= 200 && Number.isInteger(this.auctionAmount / 100)) ||
        (this.auctionAmount < 200 && Number.isInteger(this.auctionAmount))
      );
    }
  },
  methods: {
    fillData(data) {
      this.accountBalance = data.accountBalance;
      this.auctionAmount = data.auctionAmount;
      this.isAuction = data.isAuction;
      this.hintsCount = data.hintsCount;
      this.hasBlackBox = data.hasBlackBox;
      this.isInGame = data.isInGame;
      this.hasLost = data.hasLost;
    },
    toggleInGame() {
      this.$socket.client.emit('changeTeamStatus', { teamName: this.variant, newIsInGame: !this.isInGame });
    },
    emitAuctionAmountChange() {
      if (this.validateAuctionAmount) {
        if (this.auctionAmount < 200) this.auctionAmount *= 100;
        this.$socket.client.emit('changeAuctionAmount', {
          teamName: this.variant,
          newAuctionAmount: this.auctionAmount
        });
      }
    },
    emitAccountBalanceChange() {
      if (this.accountBalance < 100) this.accountBalance *= 100;
      this.$socket.client.emit('changeAccountBalance', {
        teamName: this.variant,
        newAccountBalance: this.accountBalance
      });
    },
    emitHintsCountChange() {
      this.$socket.client.emit('changeHintsCount', { teamName: this.variant, newHintsCount: this.hintsCount });
    },
    toggleBlackBox() {
      this.$socket.client.emit('changeBlackBox', { teamName: this.variant, newHasBlackBox: !this.hasBlackBox });
    },
    changeInGame(data) {
      this.isInGame = data.isInGame;
    },
    changeAuctionAmount(data) {
      this.auctionAmount = data.auctionAmount;
    },
    changeAccountBalance(data) {
      this.accountBalance = data.accountBalance;
      this.hasLost = data.hasLost;
    },
    changeHintsCount(data) {
      this.hintsCount = data.hintsCount;
    },
    changeBlackBox(data) {
      this.hasBlackBox = data.hasBlackBox;
    },
    changeHasLost(data) {
      this.hasLost = data.hasLost;
    }
  },
  sockets: {
    auctionStarted() {
      this.isAuction = true;
    },
    auctionFinished() {
      this.isAuction = false;
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
    font-weight: 600;
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
