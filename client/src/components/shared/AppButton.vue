<template>
  <button :class="type" :disabled="disabled" @click="onClick($event)">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    type: { type: String, default: 'normal' },
    disabled: Boolean
  },
  methods: {
    onClick(event) {
      this.$emit('click', event);
    }
  }
};
</script>

<style scoped lang="scss">
button {
  padding: 10px 20px;
  border: 1px solid #ddd;
  color: #333;
  background-color: #fff;
  border-radius: 4px;
  font-size: 14px;
  font-family: '微软雅黑', arail;
  cursor: pointer;
  &[disabled] {
    cursor: not-allowed;
  }
  &.danger {
    background-color: #ff4949;
    color: #fff;
  }
  &.success {
    background-color: #13ce66;
    color: #fff;
  }
  &.info {
    background-color: #50bfff;
    color: #fff;
  }
}
</style>
