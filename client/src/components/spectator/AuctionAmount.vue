<template>
  <div
    v-if="isInGame"
    class="auction-amount"
    :class="[variant + '-background']"
    :style="{ visibility: isAuction ? 'visible' : 'hidden' }"
  >
    <p>{{ auctionAmount }}</p>
  </div>
</template>

<script>
export default {
  name: 'AuctionAmount',
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
      auctionAmount: null,
      isInGame: false,
      isAuction: false
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
      this.$socket.client[method](this.variant + 'AuctionAmountChanged', this.changeAuctionAmount);
    },
    fillData(data) {
      this.auctionAmount = data.auctionAmount;
      this.isInGame = data.isInGame;
      this.isAuction = data.isAuction;
    },
    changeInGame(data) {
      this.isInGame = data.isInGame;
    },
    changeAuctionAmount(data) {
      this.auctionAmount = data.auctionAmount;
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

.auction-amount {
  @extend .amount;
}
</style>
