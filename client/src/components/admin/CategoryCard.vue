<template>
  <div class="category-card">
    <div class="card-row">
      <label>Kategoria</label>
      <p>{{ category }}</p>
    </div>
    <div class="card-row">
      <label>Pytanie</label>
      <p>{{ question }}</p>
    </div>
    <div class="card-row">
      <label>Podpowiedź</label>
      <div class="hint-list">
        <p v-for="hint in hints" :key="hint">{{ hint }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryCard',
  data() {
    return {
      category: 'Jakaś kategoria',
      question: `Pytanie pytanie pytanie pytanie pytanie
                pytanie pytanie pytanie pytanie pytanie
                pytanie pytanie pytanie pytanie pytanie ?`,
      hints: ['Podpowiedź1', 'Podpowiedź2', 'Podpowiedź3', 'Podpowiedź4']
    };
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.category-card {
  @extend .base-card;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-height: fit-content;
  max-width: 35vw;
  margin: auto;

  label {
    font-weight: 500;
  }

  .card-row {
    display: grid;
    grid-template: 1fr / 30% 70%;
    margin: 0.25rem auto;
    width: 100%;

    > :first-child {
      text-align: left;
      place-self: start;
      grid-area: 1 / 1 / 2 / 2;
    }

    > :last-child {
      place-self: start;
      text-align: left;
      grid-area: 1 / 2 / 2 / 3;
    }

    .hint-list {
      display: flex;
      flex-flow: row wrap;

      * {
        flex: 1 0 40%;
      }
    }
  }
}
</style>
