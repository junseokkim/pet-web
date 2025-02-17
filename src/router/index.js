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
import Admin from '@/views/Admin.vue';
import PetDetail from '@/views/PetDetail.vue';
import ServiceManagement from '@/views/ServiceManagement.vue';
import ServiceRegister from '@/views/ServiceRegister.vue';
import ServiceDetail from '@/views/ServiceDetail.vue';
import BookingTime from '@/views/booking/BookingTime.vue';
import BookingPets from '@/views/booking/BookingPets.vue';
import BookingPayment from '@/views/booking/BookingPayment.vue';

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
  },
  {
    path: '/admin',
    component: Admin,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true  // 관리자 권한 필요
    }
  },
  {
    path: '/pet/:id',
    name: 'PetDetail',
    component: PetDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/petsitter/:id/services/manage',
    name: 'ServiceManagement',
    component: ServiceManagement,
    meta: { requiresAuth: true }
  },
  {
    path: '/service/register',
    name: 'ServiceRegister',
    component: ServiceRegister,
    meta: { requiresAuth: true }
  },
  {
    path: '/service/:id',
    name: 'ServiceDetail',
    component: ServiceDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/service/:id/booking',
    name: 'BookingTime',
    component: BookingTime,
    meta: { requiresAuth: true }
  },
  {
    path: '/service/:id/booking/pets',
    name: 'BookingPets',
    component: BookingPets,
    meta: { requiresAuth: true }
  },
  {
    path: '/service/:id/booking/payment',
    name: 'BookingPayment',
    component: BookingPayment,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 전역 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else if (to.matched.some(record => record.meta.requiresAdmin) && !authStore.isAdmin) {
      // 관리자 권한이 필요한 페이지에 대한 처리
      next('/');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
