<template>
  <div class="reset-card">
    <label>Reset</label>
    <b-form-input v-model="resetAmount" />
    <b-button class="blue-shadow rectangle-btn" variant="primary" @click="resetAmounts">
      Zresetuj
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'ResetCard',
  data() {
    return {
      resetAmount: ''
    };
  },
  methods: {
    resetAmounts() {}
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.reset-card {
  @extend .small-card;
}
</style>
