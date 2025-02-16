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
import PetsitterRegister from '@/views/PetsitterRegister.vue';
import PetsitterDetail from '@/views/PetsitterDetail.vue';
import { useAuthStore } from '@/stores/auth';

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
  { path: "/mypage", component: Mypage, meta: { requiresAuth: true } },
  { path: "/login", component: Login },
  { path: "/signup", component: Signup },
  { path: "/find-password", component: FindPassword },
  { path: '/edit-profile', name: 'EditProfile', component: EditProfile },
  { path: '/change-password', name: 'ChangePassword', component: ChangePassword },
  { path: '/withdraw', name: 'Withdraw', component: Withdraw },
  {
    path: '/petsitter/register',
    name: 'PetsitterRegister',
    component: PetsitterRegister,
    meta: { 
      requiresAuth: true  // 로그인이 필요한 페이지임을 명시
    }
  },
  {
    path: '/petsitter/:id',
    name: 'petsitter-detail',
    component: PetsitterDetail
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // requiresAuth가 true인 페이지에 접근하려 할 때
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 로그인 상태가 아니라면
    if (!authStore.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }  // 로그인 후 원래 가려던 페이지로 리다이렉트하기 위해
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
