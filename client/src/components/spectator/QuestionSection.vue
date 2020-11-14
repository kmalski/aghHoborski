<template>
  <section class="question-section">
    <app-separator>
      <p class="ml-5">PYTANIE {{ question.number }}</p>
      <p class="mr-5">ETAP {{ stageNumber }}</p>
    </app-separator>
    <div class="question" :class="{ [backgroundColor + '-background']: backgroundColor }">
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
        category: '',
        content: '',
        hints: []
      },
      backgroundColor: '',
      stageNumber: 1
    };
  },
  created() {
    this.$socket.client.emit('getCurrentQuestion');
    this.$socket.client.on('currentQuestion', this.fillData);
  },
  methods: {
    fillData(data) {
      this.question.number = data.roundNumber;
      switch (data.roundStage) {
        case 'auction':
          this.question.category = this.transformCategory(data.category);
          break;
        case 'answering':
          this.question.content = data.content;
          this.backgroundColor = data.winningTeam;
          break;
      }
    },
    transformCategory(category) {
      if (category === 'blackBox') return 'Czarna skrzynka';
      else if (category === 'hint') return 'Podpowiedź';
      else return category;
    }
  },
  sockets: {
    auctionStarted(data) {
      this.question.category = this.transformCategory(data.category);
      this.question.number = data.roundNumber;
    },
    auctionFinished(data) {
      this.backgroundColor = data.winningTeam;
      this.question.category = '';
    },
    nextQuestion(data) {
      this.question.content = data.question;
    }
  },
  components: {
    AppSeparator: Separator
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.question-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 3rem;
  width: 90%;
  overflow: hidden;
  border-radius: 25px;
  color: $font-color;
}

.question {
  width: 100%;
  padding: 1rem auto;
  font-size: 2rem;

  &__category {
    background-color: $neutral-color;
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
