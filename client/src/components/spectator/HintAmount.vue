<template>
  <div class="hint-amount neutral-background" :style="{ visibility: 'visible' }">
    <p>{{ hintAmount }}</p>
  </div>
</template>

<script>
export default {
  name: 'HintAmount',
  data() {
    return {
      hintAmount: 500
    };
  },
  created() {},
  methods: {}
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.hint-amount {
  @extend .amount;
}
</style>
