<template>
  <Navbar />
  <router-view />
  <router-link to="/">홈</router-link>
</template>

<script>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api/auth';
import Navbar from "@/components/Navbar.vue";

export default {
  components: {
    Navbar,
  },
  setup() {
    const authStore = useAuthStore();

    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return;
      }
      
      try {
        // 인증 체크 API 호출
        await authApi.checkAuth();
      } catch (error) {
        // 콘솔 로그 제거
        // 토큰이 유효하지 않은 경우 처리
        localStorage.removeItem('accessToken');
      }
    };

    onMounted(() => {
      checkAuth();
    });
  }
};
</script>

<!-- Font Awesome CDN 추가 -->
<style>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
</style>
