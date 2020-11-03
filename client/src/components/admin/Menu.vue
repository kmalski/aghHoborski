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
    <b-button class="blue-shadow menu__btn" variant="primary" @click="logout">
      Wyloguj
    </b-button>
    <app-question-uploader :id="uploaderId"></app-question-uploader>
    <app-question-selector :id="selectorId"></app-question-selector>
  </section>
</template>

<script>
import QuestionUploader from '@/components/admin/QuestionUploader';
import QuestionSelector from '@/components/admin/QuestionSelector';

export default {
  name: 'Menu',
  data() {
    return {
      uploaderId: 'uploader',
      selectorId: 'selector',
      actionCategories: [
        {
          name: 'Licytacja',
          isActive: false,
          actions: [
            {
              name: 'Zacznij licytację',
              action: this.dummy
            },
            {
              name: 'Zakończ licytację: wybierz kategorię',
              action: this.dummy
            },
            {
              name: 'Zakończ licytację: wygrano podpowiedź',
              action: this.dummy
            },
            {
              name: 'Zakończ licytację: wygrano czarną skrzynkę',
              action: this.dummy
            }
          ]
        },
        {
          name: 'Pytania',
          isActive: false,
          actions: [
            {
              name: 'Wygrali rundę',
              action: this.dummy
            },
            {
              name: 'Przegrali rundę',
              action: this.dummy
            },
            {
              name: 'Rozpocznij nową rundę',
              action: this.dummy
            }
          ]
        },
        {
          name: 'Podpowiedzi',
          isActive: false,
          actions: [
            {
              name: 'Zużyj podpowiedź',
              action: this.dummy
            },
            {
              name: 'Rozpocznij licytację o podpowiedź',
              action: this.dummy
            }
          ]
        },
        {
          name: 'Runda 2',
          isActive: false,
          actions: [
            {
              name: 'Zacznij 1:1',
              action: this.dummy
            },
            {
              name: 'Zacznij mistrzów',
              action: this.dummy
            }
          ]
        },
        {
          name: 'Ustawienia',
          isActive: false,
          actions: [
            {
              name: 'Dodaj własne pytania',
              action: this.uploadQuestions
            },
            {
              name: 'Wybierz pytania spośród istniejących',
              action: this.getAllQuestions
            },
            {
              name: 'Pokaż aktualne ustawienia gry',
              action: this.showGameSettings
            }
          ]
        }
      ]
    };
  },
  methods: {
    uploadQuestions() {
      this.$bvModal.show(this.uploaderId);
    },
    getAllQuestions() {
      this.$bvModal.show(this.selectorId);
    },
    showGameSettings() {},
    logout() {
      this.$router.push({ name: 'Login' });
      localStorage.removeItem('awanturaToken');
    },
    dummy() {}
  },
  components: {
    AppQuestionUploader: QuestionUploader,
    AppQuestionSelector: QuestionSelector
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
