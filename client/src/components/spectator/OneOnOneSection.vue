<template>
  <section v-if="isOneOnOne && !categorySelected" class="one-on-one-section">
    <div
      class="ooo-category"
      v-for="category in categories"
      :key="category.name"
      :style="{ opacity: category.enabled ? 1 : 0.25 }"
    >
      <p class="ooo-category__p">{{ category.name }}</p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'OneOnOneSection',
  data() {
    return {
      isOneOnOne: false,
      categories: [],
      categorySelected: false
    };
  },
  created() {
    this.$socket.client.emit('getOneOnOneState');
  },
  sockets: {
    oneOnOneState(data) {
      this.isOneOnOne = data.roundStage === 'oneOnOne';
      if (this.isOneOnOne) {
        this.categories = data.categories;
        this.categorySelected = data.category != null;
      }
    },
    oneOnOneStarted(data) {
      this.isOneOnOne = true;
      this.categories = data.categories;
    },
    categoryStateChanged(data) {
      const category = this.categories.find((category) => category.name === data.category);
      if (category) {
        category.enabled = data.enabled;
      }
    },
    categoryConfirmed() {
      this.isOneOnOne = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.one-on-one-section {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  width: 90%;

  .ooo-category {
    @extend .default-shadow;
    flex: 0 0 calc((100% - 4 * 0.75rem) / 3);
    margin: 0.75rem 0;
    border-radius: 20px;
    padding: 2.5rem 0;
    font-size: 1.5rem;
    color: $font-color;
    background-color: $neutral-color;
    overflow: hidden;

    &:last-child {
      margin: 0.75rem auto;
    }

    &__p {
      margin: 0;
    }
  }
}

@include media-breakpoint-down(md) {
  .one-on-one-section {
    margin: 0.4rem 0;

    .ooo-category {
      flex: 0 0 calc((100% - 6 * 0.6rem) / 4);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 4.5rem;
      padding: 0;
      margin: 0.6rem 0;
      font-size: 0.95rem;

      &:last-child {
        margin: initial;
      }
    }
  }
}
</style>
