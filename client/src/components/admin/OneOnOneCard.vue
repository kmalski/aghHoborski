<template>
  <div class="one-on-one-card">
    <label>Kategorie 1:1</label>
    <div class="categories">
      <b-form-checkbox
        v-for="category in categories"
        :key="category"
        :disabled="disabled"
        >{{ category }}</b-form-checkbox
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'OneOnOneCard',
  props: {
    disabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      categories: [
        'Kategoria 1',
        'Kategoria 2',
        'Kategoria 3',
        'Kategoria 4',
        'Kategoria 5',
        'Kategoria 6',
        'Kategoria 7',
        'Kategoria 8',
        'Kategoria 9',
        'Kategoria 10'
      ]
    };
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.one-on-one-card {
  @extend .base-card;

  display: flex;
  flex-flow: column wrap;
  align-items: center;
  justify-content: center;
  max-height: fit-content;
  max-width: 20vw;
  margin: auto;

  .categories {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;

    * {
      flex: 1 0 34%;
      text-align: left;
    }
  }

  label {
    text-align: left;
    width: 100%;
    font-weight: 500;
  }
}
</style>
