<template>
  <div
    v-b-tooltip.hover
    :title="`Status połączenia z serwerem (${statusText})`"
    class="status-icon status-icon__position"
  >
    <b-icon v-if="$socket.connected && !reconnecting" icon="check-circle" font-scale="1.5"></b-icon>
    <b-icon v-if="reconnecting" icon="arrow-clockwise" animation="spin" font-scale="1.5"></b-icon>
    <b-icon v-if="!$socket.connected && !reconnecting" icon="x-circle" font-scale="1.5"></b-icon>
  </div>
</template>

<script>
export default {
  name: 'StatusIcon',
  data() {
    return {
      reconnecting: false,
      statusText: this.$socket.connected ? 'połączono' : 'rozłączono'
    };
  },
  created() {
    this.$socket.client.io.on('reconnect_attempt', this.reconnectAttempt);
  },
  beforeDestroy() {
    this.$socket.client.io.off('reconnect_attempt', this.reconnectAttempt);
  },
  methods: {
    reconnectAttempt() {
      this.statusText = 'próba odnowienia';
      this.reconnecting = true;
    }
  },
  sockets: {
    connect() {
      this.statusText = 'połączono';
      this.reconnecting = false;
    },
    disconnect() {
      this.statusText = 'rozłączono';
      this.reconnecting = false;
    }
  }
};
</script>

<style scoped lang="scss">
.status-icon {
  position: absolute;
  top: 2vh;
  right: 2vh;
}
</style>
