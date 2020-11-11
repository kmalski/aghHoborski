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
    this.$socket.client.emit('getMoneyPool');
    this.$socket.client.on('moneyPool', this.fillData);
    this.$socket.client.on('moneyPoolChanged', this.changeMoneyPool);
  },
  methods: {
    fillData(data) {
      this.moneyPool = data.moneyPool;
    },
    changeMoneyPool(data) {
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
