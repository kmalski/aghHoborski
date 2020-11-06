<template>
  <div class="amount">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Amount'
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.amount {
  text-align: center;
  padding: 1rem 2rem;
  font-size: 2rem;
  color: $font-color;
}
</style>
