<template>
  <b-modal :id="id" hide-footer title="Wybierz kategorię">
    <b-alert class="modal-alert" v-model="showAlert" variant="warning" dismissible>
      {{ msg }}
    </b-alert>
    <div class="categories">
      <p v-for="category in categories" :key="category" @click="drawNextQuestion(category)">{{ category }}</p>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'CategorySelector',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      categories: [],
      msg: '',
      showAlert: false
    };
  },
  mounted() {
    this.$root.$on('bv::modal::show', event => {
      if (event.componentId === this.id) {
        this.$socket.client.emit('getAvailableCategories');
      }
    });
  },
  methods: {
    drawNextQuestion(categoryName) {
      console.log(categoryName);
      this.$socket.client.emit('finishAuction', { auctionFinishAction: 'drawNextQuestion', categoryName });
    }
  },
  sockets: {
    fail(msg) {
      this.msg = msg;
      this.showAlert = true;
    },
    success() {
      this.$bvModal.hide(this.id);
    },
    availableCategories(data) {
      this.categories = data.categories;
    }
  }
};
</script>

<style scoped lang="scss">
@import '../../scss/main.scss';

.categories {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: flex-start;
  font-size: 0.8rem;
  width: fit-content;

  p {
    display: inline-block;
    flex: 0 0 49%;
    text-align: left;
    padding: 0.5rem 0.5rem;
    margin: 0;

    &:hover {
      cursor: pointer;
      border-radius: 0.25rem;
      color: $menu-font-color;
      background-color: $blue-button-color;
    }
  }
}
</style>
