<template>
  <div class="logo">
    <p class="logo__text">Awantura o Naukę</p>
  </div>
</template>

<script>
export default {
  name: 'Logo'
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.logo {
  height: 25%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 1rem;

  &__text {
    margin: 0;
    font-size: 4.25rem;
    font-weight: 600;
    line-height: 4rem;
  }
}

@include media-breakpoint-down(md) {
  .logo {
    margin-bottom: 0;

    &__text {
      width: 80%;
      font-size: 2.25rem;
      line-height: 2.4rem;
    }
  }
}

@include media-breakpoint-up(xl) {
  .logo {
    &__text {
      font-size: 4.5rem;
    }
  }
}
</style>
