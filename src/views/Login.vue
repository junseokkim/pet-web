<template>
  <div class="login-container">
    <h1 class="title">로그인</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <InputField 
        v-model="email" 
        label="아이디" 
        placeholder="아이디 입력" 
        :error="errors.email"
        :showError="!!errors.email"
      />
      <InputField 
        v-model="password" 
        type="password" 
        label="비밀번호" 
        placeholder="비밀번호 입력" 
        :error="errors.password"
        :showError="!!errors.password"
      />
      <button 
        type="submit" 
        class="login-button"
      >
        로그인하기
      </button>
    </form>
    <div class="links">
      <router-link to="/signup">회원가입</router-link>
      <router-link to="/find-password">비밀번호 찾기</router-link>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import InputField from "@/components/InputField.vue";
import { authApi } from '@/api/auth';
import { useToast } from "vue-toastification";
import { useAuthStore } from '@/stores/auth';

export default {
  components: { InputField },
  setup() {
    const router = useRouter();
    const toast = useToast();
    const authStore = useAuthStore();
    const email = ref("");
    const password = ref("");
    const errors = ref({
      email: "",
      password: ""
    });

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleLogin = async () => {
      try {
        // 입력값 검증
        errors.value = {
          email: "",
          password: ""
        };

        if (!email.value) {
          errors.value.email = "이메일을 입력해주세요.";
          toast.error("이메일을 입력해주세요.");
          return;
        }

        if (!validateEmail(email.value)) {
          errors.value.email = "이메일 형식이 아닙니다.";
          toast.error("이메일 형식이 아닙니다.");
          return;
        }

        if (!password.value) {
          errors.value.password = "비밀번호를 입력해주세요.";
          toast.error("비밀번호는 필수 입력값입니다.");
          return;
        }

        const response = await authApi.login({
          email: email.value,
          password: password.value
        });

        console.log('Login response:', response.data);

        if (response.data.status === 'success') {
          // 세션 쿠키 확인
          console.log('Cookies:', document.cookie);
          
          authStore.setAuth(
            response.data.data.memberId,
            response.data.data.name,
            response.data.data.isAdmin
          );

          // store 상태 확인
          console.log('Auth store after login:', {
            memberId: authStore.memberId,
            username: authStore.username,
            isAuthenticated: authStore.isAuthenticated
          });

          toast.success("로그인 성공!");
          router.push('/');
        }
      } catch (error) {
        console.error('로그인 에러:', error);
        console.error('에러 상세:', error.response?.data);
        
        if (error.response?.data) {
          const errorMessage = error.response.data.message;
          
          if (errorMessage.includes('이메일')) {
            errors.value.email = errorMessage;
            toast.error(errorMessage);
          } else if (errorMessage.includes('비밀번호')) {
            errors.value.password = errorMessage;
            toast.error(errorMessage);
          } else {
            // 일반적인 에러 (이메일 또는 비밀번호가 올바르지 않습니다 등)
            toast.error(errorMessage);
          }
        } else {
          toast.error('로그인 중 오류가 발생했습니다.');
        }
      }
    };

    return { 
      email, 
      password, 
      errors,
      handleLogin 
    };
  },
};
</script>

<style scoped>
/* ✅ 로그인 화면 전체 레이아웃 */
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

/* ✅ 로그인 타이틀 스타일 */
.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px; /* ✅ 회원가입과 동일한 간격 */
}

/* ✅ 로그인 폼 스타일 (회원가입과 동일한 간격) */
.login-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  gap: 20px; /* ✅ 회원가입과 동일한 간격 */
}

/* ✅ 로그인 버튼 (회원가입과 동일한 크기 및 간격) */
.login-button {
  width: 100%;
  max-width: 400px;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background-color: #333;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button:hover {
  background-color: #222;
}

/* ✅ 회원가입 & 비밀번호 찾기 링크 스타일 */
.links {
  margin-top: 12px; /* ✅ 회원가입과 동일한 간격 */
  display: flex;
  justify-content: center;
  gap: 100px; /* ✅ 링크 간격 축소 */
  width: 100%;
}

.links a {
  font-size: 14px;
  color: #666;
  text-decoration: none;
}

.links a:hover {
  text-decoration: underline;
}
</style>
