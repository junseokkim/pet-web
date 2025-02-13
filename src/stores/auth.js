import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const memberId = ref(null);
  const username = ref(null);
  const isAuthenticated = ref(false);

  // 로그인 상태 설정
  const setAuth = (id, name) => {
    memberId.value = id;
    username.value = name;
    isAuthenticated.value = true;
  };

  // 로그아웃 상태 설정
  const clearAuth = () => {
    memberId.value = null;
    username.value = null;
    isAuthenticated.value = false;
  };

  return {
    memberId,
    username,
    isAuthenticated,
    setAuth,
    clearAuth
  };
}); 