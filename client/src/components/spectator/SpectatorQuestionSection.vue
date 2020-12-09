<template>
  <section class="question-section">
    <app-separator>
      <p class="ml-5">PYTANIE {{ question.number }}</p>
      <p class="timer">{{ this.seconds | timeFormat }}</p>
      <p class="mr-5">ETAP {{ stageNumber }}</p>
    </app-separator>
    <div class="question" :class="{ [backgroundColor + '-background']: backgroundColor }">
      <p v-show="question.category" class="question__category">{{ question.category }}</p>
      <p v-show="question.content" class="question__content">{{ question.content }}</p>
      <div v-show="question.hintUsed" class="question__hints">
        <p v-for="hint in question.hints" :key="hint">{{ hint }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import QuestionSectionMixin from '@/mixins/QuestionSectionMixin';

export default {
  name: 'SpectatorQuestionSection',
  mixins: [QuestionSectionMixin],
  sockets: {
    hintUsed(data) {
      this.question.hintUsed = true;
      this.question.hints = data.hints;
    }
  }
};
</script>
