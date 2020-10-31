<template>
  <div class="reset-card">
    <label>Reset</label>
    <b-form-input v-model="resetAmount" />
    <b-button
      class="blue-shadow rectangle-btn"
      variant="primary"
      @click="resetAmounts"
    >
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
  @extend .base-card;

  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
  max-height: fit-content;
  max-width: 15vw;
  margin: auto;

  * {
    margin: 0.2rem auto;
  }

  label {
    text-align: left;
    width: 100%;
    font-weight: 500;
  }
}
</style>
