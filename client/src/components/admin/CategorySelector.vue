<template>
  <b-modal :id="id" v-model="visible" hide-footer title="Wybierz kategorię">
    <b-alert class="modal-alert" v-model="alert.show" variant="warning" dismissible>
      {{ alert.msg }}
    </b-alert>
    <div class="categories">
      <p @click="startAuction('blackBox')">Czarna skrzynka</p>
      <p @click="startAuction('hint')">Podpowiedź</p>
      <hr />
      <p v-for="category in categories" :key="category" @click="startAuction(category)">{{ category }}</p>
    </div>
  </b-modal>
</template>

<script>
import ModalMixin from '@/components/shared/ModalMixin';

export default {
  name: 'CategorySelector',
  mixins: [ModalMixin],
  data() {
    return {
      categories: []
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
    startAuction(categoryName) {
      this.$socket.client.emit('startAuction', { categoryName });
    }
  },
  sockets: {
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

  hr {
    flex: 0 0 98%;
    border: none;
    border-bottom: 1px solid black;
    background: white;
    margin: 0.5rem auto;
  }

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
