<template>
  <b-modal :id="id" hide-footer title="Ustawienia gry">
    <div class="flex-column">
      <div class="setting" v-for="setting in settings" :key="setting.name">
        <label>{{ setting.name | addSpace }}</label>
        <p>{{ setting.value }}</p>
      </div>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'GameSettings',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      settings: []
    };
  },
  mounted() {
    this.$root.$on('bv::modal::show', event => {
      if (event.componentId === this.id) {
        this.$socket.client.emit('getGameSettings');
      }
    });
  },
  sockets: {
    gameSettings(data) {
      this.settings = data;
    }
  },
  filters: {
    addSpace(text) {
      return text + ': ';
    }
  }
};
</script>

<style scoped lang="scss">
.setting {
  display: grid;
  grid-template: 1fr / 2fr 2fr;
  align-items: center;
  justify-content: space-between;
  margin: 0.5rem auto;
  width: 100%;

  label {
    font-weight: 500;
    margin: 0;
  }

  p {
    margin: 0;
  }

  > :first-child {
    text-align: center;
    justify-self: start;
    align-self: center;
    grid-area: 1 / 1 / 2 / 2;
  }

  > :last-child {
    text-align: center;
    align-self: center;
    justify-self: start;
    grid-area: 1 / 2 / 2 / 3;
  }
}
</style>
