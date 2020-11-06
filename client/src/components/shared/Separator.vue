<template>
  <div class="separator">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Separator'
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.separator {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: $separator-background-color;

  * {
    text-align: center;
    margin: 0.25rem auto;
    color: $separator-font-color;
  }
}
</style>
