<template>
  <section class="question-section">
    <app-separator>
      <p class="ml-5">PYTANIE {{ question.number }}</p>
      <p class="mr-5">ETAP {{ stageNumber }}</p>
    </app-separator>
    <div class="question">
      <p class="question__category">{{ question.category }}</p>
      <p class="question__content">{{ question.content }}</p>
      <div class="question__hints">
        <p v-for="hint in question.hints" :key="hint">{{ hint }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import Separator from '@/components/shared/Separator.vue';

export default {
  name: 'QuestionSection',
  data() {
    return {
      question: {
        number: 0,
        content:
          'Jaka tkanka, wchodzaca w skład zespołu tkanek przewodzących, transportuje substancje odżywcze wytworzone w procesie fotosyntezy?',
        hints: ['łyko', 'drewno', 'miazga', 'skórka'],
        category: 'Biologia'
      },
      stageNumber: 1
    };
  },
  components: {
    AppSeparator: Separator
  }
};
</script>

<style scoped lang="scss">
.question-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 3rem;
  width: 90%;
  overflow: hidden;
  border-radius: 25px;
}

.question {
  width: 100%;
  padding: 1rem auto;
  font-size: 2rem;

  &__category {
    background-color: whitesmoke;
    color: black;
  }

  &__content {
    text-align: center;
  }

  &__hints {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 1rem;
  }
}
</style>
