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
      <b-button class="blue-shadow" block type="submit" variant="primary" @click="onSubmit(joinRoom)">Dołącz</b-button>
      <div class="links">
        <b-link to="/login-admin" class="mt-2 d-block">Stwórz pokój lub dołącz jako administrator</b-link>
        <b-link to="/" class="mt-2 d-block">Dołącz jako widz</b-link>
      </div>
    </b-form>
  </div>
</template>

<script>
import LoginFormMixin from '@/mixins/LoginFormMixin';

export default {
  name: 'HostLoginForm',
  mixins: [LoginFormMixin],
  sockets: {
    roomJoined(room) {
      this.routeRoom('Host', room);
    }
  }
};
</script>
