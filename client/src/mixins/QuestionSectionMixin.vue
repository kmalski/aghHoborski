<script>
import Separator from '@/components/shared/Separator.vue';

export default {
  name: 'QuestionSectionMixin',
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
  },
  methods: {
    transformCategory(category) {
      if (category === 'blackBox') return 'Czarna skrzynka';
      else if (category === 'hint') return 'Podpowiedź';
      else return category;
    },
    resetQuestionData() {
      this.question.category = '';
      this.question.content = '';
      this.question.hints = [];
      this.hintUsed = false;
    }
  },
  sockets: {
    currentQuestion(data) {
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
      this.resetQuestionData();
    },
    timeStarted(data) {
      this.seconds = data.value;
      this.timeIntervalID = setInterval(() => (this.seconds -= 1), 1000);
    },
    timeStopped() {
      clearInterval(this.timeIntervalID);
      this.seconds = null;
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
