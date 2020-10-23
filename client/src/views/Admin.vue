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
      this.$router.push({ name: 'Login', params: { showAlert: true, msg } });
    }
  }
};
</script>

<style scoped lang="scss"></style>
