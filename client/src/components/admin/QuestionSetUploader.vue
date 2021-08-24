<template>
  <b-modal :id="id" v-model="visible" hide-footer title="Dodaj własne pytania">
    <b-alert class="modal-alert" v-model="alert.show" variant="warning" dismissible>
      {{ alert.msg }}
    </b-alert>
    <div>
      Przykładowe pytania dla obsługiwanych formatów danych:
      <div class="links">
        <a class="link" :href="'/files/Pytania.json'" download>JSON</a>
        <a class="link" :href="'/files/Pytania.xlsx'" download>Excel</a>
      </div>
    </div>
    <b-form @submit.stop.prevent="onSubmit">
      <b-form-file
        v-model="file"
        @input="readFile"
        :state="validation.state"
        accept=".json, .xls, .xlsx, .odt"
        browse-text="Wybierz plik"
        placeholder="Wybierz plik lub upuść go tutaj..."
        drop-placeholder="Przeciągnij i upuść plik tutaj..."
      ></b-form-file>
      <div class="mt-3">
        <strong> Wybrany plik: </strong>
        {{ file ? file.name : '' }}
      </div>
      <div v-if="jsonValidator.errors" class="errors">
        <strong> Błędy (ang.): </strong>
        <p class="error">{{ validation.errors | transformErrors }}</p>
      </div>
      <div class="buttons-wrapper">
        <b-button class="dark-shadow" size="sm" @click="$bvModal.hide(id)">Anuluj</b-button>
        <b-button class="blue-shadow" size="sm" type="submit" variant="primary" :disabled="!validation.state"
          >Dodaj
        </b-button>
      </div>
    </b-form>
  </b-modal>
</template>

<script>
import xlsx from 'xlsx';
import Ajv from 'ajv';
import ModalMixin from '@/mixins/ModalMixin';
import questionSetSchema from '@/assets/questionSetSchema.json';

const ajv = new Ajv();

export default {
  name: 'QuestionSetUploader',
  mixins: [ModalMixin],
  data() {
    return {
      validation: {
        state: null,
        errors: []
      },
      file: null,
      questionSet: null,
      jsonValidator: ajv.compile(questionSetSchema),
      reader: new FileReader()
    };
  },
  methods: {
    readFile() {
      const extension = this.file.name.split('.').pop();
      switch (extension) {
        case 'json':
          this.readJSON();
          break;
        case 'xls':
          this.readSheet();
          break;
        case 'xlsx':
          this.readSheet();
          break;
        case 'odt':
          this.readSheet();
          break;
        default:
          this.validation.state = false;
          this.validation.errors = ['Nieznany format danych'];
      }
    },
    readJSON() {
      this.reader.onload = (event) => {
        const parsedFile = JSON.parse(event.target.result);
        this.validate(parsedFile);
      };
      this.reader.readAsText(this.file);
    },
    readSheet() {
      this.reader.onload = (event) => {
        let binary = '';
        const bytes = new Uint8Array(event.target.result);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }

        const wb = xlsx.read(binary, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const sheet = xlsx.utils.sheet_to_json(ws, { header: 1 });

        const categories = [];
        for (let i = 1; i < sheet.length; ++i) {
          const row = sheet[i];
          const categoryName = row[0].trim();
          const category = categories.find((category) => category.name === categoryName);
          const question = { content: row[1].trim(), hints: row.slice(2).map((hint) => String(hint).trim()) };
          if (category) {
            category.questions.push(question);
          } else {
            categories.push({ name: categoryName, questions: [question] });
          }
        }
        this.validate({ categories });
      };
      this.reader.readAsArrayBuffer(this.file);
    },
    validate(parsedFile) {
      if (!this.jsonValidator(parsedFile)) {
        this.validation.state = false;
        this.validation.errors = this.jsonValidator.errors.map((error) => `${error.instancePath} ${error.message}`);
      } else {
        this.questionSet = parsedFile;
        this.validation.state = true;
        this.validation.errors = [];
      }
    },
    onSubmit() {
      this.$socket.client.emit('addQuestionSet', { name: this.file.name, questionSet: this.questionSet });
    }
  },
  filters: {
    transformErrors(errors) {
      let result = '';
      errors.forEach((error) => {
        result += `${error}\n`;
      });
      return result;
    }
  }
};
</script>

<style scoped lang="scss">
.links {
  margin-bottom: 1.5rem;
  text-align: left;

  > :first-child {
    margin-left: 0;
  }
}

.link {
  font-size: 1rem;
  margin: auto 0.5rem;
}

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
