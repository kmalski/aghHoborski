<template>
  <div class="hint-card">
    <label class="card-title">Podpowiedź</label>
    <b-form-input
      class="rectangle-input"
      :disabled="!isHintAuction"
      v-model="hintAmount"
      @keydown.enter="changeHintAmount"
      @focus="event => event.target.select()"
      number
    />
    <div>
      <b-button class="blue-shadow hint-button" variant="primary" :disabled="!isHintAuction" @click="acceptAmount">
        <b-icon :icon="'check2'"></b-icon>
      </b-button>
      <b-button class="blue-shadow hint-button" variant="primary" :disabled="!isHintAuction" @click="discardAmount">
        <b-icon :icon="'x'"></b-icon>
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HintCard',
  data() {
    return {
      isHintAuction: false,
      hintAmount: null
    };
  },
  created() {
    this.$socket.client.emit('getGameState');
  },
  methods: {
    changeHintAmount() {
      if (this.hintAmount < 100) this.hintAmount *= 100;
      this.$socket.client.emit('changeHintAmount', { newHintAmount: this.hintAmount });
    },
    acceptAmount() {
      this.$socket.client.emit('acceptHintAmount');
    },
    discardAmount() {
      this.$socket.client.emit('discardHintAmount');
    }
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

.hint-card {
  @extend .small-card;

  .hint-button {
    @extend .square-btn;

    margin: auto 0.5rem;
    max-height: 1.4rem;
  }
}
</style>
