<template>
  <div class="login-form">
    <b-form @submit.stop.prevent class="w-75">
      <b-form-group id="room-name-group">
        <b-form-input
          id="room-name"
          v-model="room.name"
          placeholder="Nazwa pokoju"
          trim
          :state="nameValid"
        ></b-form-input>
        <b-form-invalid-feedback id="room-name-feedback" :state="nameValid"
          >Nazwa musi mieć co najmniej 3 znaki długości.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-form-group id="room-password-group">
        <b-form-input
          id="room-password"
          v-model="room.password"
          placeholder="Hasło"
          type="password"
          :state="passwordValid"
        ></b-form-input>
        <b-form-invalid-feedback id="room-name-feedback" :state="passwordValid"
          >Hasło musi mieć co najmniej 5 znaków długości.</b-form-invalid-feedback
        >
      </b-form-group>
      <b-button-group class="w-100">
        <b-button class="mr-1 rounded-right blue-shadow" type="submit" variant="primary" @click="onSubmit(joinRoom)"
          >Dołącz</b-button
        >
        <b-button class="ml-1 rounded-left blue-shadow" type="submit" variant="primary" @click="onSubmit(createRoom)"
          >Stwórz</b-button
        >
      </b-button-group>
      <b-link to="/" class="mt-2 d-block">Dołącz jako widz</b-link>
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      room: {
        name: null,
        password: null
      }
    };
  },
  methods: {
    onSubmit(action) {
      if (this.room.name == null) this.room.name = '';
      if (this.room.password == null) this.room.password = '';
      if (this.nameValid && this.passwordValid) action();
    },
    joinRoom() {
      this.$socket.client.emit('adminJoinRoom', this.room);
    },
    createRoom() {
      this.$socket.client.emit('createRoom', this.room);
    }
  },
  computed: {
    nameValid() {
      if (this.room.name == null) return null;
      return this.room.name.length >= 3;
    },
    passwordValid() {
      if (this.room.password == null) return null;
      return this.room.password.length >= 5;
    }
  },
  sockets: {
    roomCreated(room) {
      localStorage.awanturaToken = room.token;

      this.$router.push({ name: 'Admin', params: { room: room.name } });
    },
    roomJoined(room) {
      localStorage.awanturaToken = room.token;

      this.$router.push({ name: 'Admin', params: { room: room.name } });
    }
  }
};
</script>

<style scoped lang="scss"></style>
