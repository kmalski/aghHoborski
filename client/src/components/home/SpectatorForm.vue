<template>
  <div class="spectator-form">
    <b-form @submit.stop.prevent="onSubmit" class="w-75">
      <b-form-group id="room-name-group">
        <b-form-input
          id="room-name"
          v-model="room.name"
          :state="nameValid"
          placeholder="Nazwa pokoju"
          size="lg"
          trim
        ></b-form-input>
        <b-form-invalid-feedback id="room-name-feedback" :state="nameValid"
          >Nazwa musi mieć co najmniej 3 znaki
          długości.</b-form-invalid-feedback
        >
      </b-form-group>

      <b-button class="blue-shadow" block type="submit" variant="primary"
        >Dołącz</b-button
      >
      <b-link to="/login" class="mt-2 d-block"
        >Stwórz pokój lub dołącz jako administrator</b-link
      >
    </b-form>
  </div>
</template>

<script>
export default {
  name: 'SpectatorForm',
  data() {
    return {
      room: {
        name: null
      }
    };
  },
  methods: {
    onSubmit() {
      if (this.room.name == null) this.room.name = '';
      if (this.nameValid) this.joinRoom();
    },
    joinRoom() {
      this.$socket.client.emit('joinRoom', this.room);
    }
  },
  computed: {
    nameValid() {
      if (this.room.name == null) return null;
      return this.room.name.length >= 3;
    }
  },
  sockets: {
    roomJoined(room) {
      this.$router.push({ name: 'Spectator', params: { room: room.name } });
    }
  }
};
</script>

<style scoped lang="scss"></style>
