<template>
  <div v-if="inGame" class="account-balance" :class="[variant + '-background']">
    <p>{{ accountBalance }}</p>
  </div>
</template>

<script>
export default {
  name: 'AccountBalance',
  props: {
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
      accountBalance: null,
      inGame: false
    };
  },
  created() {
    this.$socket.client.emit('getTeamState', { teamName: this.variant });
    this.$socket.client.on(this.variant + 'TeamState', this.fillData);
    this.$socket.client.on(this.variant + 'TeamStatusChanged', this.changeInGame);
    this.$socket.client.on(this.variant + 'AccountBalanceChanged', this.changeAccountBalance);
  },
  methods: {
    fillData(data) {
      this.accountBalance = data.accountBalance;
      this.inGame = data.inGame;
    },
    changeInGame(data) {
      this.inGame = data.state;
    },
    changeAccountBalance(data) {
      this.accountBalance = data.accountBalance;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.account-balance {
  @extend .amount;
}
</style>
