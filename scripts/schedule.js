import Vue from 'vue';
import Create from './schedule/create.vue';
import Calendar from './schedule/calendar.vue';

const app = new Vue({
  el: '#app',
  components: {
    create: Create,
    calendar: Calendar,
  },
});
