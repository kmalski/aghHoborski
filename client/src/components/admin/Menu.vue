<template>
  <section class="menu">
    <h5>AWANTURA O NAUKE</h5>
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
          <li
            v-for="action in category.actions"
            :key="action.name"
            class="inner-li"
            @click.stop="dummy"
          >
            {{ action.name }}
          </li>
        </ul>
      </li>
    </ul>
    <b-button class="blue-shadow logut-btn" variant="primary" @click="logout">
      Wyloguj
    </b-button>
  </section>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      actionCategories: [
        {
          name: 'Licytacja',
          isActive: false,
          actions: [
            {
              name: 'Zacznij licytacje'
            },
            {
              name: 'Skończ licytację i daj podpowiedź'
            },
            {
              name: 'Skończ licytację i daj wygrać czarną skrzynkę'
            }
          ]
        },
        {
          name: 'Pytania',
          isActive: false,
          actions: [
            {
              name: 'Wygrali rundę'
            },
            {
              name: 'Nachapali się zwycięstwem'
            },
            {
              name: 'Przegrali rundę'
            }
          ]
        },
        {
          name: 'Podpowiedzi',
          isActive: false,
          actions: [
            {
              name: 'Pokaż podpowiedź'
            },
            {
              name: 'Zaoferuj podpowiedź'
            },
            {
              name: 'Nie przyjmij podpowiedzi'
            }
          ]
        },
        {
          name: 'Runda 2',
          isActive: false,
          actions: [
            {
              name: 'Zacznij 1:1'
            },
            {
              name: 'Zacznij mistrzów'
            }
          ]
        }
      ]
    };
  },
  methods: {
    dummy() {},
    logout() {
      this.$router.push({ name: 'Login' });
      localStorage.removeItem('awanturaToken');
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.menu {
  position: relative;
  left: 0;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  text-align: left;
  width: 15vw;
  min-height: 100vh;
  padding: 1rem;
  background-color: $menu-background-color;
  color: $menu-font-color;
  font-size: 0.75rem;

  hr {
    border: 1px solid $menu-separator-color;
    background: $menu-separator-color;
    width: 100%;
    margin: 1.5rem auto;
  }

  li:hover {
    background-color: $blue-button-color;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .outer-ul {
    list-style-type: none;
    padding: 0;
    flex: 1 0;

    .outer-li {
      padding: 0.3rem 0;
      font-weight: bold;

      .inner-ul {
        list-style-type: none;
        padding: 0 0.5rem;

        .inner-li {
          padding: 0.4rem 0;
          font-weight: normal;
        }
      }
    }
  }

  .logut-btn {
    @include base-btn(1rem, 100%);
    bottom: 0;
    place-self: flex-end;
  }
}
</style>
