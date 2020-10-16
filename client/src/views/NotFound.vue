<template>
  <section class="not-found">
    <p class="not-found__title">Teleturniej chyba nie w tą stronę :(</p>
  </section>
</template>

<script>
export default {
  name: 'NotFound'
};
</script>

<style lang="scss" scoped>
.not-found {
  display: grid;
  width: 100vw;
  height: 100vh;

  &__title {
    place-self: center;
    width: fit-content;
    height: fit-content;
    font-size: 4rem;
  }
}
</style>
