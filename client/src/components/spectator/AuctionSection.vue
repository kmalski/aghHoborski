<template>
  <section class="auction-section">
    <app-separator class="auction-separator">
      <p>LICYTACJA</p>
    </app-separator>
    <app-amount class="blue-auction">{{ amounts.auction.blue }}</app-amount>
    <app-amount class="green-auction">{{ amounts.auction.green }}</app-amount>
    <app-amount class="yellow-auction">{{ amounts.auction.yellow }}</app-amount>

    <app-separator class="hint-separator">
      <p>PODPOWIEDŹ</p>
    </app-separator>
    <app-amount class="hint-amount">{{ amounts.hint }}</app-amount>

    <app-separator class="amounts-separator">
      <p>STAN KONTA</p>
    </app-separator>
    <app-amount class="blue-amount">{{ amounts.blue }}</app-amount>
    <app-amount class="green-amount">{{ amounts.green }}</app-amount>
    <app-amount class="yellow-amount">{{ amounts.yellow }}</app-amount>

    <app-separator class="bid-separator">
      <p>DO WYGRANIA</p>
    </app-separator>
    <app-amount class="bid-amount">{{ amounts.bid }}</app-amount>
  </section>
</template>

<script>
import Separator from '@/components/shared/Separator.vue';
import Amount from '@/components/shared/Amount.vue';

export default {
  name: 'AuctionSection',
  data() {
    return {
      amounts: {
        blue: 500,
        green: 500,
        yellow: 500,
        bid: 0,
        hint: 0,
        auction: {
          blue: 500,
          green: 500,
          yellow: 500
        }
      }
    };
  },
  components: {
    AppSeparator: Separator,
    AppAmount: Amount
  }
};
</script>

<style scoped lang="scss">
.auction-section {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 2fr 5fr 2fr 5fr;
  justify-items: center;
  margin-bottom: 3rem;
  width: 90%;
  height: 35vh;
  grid-template-areas:
    'auction-separator auction-separator auction-separator hint-separator'
    'blue-auction      green-auction     yellow-auction    hint-amount'
    'amounts-separator amounts-separator amounts-separator bid-separator'
    'blue-amount       green-amount      yellow-amount     bid-amount';

  .auction-separator {
    grid-area: auction-separator;
  }

  .hint-separator {
    grid-area: hint-separator;
  }

  .blue-auction {
    grid-area: blue-auction;
  }

  .green-auction {
    grid-area: green-auction;
  }

  .yellow-auction {
    grid-area: yellow-auction;
  }

  .hint-amount {
    grid-area: hint-amount;
  }

  .amounts-separator {
    grid-area: amounts-separator;
  }

  .bid-separator {
    grid-area: bid-separator;
  }

  .blue-amount {
    grid-area: blue-amount;
  }

  .green-amount {
    grid-area: green-amount;
  }

  .yellow-amount {
    grid-area: yellow-amount;
  }

  .bid-amount {
    grid-area: bid-amount;
  }
}
</style>
