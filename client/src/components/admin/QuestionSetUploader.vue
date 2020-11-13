<template>
  <b-modal :id="id" hide-footer title="Dodaj własne pytania">
    <b-alert class="modal-alert" v-model="showAlert" variant="warning" dismissible>
      {{ msg }}
    </b-alert>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-file
        v-model="questionFile"
        :state="Boolean(questionFile)"
        accept=".json"
        browse-text="Wybierz plik"
        placeholder="Wybierz plik lub upuść go tutaj..."
        drop-placeholder="Przeciągnij i upuść plik tutaj..."
      ></b-form-file>
      <div class="mt-3">
        <strong> Wybrany plik: </strong>
        {{ questionFile ? questionFile.name : '' }}
      </div>
      <div class="buttons-wrapper">
        <b-button class="blue-shadow" size="sm" type="submit" variant="primary">Dodaj</b-button>
        <b-button class="dark-shadow" size="sm" @click="$bvModal.hide(id)">Anuluj</b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  name: 'QuestionSetUploader',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      questionFile: null,
      msg: '',
      showAlert: false
    };
  },
  methods: {
    onSubmit() {
      this.$socket.client.emit('addQuestionSet', { name: this.questionFile.name, file: this.questionFile });
    }
  },
  sockets: {
    fail(msg) {
      this.msg = msg;
      this.showAlert = true;
    },
    success() {
      this.$bvModal.hide(this.id);
    }
  }
};
</script>

<style scoped lang="scss">
.buttons-wrapper {
  float: right;
  display: flex;
  flex-flow: row nowrap;
  width: 50%;
  margin-top: 1rem;
  justify-content: flex-end;

  > :last-child {
    margin-left: 0.5rem;
  }
}
</style>
