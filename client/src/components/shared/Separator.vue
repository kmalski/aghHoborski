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
.separator {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: black;

  * {
    text-align: center;
    margin: 0.25rem auto;
    color: white;
  }
}
</style>
