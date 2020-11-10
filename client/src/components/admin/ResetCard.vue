<template>
  <div class="reset-card">
    <label>Reset kont</label>
    <b-form-input
      v-model="newAccountBalance"
      @keydown.enter="resetAmounts"
      @focus="event => event.target.select()"
      number
    />
    <b-button class="blue-shadow rectangle-btn" variant="primary" @click="resetAmounts">
      Zresetuj
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'ResetCard',
  data() {
    return {
      newAccountBalance: null
    };
  },
  methods: {
    resetAmounts() {
      if (this.newAccountBalance < 100) this.newAccountBalance *= 100;
      this.$socket.client.emit('resetAccountBalances', { newBalance: this.newAccountBalance });
      this.newAccountBalance = null;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.reset-card {
  @extend .small-card;
}
</style>
