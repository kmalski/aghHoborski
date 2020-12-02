<template>
  <div class="question-card">
    <div class="card-row">
      <label>Kategoria</label>
      <p>{{ category }}</p>
    </div>
    <div class="card-row">
      <label>Pytanie</label>
      <p>{{ question }}</p>
    </div>
    <div class="card-row">
      <label>Podpowiedzi</label>
      <div class="hint-list">
        <p v-for="hint in hints" :key="hint">{{ hint }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionCard',
  data() {
    return {
      category: '',
      question: '',
      hints: []
    };
  },
  created() {
    this.$socket.client.emit('getCurrentQuestion');
    this.$socket.client.on('currentQuestion', this.fillData);
  },
  methods: {
    fillData(data) {
      this.category = this.transformCategory(data.category);
      this.question = data.content;
      this.hints = data.hints;
    },
    transformCategory(category) {
      if (category === 'blackBox') return 'Czarna skrzynka';
      else if (category === 'hint') return 'Podpowiedź';
      else return category;
    },
    resetData() {
      this.category = '';
      this.question = '';
      this.hints = [];
    }
  },
  sockets: {
    auctionStarted(data) {
      this.category = this.transformCategory(data.category);
    },
    roundFinished() {
      this.resetData();
    },
    nextQuestion(data) {
      this.question = data.question;
      this.hints = data.hints;
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
  max-height: fit-content;
  min-height: 25vh;
  width: 35vw;
  margin: auto;

  label {
    font-weight: 600;
  }

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

      * {
        flex: 1 0 40%;
      }
    }
  }
}
</style>
