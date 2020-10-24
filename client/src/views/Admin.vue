<template>
  <section class="admin">
    <h1>Administrator</h1>
  </section>
</template>

<script>
export default {
  name: 'Admin',
  data: function() {
    return {
      example: ''
    };
  },
  created() {
    this.$socket.client.emit('adminGetState', { token: localStorage.awanturaToken });
  },
  sockets: {
    unauthorized(msg) {
      this.$router.push({ name: 'Login', params: { initialShowAlert: true, initialMsg: msg } });
    }
  }
};
</script>

<style scoped lang="scss"></style>
