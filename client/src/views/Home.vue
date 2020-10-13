<template>
  <div class="home">
    <b-alert v-model="showDismissibleAlert" variant="warning" dismissible>
      {{ warningMsg }}
    </b-alert>
    <h1 class="title home__left">Awantura o Nauke</h1>
    <div class="home__right">
      <div>
        <app-button type="info" @click="createRoom">Stwórz pokój</app-button>
        <app-button type="info" @click="joinRoom">Dołącz do pokoju</app-button>
      </div>
      <form>
        <input v-model="roomName" placeholder="Nazwa pokoju" />
      </form>
    </div>
  </div>
</template>

<script>
import AppButton from '@/components/shared/AppButton.vue';

export default {
  name: 'Home',
  data: function() {
    return {
      roomName: '',
      warningMsg: '',
      showDismissibleAlert: false
    };
  },
  methods: {
    joinRoom() {
      this.$socket.client.emit('joinRoom', { name: this.roomName });
    },
    createRoom() {
      this.$socket.client.emit('createRoom', { name: this.roomName });
    }
  },
  sockets: {
    connect() {
      console.log('Socket connected');
    },
    roomCreated(room) {
      this.$router.push({ name: 'Administrator', params: { room: room.name } });
    },
    roomJoined(room) {
      this.$router.push({ name: 'Spectator', params: { room: room.name } });
    },
    info(msg) {
      console.log(msg);
    },
    warning(msg) {
      this.warningMsg = msg;
      this.showDismissibleAlert = true;
    }
  },
  components: {
    AppButton
  }
};
</script>

<style scoped lang="scss">
.alert {
  position: absolute;
  top: 5vh;
  width: 50%;
}

.home {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  width: 100vw;
  height: 100vh;

  &__left,
  &__right {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 1rem;
    width: 50vw;

    * {
      width: fit-content;
    }
  }
}
</style>
