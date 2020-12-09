<template>
  <b-modal :id="id" v-model="visible" hide-footer title="Dodaj własne pytania">
    <b-alert class="modal-alert" v-model="alert.show" variant="warning" dismissible>
      {{ alert.msg }}
    </b-alert>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-file
        v-model="questionFile"
        :state="fileValid"
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
        <b-button class="dark-shadow" size="sm" @click="$bvModal.hide(id)">Anuluj</b-button>
        <b-button class="blue-shadow" size="sm" type="submit" variant="primary">Dodaj</b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import ModalMixin from '@/mixins/ModalMixin';

export default {
  name: 'QuestionSetUploader',
  mixins: [ModalMixin],
  data() {
    return {
      questionFile: null
    };
  },
  computed: {
    fileValid() {
      if (this.questionFile === null) return null;
      return Boolean(this.questionFile);
    }
  },
  methods: {
    onSubmit() {
      this.$socket.client.emit('addQuestionSet', { name: this.questionFile.name, file: this.questionFile });
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
