import Vue from "vue";
import axios from "axios";

// Plugins
import App from "./App.vue";
import Chartist from "chartist";
import VueAxios from "vue-axios";
import DashboardPlugin from "./material-dashboard";
// import { ValidationProvider } from "vee-validate";
// plugin setup
Vue.use(DashboardPlugin);
Vue.use(VueAxios, axios);
// Vue.component("ValidationProvider", ValidationProvider);

// router & store setup
import router from "./router";
import store from "./store";

// global library setup
Vue.prototype.$Chartist = Chartist;

/* eslint-disable no-new */
const app = new Vue({
  router: router,
  store: store,
  el: "#app",
  render: h => h(App)
});

store.$app = app;
