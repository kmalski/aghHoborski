<template>
  <div class="hint-card">
    <label>Podpowiedź</label>
    <b-form-input :disabled="disabled" v-model="hintAmount" />
    <div>
      <b-button id="zz" class="blue-shadow square-btn" variant="primary" :disabled="disabled" @click="acceptAmount">
        <b-icon :icon="'check2'"></b-icon>
      </b-button>
      <b-button id="zz" class="blue-shadow square-btn" variant="primary" :disabled="disabled" @click="discardAmount">
        <b-icon :icon="'x'"></b-icon>
      </b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResetCard',
  props: {
    disabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      hintAmount: ''
    };
  },
  methods: {
    acceptAmount() {},
    discardAmount() {}
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.hint-card {
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

  button {
    margin: auto 0.5rem;
    max-height: 1.4rem;
  }
}
</style>
