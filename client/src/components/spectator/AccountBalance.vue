<template>
  <div v-if="isInGame" class="account-balance" :class="[variant + '-background']">
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
      isInGame: false
    };
  },
  created() {
    this.toggleSubscription('on');
    this.$socket.client.emit('getTeamState', { teamName: this.variant });
  },
  beforeDestroy() {
    this.toggleSubscription('off');
  },
  methods: {
    toggleSubscription(method) {
      this.$socket.client[method](this.variant + 'TeamState', this.fillData);
      this.$socket.client[method](this.variant + 'TeamStatusChanged', this.changeInGame);
      this.$socket.client[method](this.variant + 'AccountBalanceChanged', this.changeAccountBalance);
    },
    fillData(data) {
      this.accountBalance = data.accountBalance;
      this.isInGame = data.isInGame;
    },
    changeInGame(data) {
      this.isInGame = data.isInGame;
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
