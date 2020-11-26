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
import Separator from '@/components/shared/Separator.vue';

export default {
  name: 'QuestionSection',
  data() {
    return {
      question: {
        number: 0,
        category: null,
        content: null,
        hintUsed: false,
        hints: []
      },
      backgroundColor: null,
      stageNumber: 1,
      seconds: null,
      timeIntervalID: null
    };
  },
  created() {
    this.$socket.client.emit('getCurrentQuestion');
    this.$socket.client.on('currentQuestion', this.fillData);
  },
  methods: {
    fillData(data) {
      this.question.number = data.roundNumber;
      this.stageNumber = data.stageNumber;
      switch (data.roundStage) {
        case 'auction':
          this.question.category = this.transformCategory(data.category);
          this.backgroundColor = 'neutral';
          break;
        case 'answering':
          this.question.content = data.content;
          this.question.hintUsed = data.hintUsed;
          this.question.hints = data.hints;
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
      this.backgroundColor = 'neutral';
    },
    auctionFinished(data) {
      this.backgroundColor = data.winningTeam;
      this.question.category = null;
    },
    nextQuestion(data) {
      this.question.content = data.question;
    },
    roundFinished() {
      this.backgroundColor = null;
      this.question.category = null;
      this.question.content = null;
      this.question.hints = [];
      this.question.hintUsed = false;
    },
    timeStarted(data) {
      this.seconds = data.value;
      this.timeIntervalID = setInterval(() => (this.seconds -= 1), 1000);
    },
    timeStopped() {
      clearInterval(this.timeIntervalID);
      this.seconds = null;
    },
    hintUsed(data) {
      this.question.hintUsed = true;
      this.question.hints = data.hints;
    },
    secondStageStarted() {
      this.stageNumber = 2;
    }
  },
  filters: {
    timeFormat(seconds) {
      if (seconds === null) return null;
      if (seconds < 0) return '00:00';

      let minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;

      minutes = minutes > 9 ? minutes : '0' + minutes;
      seconds = seconds > 9 ? seconds : '0' + seconds;
      return `${minutes}:${seconds}`;
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
  border-radius: 20px;
  color: $font-color;

  .timer {
    font-weight: 500;
  }
}

.question {
  width: 100%;
  font-size: 2rem;
  margin: 0;

  &__category {
    text-align: center;
    padding: 0.15rem 0;
  }

  &__content {
    text-align: center;
    padding: 0.15rem 0;
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
