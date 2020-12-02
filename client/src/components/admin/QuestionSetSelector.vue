<template>
  <b-modal :id="id" v-model="visible" hide-footer size="lg" lazy title="Wybierz pytania">
    <b-alert class="modal-alert" v-model="alert.show" variant="warning" dismissible>
      {{ alert.msg }}
    </b-alert>
    <b-table :fields="fields" :items="questions" sticky-header small striped hover head-variant="light" sort-icon-left>
      <template #cell(actions)="row">
        <div class="centered-col">
          <b-button size="sm" @click="changeQuestionSet(row.index)" variant="primary">
            Wybierz
          </b-button>
          <b-button size="sm" @click="downloadQuestionSet(row.index)" variant="primary">
            Pobierz
          </b-button>
        </div>
      </template>
    </b-table>
  </b-modal>
</template>

<script>
import ModalMixin from '@/components/shared/ModalMixin';
import DownloadMixin from '@/components/shared/DownloadMixin';

export default {
  name: 'QuestionSetSelector',
  mixins: [ModalMixin, DownloadMixin],
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
        { key: 'owner', label: 'Pokój', sortable: true, sortDirection: 'desc' },
        { key: 'actions', label: '', sortable: false }
      ]
    };
  },
  mounted() {
    this.$root.$on('bv::modal::show', event => {
      if (event.componentId === this.id) {
        this.$socket.client.emit('getAllQuestionSets');
      }
    });
  },
  methods: {
    changeQuestionSet(index) {
      this.$socket.client.emit('changeQuestionSet', { name: this.questions[index].name });
    },
    downloadQuestionSet(index) {
      this.$socket.client.emit('getQuestionSet', { name: this.questions[index].name });
    }
  },
  sockets: {
    allQuestionSets(questionSets) {
      this.questions = questionSets;
    },
    questionSet(data) {
      if (this.visible && data.name) {
        this.download(JSON.stringify(data.questionSet, null, 2), data.name, 'text/plain');
      }
    }
  }
};
</script>

<style scoped lang="scss">
.centered-col {
  display: flex;
  flex-direction: row;
  justify-content: center;

  > :first-child {
    margin-right: 1rem;
  }
}
</style>
