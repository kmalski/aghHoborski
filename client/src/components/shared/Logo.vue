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

  &__text {
    margin: 0;
    font-size: 4.25rem;
    font-weight: 600;
    line-height: 2.4rem;
  }

  @include media-breakpoint-down(md) {
    .logo {
      &__text {
        width: 80%;
        font-size: 2.25rem;
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
}
</style>
