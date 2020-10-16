<template>
  <div class="home">
    <b-alert class="alert-position" v-model="showAlert" variant="warning" dismissible>
      {{ warningMsg }}
    </b-alert>
    <app-status-icon />

    <h1 class="home__left title">Awantura o Naukę</h1>

    <div class="home__right">
      <b-form @submit.stop.prevent>
        <b-form-group id="room-name-group" label="Nazwa pokoju:" label-for="room-name">
          <b-form-input
            id="room-name"
            v-model="form.name"
            placeholder="Nazwa pokoju"
            trim
            :state="isNameValid"
          ></b-form-input>
          <b-form-invalid-feedback id="room-name-feedback" :state="isNameValid"
            >Nazwa musi mieć co najmniej 3 znaki długości.</b-form-invalid-feedback
          >
        </b-form-group>

        <b-form-group id="room-password-group" label="Hasło:" label-for="room-password">
          <b-form-input
            id="room-password"
            v-model="form.password"
            placeholder="Hasło"
            type="password"
            :state="isPasswordValid"
          ></b-form-input>
          <b-form-invalid-feedback id="room-name-feedback" :state="isPasswordValid"
            >Hasło musi mieć co najmniej 5 znaków długości.</b-form-invalid-feedback
          >
        </b-form-group>

        <b-button type="submit" variant="primary" @click="handleSubmit(joinRoom)">Dołącz</b-button>
        <b-button class="ml-2" type="submit" variant="primary" @click="handleSubmit(createRoom)">Stwórz</b-button>
      </b-form>
    </div>
  </div>
</template>

<script>
import StatusIcon from '@/components/shared/StatusIcon.vue';

export default {
  name: 'Home',
  data: function() {
    return {
      form: {
        name: null,
        password: null
      },
      warningMsg: '',
      showAlert: false
    };
  },
  methods: {
    handleSubmit(fun) {
      if (this.isNameValid && this.isPasswordValid) fun();
    },
    joinRoom() {
      this.$socket.client.emit('joinRoom', this.form);
    },
    createRoom() {
      this.$socket.client.emit('createRoom', this.form);
    }
  },
  computed: {
    isNameValid() {
      if (this.form.name == null) return null;
      return this.form.name.length >= 3;
    },
    isPasswordValid() {
      if (this.form.password == null) return null;
      return this.form.password.length >= 5;
    }
  },
  sockets: {
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
      this.showAlert = true;
    }
  },
  components: {
    AppStatusIcon: StatusIcon
  }
};
</script>

<style scoped lang="scss">
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
