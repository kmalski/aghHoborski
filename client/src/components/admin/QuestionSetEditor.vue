<template>
  <b-modal
    :id="id"
    v-model="visible"
    size="lg"
    :title="'Edycja puli pytań: ' + name"
    header-class="header-color"
    body-class="static-modal-body"
    hide-footer
    static
    lazy
  >
    <div class="question-set-editor">
      <b-alert class="modal-alert" v-model="alert.show" variant="warning" dismissible>
        {{ alert.msg }}
      </b-alert>
      <v-jsoneditor ref="editor" v-model="questionSet" :options="options" height="100%" class="editor"></v-jsoneditor>
      <div class="form-row">
        <div v-show="notOwned">
          <p>Edycja możliwa jest jedynie w przypadku wybrania własnego (dodanego w danym pokoju) zestawu pytań.</p>
          <p>Pobierz wybraną pule pytań i dodaj jaką własną.</p>
        </div>
        <div class="buttons-wrapper" v-show="!notOwned">
          <b-button class="dark-shadow" @click="$bvModal.hide(id)">Anuluj</b-button>
          <b-button class="blue-shadow" @click="saveChanges" :disabled="!jsonValid" type="submit" variant="primary"
            >Zapisz</b-button
          >
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import VJsoneditor from 'v-jsoneditor';
import questionSetSchema from '@/assets/questionSetSchema.json';
import ModalMixin from '@/mixins/ModalMixin';

export default {
  name: 'QuestionSetEditor',
  mixins: [ModalMixin],
  data() {
    return {
      notOwned: false,
      name: null,
      jsonValid: false,
      questionSet: {},
      options: {
        modes: ['code', 'tree'],
        onValidationError: this.onValidationError,
        schema: questionSetSchema
      }
    };
  },
  mounted() {
    this.$root.$on('bv::modal::show', (event) => {
      if (event.componentId === this.id) {
        this.$socket.client.emit('getQuestionSet');
      }
    });
  },
  methods: {
    onValidationError(errors) {
      this.jsonValid = errors.length === 0;
    },
    saveChanges() {
      const file = JSON.stringify(this.questionSet);
      this.$socket.client.emit('addQuestionSet', { name: this.name, file: file });
    }
  },
  sockets: {
    questionSet(data) {
      if (this.visible && data.name) {
        this.name = data.name;
        this.questionSet = data.questionSet;
        this.notOwned = data.owner !== this.$route.params.room;
      }
    }
  },
  components: {
    VJsoneditor
  }
};
</script>

<style scoped lang="scss">
.question-set-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: black;

  .editor {
    height: fit-content;
  }

  .form-row {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 1rem 0 0;
    justify-content: flex-start;

    p {
      margin: 0 auto;
    }
  }

  .buttons-wrapper {
    justify-self: flex-end;
    flex-basis: 25%;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    justify-content: flex-end;
    margin-left: auto;

    > :last-child {
      margin-left: 0.5rem;
    }
  }
}
</style>
