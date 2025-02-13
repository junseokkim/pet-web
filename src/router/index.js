import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Shop from "@/views/Shop.vue";
import Petsitter from "@/views/Petsitter.vue";
import Mypage from "@/views/Mypage.vue";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import FindPassword from "@/views/FindPassword.vue";
import EditProfile from '@/views/EditProfile.vue';
import ChangePassword from '@/views/ChangePassword.vue';
import Withdraw from '@/views/Withdraw.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    redirect: '/'
  },
  { path: "/shop", component: Shop },
  { path: "/petsitter", component: Petsitter },
  { path: "/mypage", component: Mypage },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/find-password", component: FindPassword },
  { path: '/edit-profile', name: 'EditProfile', component: EditProfile },
  { path: '/change-password', name: 'ChangePassword', component: ChangePassword },
  { path: '/withdraw', name: 'Withdraw', component: Withdraw }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
