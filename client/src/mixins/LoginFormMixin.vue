<script>
export default {
  name: 'LoginFormMixin',
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
    routeRoom(routeName, room) {
      localStorage.awanturaToken = room.token;
      this.$router.push({ name: routeName, params: { room: room.name } });
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
  }
};
</script>
