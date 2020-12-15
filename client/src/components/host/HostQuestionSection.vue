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
      <div v-show="question.content" class="question__hints">
        <p v-for="hint in question.hints" :key="hint.value" :class="{ answer: hint.isAnswer }">{{ hint.value }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import AnswerMixin from '@/mixins/AnswerMixin';
import QuestionSectionMixin from '@/mixins/QuestionSectionMixin';

export default {
  name: 'HostQuestionSection',
  mixins: [QuestionSectionMixin, AnswerMixin],
  sockets: {
    currentQuestion(data) {
      this.question.number = data.roundNumber;
      this.stageNumber = data.stageNumber;
      if (data.roundStage === 'auction') {
        this.question.category = this.transformCategory(data.category);
        this.backgroundColor = 'neutral';
      } else if (data.roundStage === 'answering') {
        this.question.content = data.content;
        this.question.hintUsed = data.hintUsed;
        this.setHints(data.hints);
        this.backgroundColor = data.winningTeam ? data.winningTeam : 'neutral';
        this.getAnswer();
      }
    },
    nextQuestion(data) {
      this.question.content = data.question;
      this.setHints(data.hints);
      this.getAnswer();
    }
  }
};
</script>

<style lang="scss">
@import '../../scss/main.scss';

.answer {
  color: black;
  font-weight: 900;
}
</style>
