<template>
  <div class="hint-amount neutral-background" :style="{ visibility: isHintAuction ? 'visible' : 'hidden' }">
    <p>{{ hintAmount }}</p>
  </div>
</template>

<script>
export default {
  name: 'HintAmount',
  data() {
    return {
      isHintAuction: false,
      hintAmount: null
    };
  },
  created() {
    this.$socket.client.emit('getGameState');
  },
  sockets: {
    gameState(data) {
      this.isHintAuction = data.roundStage === 'hintAuction';
      this.hintAmount = data.hintAmount;
    },
    hintAuctionStarted(data) {
      this.isHintAuction = true;
      this.hintAmount = data.hintAmount;
    },
    hintAuctionFinished() {
      this.isHintAuction = false;
    },
    hintAmountChanged(data) {
      this.hintAmount = data.hintAmount;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.hint-amount {
  @extend .amount;
}
</style>
