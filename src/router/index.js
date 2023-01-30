import { createWebHistory, createRouter } from "vue-router";

import HomePage from "@/components/HomePage";
import TransactionDetails from "@/components/TransactionDetails";


const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage
  },
  {
    path: "/transaction/:id",
    name: "transaction-details",
    component: TransactionDetails
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
