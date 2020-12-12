<template>
  <div class="money-pool-card">
    <label class="card-title">Pula licytacji</label>
    <b-form-input
      class="rectangle-input"
      v-model="moneyPool"
      @keydown.enter="changeMoneyPool"
      @focus="event => event.target.select()"
      number
    />
    <b-button class="blue-shadow rectangle-btn" variant="primary" @click="changeMoneyPool">
      Zmień
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'MooneyPoolCard',
  data() {
    return {
      moneyPool: null
    };
  },
  created() {
    this.$socket.client.emit('getGameState');
  },
  methods: {
    changeMoneyPool() {
      if (this.moneyPool < 100) this.moneyPool *= 100;
      this.$socket.client.emit('changeMoneyPool', { newMoneyPool: this.moneyPool });
    }
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

.money-pool-card {
  @extend .small-card;
}
</style>
