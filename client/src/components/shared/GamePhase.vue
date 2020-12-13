<template>
  <div class="game-phase">
    <label>Faza gry:</label>
    <p>{{ stage | translateStage }}</p>
  </div>
</template>

<script>
export default {
  name: 'GamePhase',
  data() {
    return {
      stage: null
    };
  },
  created() {
    this.$socket.client.emit('getGameState');
  },
  sockets: {
    gameState(data) {
      this.stage = data.roundStage;
    },
    auctionStarted() {
      this.stage = 'auction';
    },
    auctionFinished(data) {
      if (data.winningTeam != null) this.stage = 'answering';
      else this.stage = 'idle';
    },
    hintAuctionStarted() {
      this.stage = 'hintAuction';
    },
    hintAuctionFinished() {
      this.stage = 'answering';
    },
    roundFinished() {
      this.stage = 'celebration';
    },
    newRound() {
      this.stage = 'idle';
    },
    oneOnOneStarted() {
      this.stage = 'oneOnOne';
    }
  },
  filters: {
    translateStage(stage) {
      switch (stage) {
        case 'auction':
          return 'Licytacja';
        case 'answering':
          return 'Pytanie';
        case 'hintAuction':
          return 'Licytacja podpowiedzi';
        case 'idle':
          return 'Pomiędzy rundami';
        case 'oneOnOne':
          return 'Jeden na jeden';
        case 'celebration':
          return 'Cieszymy się nagrodą';
        default:
          return 'Nieznana faza gry';
      }
    }
  }
};
</script>

<style scoped lang="scss">
.game-phase {
  position: absolute;
  top: 1.5vh;
  left: 2vh;
  font-size: 0.9rem;

  label {
    display: inline-block;
    font-weight: 600;
  }

  p {
    display: inline-block;
    margin: 0 0.25rem;
  }
}
</style>
