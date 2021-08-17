<template>
  <b-modal :id="id" v-model="visible" hide-footer size="lg" lazy title="Wybierz pytania">
    <b-alert class="modal-alert" v-model="alert.show" variant="warning" dismissible>
      {{ alert.msg }}
    </b-alert>
    <b-table :fields="fields" :items="questions" sticky-header small striped hover head-variant="light" sort-icon-left>
      <template #cell(actions)="row">
        <div class="centered-col">
          <b-button size="sm" @click="changeQuestionSet(row.index)" variant="primary"> Wybierz</b-button>
          <b-button size="sm" @click="downloadQuestionSet(row.index)" variant="primary"> Pobierz</b-button>
          <b-button
            v-if="questions[row.index].owner === roomName"
            size="sm"
            @click="toggleVisibility(row.index)"
            variant="primary"
          >
            {{ questions[row.index].isPrivate ? 'Opublikuj' : 'Ukryj' }}
          </b-button>
        </div>
      </template>
    </b-table>
  </b-modal>
</template>

<script>
import ModalMixin from '@/mixins/ModalMixin';
import DownloadMixin from '@/mixins/DownloadMixin';

export default {
  name: 'QuestionSetSelector',
  mixins: [ModalMixin, DownloadMixin],
  data() {
    return {
      roomName: '',
      questions: [],
      fields: [
        { key: 'name', label: 'Nazwa', sortable: true, sortDirection: 'desc' },
        {
          key: 'createdAt',
          label: 'Data utworzenia',
          sortable: true,
          sortDirection: 'desc',
          formatter: (value) => {
            const date = new Date(value);
            return date.toLocaleString('pl-PL');
          }
        },
        { key: 'owner', label: 'Pokój', sortable: true, sortDirection: 'desc' },
        { key: 'actions', label: '', sortable: false }
      ]
    };
  },
  created() {
    this.$root.$on('bv::modal::show', (event) => {
      if (event.componentId === this.id) {
        this.$socket.client.emit('getAllQuestionSets');
        this.$socket.client.emit('getGameSettings');
      }
    });
  },
  methods: {
    changeQuestionSet(index) {
      this.$socket.client.emit('changeQuestionSet', { name: this.questions[index].name });
    },
    downloadQuestionSet(index) {
      this.$socket.client.emit('getQuestionSet', { name: this.questions[index].name });
    },
    toggleVisibility(index) {
      const question = this.questions[index];
      this.$socket.client.emit('changeVisibility', { name: question.name, isPrivate: !question.isPrivate });
    }
  },
  sockets: {
    allQuestionSets(data) {
      this.questions = data.questionSets;
      this.roomName = data.roomName;
      console.log(this.roomName);
    },
    questionSet(data) {
      if (this.visible && data.name) {
        this.download(JSON.stringify(data.questionSet, null, 2), data.name, 'text/plain');
      }
    },
    visibilityChanged(data) {
      const question = this.questions.find((question) => question.name === data.name);
      question.isPrivate = data.isPrivate;
    }
  }
};
</script>

<style scoped lang="scss">
.centered-col {
  display: flex;
  flex-direction: row;
  justify-content: left;

  * {
    margin-right: 0.5rem;
  }

  > :last-child {
    margin-right: 0;
  }
}
</style>
