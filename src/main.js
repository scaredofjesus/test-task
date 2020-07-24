import Vue from "vue";
import infiniteScroll from "vue-infinite-scroll";
import numeral from "numeral";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import api from "./api";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
Vue.use(infiniteScroll);
Vue.prototype.$bus = new Vue();
Vue.prototype.$formatNumber = numeral;
Vue.prototype.$api = api;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
