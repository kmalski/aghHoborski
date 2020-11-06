<template>
  <div class="timer">
    <label>Czas</label>
    <b-form-input v-model="time" />
    <b-button class="blue-shadow" variant="primary" @click="startStopTime">
      {{ isTimePassing ? 'Stop' : 'Start' }}
    </b-button>
    <b-button class="blue-shadow" variant="primary" @click="resetTime">
      Reset
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'Timer',
  data() {
    return {
      isTimePassing: false,
      time: 60,
      intervalID: null
    };
  },
  methods: {
    resetTime() {
      this.time = 60;
      this.isTimePassing = false;
      clearInterval(this.intervalID);
    },
    startStopTime() {
      this.isTimePassing = !this.isTimePassing;
      if (this.isTimePassing) {
        this.intervalID = setInterval(() => (this.time -= 1), 1000);
      } else {
        clearInterval(this.intervalID);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.timer {
  @extend .base-card;

  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  max-height: fit-content;
  width: fit-content;
  border-top-right-radius: 0;
  border-top-left-radius: 0;

  * {
    margin: auto 0.5rem;
  }
}
</style>
