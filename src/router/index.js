
import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App';
import router from './router/index.js';

Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
