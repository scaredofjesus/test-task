import Vue from "vue";
import VueRouter from "vue-router";
import Exchanges from "../views/Exchanges.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "exchanges",
    component: Exchanges
  },
  {
    path: "/exchanges/:exchangeId",
    name: "exchange",
    component: () => import("../views/Exchange.vue")
  },
  {
    path: "/chart/:exchangeId/:baseId/:quoteId",
    name: "chart",
    component: () => import("../views/Chart.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
