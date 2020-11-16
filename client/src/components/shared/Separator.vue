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
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: $separator-background-color;
  box-shadow: 0px 15px 26px -6px rgba(0, 0, 0, 0.35);

  * {
    text-align: center;
    margin: 0.25rem auto;
    color: $separator-font-color;
  }
}
</style>
