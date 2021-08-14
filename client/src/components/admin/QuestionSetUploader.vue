<template>
  <b-modal :id="id" v-model="visible" hide-footer title="Dodaj własne pytania">
    <b-alert class="modal-alert" v-model="alert.show" variant="warning" dismissible>
      {{ alert.msg }}
    </b-alert>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-file
        v-model="questionFile"
        @input="readFile"
        :state="valid"
        accept=".json"
        browse-text="Wybierz plik"
        placeholder="Wybierz plik lub upuść go tutaj..."
        drop-placeholder="Przeciągnij i upuść plik tutaj..."
      ></b-form-file>
      <div class="mt-3">
        <strong> Wybrany plik: </strong>
        {{ questionFile ? questionFile.name : '' }}
      </div>
      <div v-if="validate.errors" class="errors">
        <strong> Błędy (ang.): </strong>
        <p class="error">{{ validate.errors | transformErrors }}</p>
      </div>
      <div class="buttons-wrapper">
        <b-button class="dark-shadow" size="sm" @click="$bvModal.hide(id)">Anuluj</b-button>
        <b-button class="blue-shadow" size="sm" type="submit" variant="primary" :disabled="!valid">Dodaj</b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import Ajv from 'ajv';
import ModalMixin from '@/mixins/ModalMixin';
import questionSetSchema from '@/assets/questionSetSchema.json';

const ajv = new Ajv();

export default {
  name: 'QuestionSetUploader',
  mixins: [ModalMixin],
  data() {
    return {
      questionFile: null,
      questionText: null,
      validate: ajv.compile(questionSetSchema),
      reader: new FileReader()
    };
  },
  computed: {
    valid() {
      if (this.questionText === null) return null;
      return this.validate(JSON.parse(this.questionText));
    }
  },
  methods: {
    readFile() {
      this.reader.onload = (event) => (this.questionText = event.target.result);
      this.reader.readAsText(this.questionFile);
    },
    onSubmit() {
      this.$socket.client.emit('addQuestionSet', { name: this.questionFile.name, file: this.questionFile });
    }
  },
  filters: {
    transformErrors(errors) {
      let result = '';
      errors.forEach((error) => {
        result += `${error.dataPath} ${error.message}\n`;
      });
      return result;
    }
  }
};
</script>

<style scoped lang="scss">
.errors {
  margin: 0.25rem auto;
}

.error {
  font-size: 0.8rem;
  margin-bottom: 0;
}

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
