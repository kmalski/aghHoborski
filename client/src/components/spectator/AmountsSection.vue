<template>
  <section class="amounts-section">
    <div class="left">
      <div v-show="isAuction" class="auction">
        <app-separator>
          <p>LICYTACJA</p>
        </app-separator>
        <div class="flex-row">
          <app-auction-amount variant="blue"></app-auction-amount>
          <app-auction-amount variant="green"></app-auction-amount>
          <app-auction-amount variant="yellow"></app-auction-amount>
          <app-auction-amount variant="red"></app-auction-amount>
          <app-auction-amount variant="masters"></app-auction-amount>
        </div>
      </div>
      <div class="balances" :style="{ 'border-top-left-radius': isAuction ? '0px' : '20px' }">
        <app-separator>
          <p>STAN KONTA</p>
        </app-separator>
        <div class="flex-row">
          <app-account-balance variant="blue"></app-account-balance>
          <app-account-balance variant="green"></app-account-balance>
          <app-account-balance variant="yellow"></app-account-balance>
          <app-account-balance variant="red"></app-account-balance>
          <app-account-balance variant="masters"></app-account-balance>
        </div>
      </div>
    </div>

    <div class="right">
      <div v-show="isHintAuction" class="hint">
        <app-separator>
          <p>PODPOWIEDŹ</p>
        </app-separator>
        <app-hint-amount></app-hint-amount>
      </div>
      <div class="money-pool" :style="{ 'border-top-right-radius': isHintAuction ? '0px' : '20px' }">
        <app-separator>
          <p>DO WYGRANIA</p>
        </app-separator>
        <app-money-pool></app-money-pool>
      </div>
    </div>
  </section>
</template>

<script>
import AccountBalance from '@/components/spectator/AccountBalance.vue';
import AuctionAmount from '@/components/spectator/AuctionAmount.vue';
import HintAmount from '@/components/spectator/HintAmount.vue';
import MoneyPool from '@/components/spectator/MoneyPool.vue';
import Separator from '@/components/shared/Separator.vue';

export default {
  name: 'AmountsSection',
  data() {
    return {
      isAuction: false,
      isHintAuction: false
    };
  },
  created() {
    this.$socket.client.emit('getGameState');
  },
  sockets: {
    gameState(data) {
      this.isAuction = data.roundStage === 'auction';
      this.isHintAuction = data.roundStage === 'hintAuction';
    },
    auctionStarted() {
      this.isAuction = true;
    },
    auctionFinished() {
      this.isAuction = false;
    },
    hintAuctionStarted() {
      this.isHintAuction = true;
    },
    hintAuctionFinished() {
      this.isHintAuction = false;
    }
  },
  components: {
    AppAccountBalance: AccountBalance,
    AppAuctionAmount: AuctionAmount,
    AppHintAmount: HintAmount,
    AppMoneyPool: MoneyPool,
    AppSeparator: Separator
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.amounts-section {
  display: flex;
  flex-direction: row;
  width: 90%;
  margin: 3rem;
  overflow: hidden;
  border-radius: 20px;

  .left {
    flex: 1 0 75%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;

    .auction {
      @extend .flex-column;
      border-top-right-radius: 20px;
      overflow: hidden;
    }

    .balances {
      @extend .flex-column;
      overflow: hidden;
    }
  }

  .right {
    flex: 2 0 20%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    width: 100%;

    .hint {
      @extend .flex-column;
      overflow: hidden;
      border-top-left-radius: 20px;
    }

    .money-pool {
      @extend .flex-column;
      overflow: hidden;
    }
  }
}
</style>
