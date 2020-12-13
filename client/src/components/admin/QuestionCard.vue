<template>
  <div class="question-card">
    <div class="card-row">
      <label class="card-label">Kategoria</label>
      <p>{{ question.category }}</p>
    </div>
    <div class="card-row">
      <label class="card-label">Pytanie</label>
      <p>{{ question.content }}</p>
    </div>
    <div class="card-row">
      <label class="card-label">Podpowiedzi</label>
      <div class="hint-list">
        <p v-for="hint in question.hints" :key="hint.value" :class="{ answer: hint.isAnswer }">{{ hint.value }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import AnswerMixin from '@/mixins/AnswerMixin';

export default {
  name: 'QuestionCard',
  mixins: [AnswerMixin],
  data() {
    return {
      question: {
        category: '',
        content: '',
        hints: []
      }
    };
  },
  created() {
    this.$socket.client.emit('getCurrentQuestion');
  },
  methods: {
    transformCategory(category) {
      if (category === 'blackBox') return 'Czarna skrzynka';
      else if (category === 'hint') return 'Podpowiedź';
      else return category;
    },
    resetData() {
      this.question.category = '';
      this.question.content = '';
      this.question.hints = [];
    }
  },
  sockets: {
    currentQuestion(data) {
      this.question.category = this.transformCategory(data.category);
      this.question.content = data.content;
      if (data.content) {
        this.setHints(data.hints);
        this.getAnswer();
      }
    },
    auctionStarted(data) {
      this.question.category = this.transformCategory(data.category);
    },
    categoryConfirmed(data) {
      this.question.category = data.category;
    },
    roundFinished() {
      this.resetData();
    },
    nextQuestion(data) {
      this.question.content = data.question;
      this.setHints(data.hints);
      this.getAnswer();
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.question-card {
  @extend .base-card;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 35vh;
  width: 30vw;
  margin: auto;

  .card-row {
    display: grid;
    grid-template: 1fr / 30% 70%;
    margin: auto;
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
      justify-content: space-between;
      width: 100%;

      .answer {
        color: $blue-button-color;
        font-weight: 900;
      }

      * {
        flex: 1 0 40%;
      }
    }
  }
}
</style>
