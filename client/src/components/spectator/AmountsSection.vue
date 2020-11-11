<template>
  <section class="amounts-section">
    <!-- <app-separator class="auction-separator">
      <p>LICYTACJA</p>
    </app-separator> -->
    <div class="amounts-row">
      <app-auction-amount variant="blue"></app-auction-amount>
      <app-auction-amount variant="green"></app-auction-amount>
      <app-auction-amount variant="yellow"></app-auction-amount>
      <app-auction-amount variant="red"></app-auction-amount>
      <app-auction-amount variant="masters"></app-auction-amount>
      <app-hint-amount></app-hint-amount>
    </div>

    <!-- <app-separator class="hint-separator">
      <p>PODPOWIEDŹ</p>
    </app-separator> -->

    <!-- <app-separator class="balances-separator">
      <p>STAN KONTA</p>
    </app-separator> -->
    <div class="amounts-row">
      <app-account-balance variant="blue"></app-account-balance>
      <app-account-balance variant="green"></app-account-balance>
      <app-account-balance variant="yellow"></app-account-balance>
      <app-account-balance variant="red"></app-account-balance>
      <app-account-balance variant="masters"></app-account-balance>
      <app-money-pool></app-money-pool>
    </div>

    <!-- <app-separator class="money-pool-separator">
      <p>DO WYGRANIA</p>
    </app-separator> -->
  </section>
</template>

<script>
import AccountBalance from '@/components/spectator/AccountBalance.vue';
import AuctionAmount from '@/components/spectator/AuctionAmount.vue';
import HintAmount from '@/components/spectator/HintAmount.vue';
import MoneyPool from '@/components/spectator/MoneyPool.vue';
// import Separator from '@/components/shared/Separator.vue';

export default {
  name: 'AmountsSection',
  data() {
    return {
      amounts: {
        hint: 0
      }
    };
  },
  components: {
    AppAccountBalance: AccountBalance,
    AppAuctionAmount: AuctionAmount,
    AppHintAmount: HintAmount,
    AppMoneyPool: MoneyPool
    // AppSeparator: Separator
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.amounts-section {
  display: flex;
  flex-flow: column;
  width: 90%;
  height: 35vh;

  .amounts-row {
    width: 100%;
    display: flex;
    flex-flow: row;
    height: 13vh;

    * {
      width: 100%;
    }
  }

  .auction-separator {
    flex: 0 0 80%;
  }

  .hint-separator {
    flex: 0 0 20%;
  }

  .amounts-separator {
    flex: 0 0 80%;
  }

  .bid-separator {
    grid-area: bid-separator;
  }
}
</style>
