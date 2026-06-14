import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: () => import("@/views/Home/Home.vue"),
  },
  {
    path: "/shop",
    component: () => import("@/views/Shop/Shop.vue"),
  },
  {
    path: "/publish",
    component: () => import("@/views/Publish/publish.vue"),
  },
  {
    path: "/messages",
    component: () => import("@/views/Messages/Messages.vue"),
  },
  {
    path: "/my",
    component: () => import("@/views/My/My.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
