<script>
export default {
  name: 'AnswerMixin',
  data() {
    return {
      question: {
        hints: []
      }
    };
  },
  methods: {
    setHints(hintValues) {
      this.question.hints = [];
      hintValues.forEach((value) => {
        this.question.hints.push({ value, isAnswer: false });
      });
    },
    getAnswer() {
      this.$socket.client.emit('getAnswer');
    }
  },
  sockets: {
    answer(data) {
      const answer = this.question.hints.find((hint) => hint.value === data.answer);
      answer.isAnswer = true;
    }
  }
};
</script>
