<template>
  <div class="money-pool neutral-background">
    <p>{{ moneyPool }}</p>
  </div>
</template>

<script>
export default {
  name: 'MoneyPool',
  data() {
    return {
      moneyPool: null
    };
  },
  created() {
    this.$socket.client.emit('getGameState');
  },
  sockets: {
    gameState(data) {
      this.moneyPool = data.moneyPool;
    },
    moneyPoolChanged(data) {
      this.moneyPool = data.moneyPool;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.money-pool {
  @extend .amount;
}
</style>
