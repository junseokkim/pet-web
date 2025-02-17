import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    memberId: null,
    username: null,
    isAuthenticated: false,
    isAdmin: false
  }),

  actions: {
    setAuth(memberId, username, isAdmin = false) {
      this.memberId = memberId;
      this.username = username;
      this.isAdmin = isAdmin;
      this.isAuthenticated = true;
    },

    clearAuth() {
      this.memberId = null;
      this.username = null;
      this.isAdmin = false;
      this.isAuthenticated = false;
    }
  }
}); 