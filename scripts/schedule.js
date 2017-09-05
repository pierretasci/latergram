import Vue from 'vue';
import Create from './schedule/create.vue';

const app = new Vue({
  el: '#app',
  components: {
    create: Create,
  },
});
