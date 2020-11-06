<template>
  <div class="bid-card">
    <label>Pula licytacji</label>
    <b-form-input :disabled="disabled" v-model="bidAmount" />
    <b-button id="zz" class="blue-shadow rectangle-btn" variant="primary" :disabled="disabled" @click="changeBidAmount">
      Zmień
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'BidCard',
  props: {
    disabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      bidAmount: ''
    };
  },
  methods: {
    changeBidAmount() {}
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.bid-card {
  @extend .small-card;
}
</style>
