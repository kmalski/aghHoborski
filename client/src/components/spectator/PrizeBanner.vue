<template>
  <div v-show="isCelebration" class="prize-banner">
    <app-separator>
      <p>WYGRANO</p>
    </app-separator>
    <div class="prize" :class="{ [backgroundColor + '-background']: backgroundColor }">
      <p>{{ prize }}</p>
    </div>
  </div>
</template>

<script>
import Separator from '@/components/shared/Separator';

export default {
  name: 'PrizeBanner',
  data() {
    return {
      isCelebration: false,
      prize: null,
      backgroundColor: 'neutral'
    };
  },
  created() {
    this.$socket.client.emit('getGameState');
  },
  methods: {
    translatePrize(prize) {
      switch (prize) {
        case 'hint':
          return 'Podpowiedź';
        case 'blackBox':
          return 'Czarna skrzynka';
        default:
          return prize;
      }
    }
  },
  sockets: {
    gameState(data) {
      this.isCelebration = data.roundStage === 'celebration';
      if (this.isCelebration) {
        this.backgroundColor = data.team;
        this.prize = this.translatePrize(data.prize);
      }
    },
    roundFinished(data) {
      this.isCelebration = true;
      this.prize = this.translatePrize(data.prize);
      this.backgroundColor = data.winner;
    },
    newRound() {
      this.isCelebration = false;
    }
  },
  components: {
    AppSeparator: Separator
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.prize-banner {
  @extend .default-shadow;
  @extend .flex-column;

  text-align: center;
  height: 25vh;
  width: 30vw;
  overflow: hidden;
  border-radius: 20px;

  .prize {
    @extend .amount;

    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    font-size: 3rem;
  }
}

@include media-breakpoint-down(md) {
  .prize-banner {
    .prize {
      font-size: 1.5rem;
    }
  }
}
</style>
