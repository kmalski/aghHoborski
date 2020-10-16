<template>
  <div class="status-icon status-icon__position">
    <b-icon v-if="connect" icon="check-circle" font-scale="1.5"></b-icon>
    <b-icon v-if="reconnecting" icon="arrow-clockwise" animation="spin" font-scale="1.5"></b-icon>
    <b-icon v-if="disconnect" icon="x-circle" font-scale="1.5"></b-icon>
  </div>
</template>

<script>
export default {
  name: 'StatusIcon',
  data: function() {
    return {
      connect: false,
      reconnecting: false,
      disconnect: true
    };
  },
  sockets: {
    connect() {
      this.connect = true;
      this.disconnect = false;
      this.reconnecting = false;
    },
    reconnecting() {
      this.connect = false;
      this.disconnect = false;
      this.reconnecting = true;
    },
    disconnect() {
      this.connect = false;
      this.disconnect = true;
      this.reconnecting = false;
    }
  }
};
</script>

<style scoped lang="scss">
.status-icon {
  &__position {
    position: absolute;
    top: 2vh;
    right: 2vh;
  }
}
</style>
