<template>
  <div class="hint-amount neutral-background">
    <p>{{ hintAmount }}</p>
  </div>
</template>

<script>
export default {
  name: 'HintAmount',
  data() {
    return {
      hintAmount: null
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
