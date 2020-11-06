<template>
  <b-modal class="question-selector" :id="id" hide-footer size="lg" title="Wybierz pytania">
    <b-alert class="modal-alert" v-model="showAlert" variant="warning" dismissible>
      {{ msg }}
    </b-alert>
    <b-table :fields="fields" :items="questions" sticky-header small striped hover head-variant="light">
      <template #cell(actions)="row">
        <b-button size="sm" @click="changeQuestionSet(row.index)" variant="primary" class="mr-1">
          Wybierz
        </b-button>
      </template>
    </b-table>
  </b-modal>
</template>

<script>
export default {
  name: 'QuestionSelector',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      questions: [],
      fields: [
        { key: 'name', label: 'Nazwa', sortable: true, sortDirection: 'desc' },
        {
          key: 'createdAt',
          label: 'Data utworzenia',
          sortable: true,
          sortDirection: 'desc',
          formatter: value => {
            const date = new Date(value);
            return date.toLocaleString('pl-PL');
          }
        },
        { key: 'actions', label: '' }
      ],
      msg: '',
      showAlert: false
    };
  },
  mounted() {
    this.$socket.client.emit('getAllQuestionSets');
  },
  methods: {
    changeQuestionSet(index) {
      this.$socket.client.emit('changeQuestionSet', { name: this.questions[index].name });
    }
  },
  sockets: {
    fail(msg) {
      this.msg = msg;
      this.showAlert = true;
    },
    success() {
      this.$bvModal.hide(this.id);
    },
    allQuestionSets(questionSets) {
      this.questions = questionSets;
    }
  }
};
</script>

<style scoped lang="scss">
.modal-alert {
  font-size: 0.9rem;
}
</style>
