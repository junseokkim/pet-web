import { reactive } from "vue";

export const authStore = reactive({
  isAuthenticated: false, // 로그인 상태
  username: "", // 사용자 이름

  login(name) {
    this.isAuthenticated = true;
    this.username = name;
  },

  logout() {
    this.isAuthenticated = false;
    this.username = "";
  },
});
