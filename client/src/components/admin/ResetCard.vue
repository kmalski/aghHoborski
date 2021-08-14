<template>
  <div class="reset-card">
    <label class="card-title">Reset kont</label>
    <b-form-input
      class="rectangle-input"
      v-model="newAccountBalance"
      @keydown.enter="resetAmounts"
      @focus="(event) => event.target.select()"
      number
    />
    <b-button class="blue-shadow rectangle-btn" variant="primary" @click="resetAmounts"> Zresetuj </b-button>
  </div>
</template>

<script>
export default {
  name: 'ResetCard',
  data() {
    return {
      resetModalId: 'resetModalId',
      newAccountBalance: null
    };
  },
  methods: {
    async resetAmounts() {
      if (this.newAccountBalance < 100) this.newAccountBalance *= 100;
      if (await this.confirm())
        this.$socket.client.emit('resetAccountBalances', { newAccountBalance: this.newAccountBalance });
    },
    async confirm() {
      return await this.$bvModal.msgBoxConfirm(
        `Czy na pewno chcesz aby stan kont wszystkich drużyń wynosił ${this.newAccountBalance}?`,
        {
          centered: true,
          size: 'sm',
          buttonSize: 'sm',
          okTitle: 'Tak',
          cancelTitle: 'Nie'
        }
      );
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
