<script>
export default {
  name: 'ModalMixin',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible: null,
      alert: {
        msg: '',
        show: false
      }
    };
  },
  sockets: {
    fail(msg) {
      if (this.visible) {
        this.alert.msg = msg;
        this.alert.show = true;
      }
    },
    success() {
      if (this.visible) {
        this.$bvModal.hide(this.id);
      }
    }
  }
};
</script>
