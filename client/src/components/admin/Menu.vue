<template>
  <section class="menu">
    <h5>AWANTURA O NAUKĘ</h5>
    <hr />
    <ul class="outer-ul">
      <li
        v-for="category in actionCategories"
        :key="category.name"
        class="outer-li"
        @click="category.isActive = !category.isActive"
      >
        {{ category.name }}
        <ul class="inner-ul" v-show="category.isActive">
          <li v-for="action in category.actions" :key="action.name" class="inner-li" @click.stop="action.action">
            {{ action.name }}
          </li>
        </ul>
      </li>
    </ul>
    <b-button class="blue-shadow menu__btn" variant="primary" @click="logout"> Wyloguj </b-button>
    <app-game-settings :id="settingsId"></app-game-settings>
    <app-category-selector :id="categoryId"></app-category-selector>
    <app-question-set-editor :id="editorId"></app-question-set-editor>
    <app-question-set-uploader :id="uploaderId"></app-question-set-uploader>
    <app-question-set-selector :id="selectorId"></app-question-set-selector>
  </section>
</template>

<script>
import GameSettings from '@/components/admin/GameSettings';
import CategorySelector from '@/components/admin/CategorySelector';
import QuestionSetEditor from '@/components/admin/QuestionSetEditor';
import QuestionSetUploader from '@/components/admin/QuestionSetUploader';
import QuestionSetSelector from '@/components/admin/QuestionSetSelector';

export default {
  name: 'Menu',
  data() {
    return {
      editorId: 'editor',
      uploaderId: 'uploader',
      categoryId: 'category',
      selectorId: 'selector',
      settingsId: 'settings',
      actionCategories: [
        {
          name: 'Licytacja',
          isActive: false,
          actions: [
            {
              name: 'Zacznij licytację...',
              action: this.startAuction
            },
            {
              name: 'Zakończ licytację',
              action: this.finishAuction
            },
            {
              name: 'Anuluj licytację',
              action: this.cancelAuction
            }
          ]
        },
        {
          name: 'Pytania',
          isActive: false,
          actions: [
            {
              name: 'Wygrali rundę',
              action: this.markCorrectAnswer
            },
            {
              name: 'Przegrali rundę',
              action: this.markWrongAnswer
            },
            {
              name: 'Zakończ rundę',
              action: this.finishRound
            },
            {
              name: 'Pomiń pytanie',
              action: this.skipQuestion
            }
          ]
        },
        {
          name: 'Podpowiedzi',
          isActive: false,
          actions: [
            {
              name: 'Zużyj podpowiedź',
              action: this.useHint
            },
            {
              name: 'Rozpocznij licytację o podpowiedź',
              action: this.startHintAuction
            }
          ]
        },
        {
          name: 'Runda 2',
          isActive: false,
          actions: [
            {
              name: 'Zacznij finał',
              action: this.startSecondStage
            },
            {
              name: 'Zacznij 1:1',
              action: this.startOneOnOne
            }
          ]
        },
        {
          name: 'Ustawienia',
          isActive: false,
          actions: [
            {
              name: 'Dodaj własną pule pytań...',
              action: this.uploadQuestions
            },
            {
              name: 'Edytuj pule pytań...',
              action: this.editQuestionSet
            },
            {
              name: 'Wybierz pule pytań spośród istniejących...',
              action: this.getAllQuestions
            },
            {
              name: 'Pokaż aktualne ustawienia gry...',
              action: this.showGameSettings
            },
            {
              name: 'Zresetuj całą grę',
              action: this.resetGame
            }
          ]
        }
      ]
    };
  },
  methods: {
    startAuction() {
      this.$bvModal.show(this.categoryId);
    },
    finishAuction() {
      this.$socket.client.emit('finishAuction');
    },
    cancelAuction() {
      this.$socket.client.emit('cancelAuction');
    },
    markCorrectAnswer() {
      this.$socket.client.emit('markCorrectAnswer');
    },
    markWrongAnswer() {
      this.$socket.client.emit('markWrongAnswer');
    },
    finishRound() {
      this.$socket.client.emit('startNewRound');
    },
    skipQuestion() {
      this.$socket.client.emit('skipQuestion');
    },
    useHint() {
      this.$socket.client.emit('useHint');
    },
    startHintAuction() {
      this.$socket.client.emit('startHintAuction');
    },
    startSecondStage() {
      this.$socket.client.emit('startSecondStage');
    },
    startOneOnOne() {
      this.$socket.client.emit('startOneOnOne');
    },
    uploadQuestions() {
      this.$bvModal.show(this.uploaderId);
    },
    editQuestionSet() {
      this.$bvModal.show(this.editorId);
    },
    getAllQuestions() {
      this.$bvModal.show(this.selectorId);
    },
    showGameSettings() {
      this.$bvModal.show(this.settingsId);
    },
    async resetGame() {
      const confirmation = await this.$bvModal.msgBoxConfirm(`Czy na pewno chcesz rozpocząć grę od nowa?`, {
        centered: true,
        size: 'sm',
        buttonSize: 'sm',
        okTitle: 'Tak',
        cancelTitle: 'Nie'
      });
      if (confirmation) this.$socket.client.emit('resetGame');
    },
    logout() {
      this.$router.push({ name: 'AdminLogin' });
      localStorage.removeItem('awanturaToken');
    }
  },
  components: {
    AppGameSettings: GameSettings,
    AppCategorySelector: CategorySelector,
    AppQuestionSetEditor: QuestionSetEditor,
    AppQuestionSetUploader: QuestionSetUploader,
    AppQuestionSetSelector: QuestionSetSelector
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.menu {
  left: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  text-align: left;
  width: 16vw;
  height: 100vh;
  padding: 1rem 0;
  background-color: $menu-background-color;
  color: $menu-font-color;
  font-size: 0.75rem;

  h5 {
    padding: 0 1rem;
  }

  hr {
    border: none;
    border-bottom: 1px solid $menu-separator-color;
    background: $menu-separator-color;
    width: calc(100% - 2rem);
    margin: 1.5rem 1rem;
  }

  .outer-ul {
    list-style-type: none;
    padding: 0 1rem;
    flex: 1 0;
    overflow-y: auto;

    .outer-li {
      padding: 0.3rem 1rem;
      font-weight: bold;
      width: calc(100% + 2rem);
      transform: translateX(-1rem);

      &:hover {
        cursor: pointer;
        background-color: $menu-section-color;
      }

      .inner-ul {
        list-style-type: none;
        padding: 0 0.5rem;

        .inner-li {
          padding: 0.4rem 0.5rem;
          font-weight: normal;
          width: calc(100% + 1rem);
          transform: translateX(-0.5rem);

          &:hover {
            border-radius: 0.25rem;
            cursor: pointer;
            background-color: $blue-button-color;
          }
        }
      }
    }
  }

  &__btn {
    @include base-btn(1rem, calc(100% - 2rem));
    bottom: 0;
    place-self: flex-end;
    padding: 0.4rem;
    transform: translateX(-1rem);
  }
}
</style>
