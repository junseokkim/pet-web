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

    onMounted(async () => {
      try {
        // 페이지 로드 시 인증 상태 확인
        const response = await authApi.checkAuth();
        console.log('Auth check response:', response.data);
        
        if (response.data.status === 'success') {
          authStore.setAuth(
            response.data.data.memberId,
            response.data.data.name
          );
        }
      } catch (error) {
        console.error('Auth check error:', error);
        authStore.clearAuth();
      }
    });
  }
};
</script>
