<template>
  <div class="change-password-container">
    <h1 class="title">비밀번호 변경</h1>
    
    <form @submit.prevent="handleSubmit" class="change-password-form">
      <InputField
        type="password"
        label="현재 비밀번호"
        v-model="currentPassword"
        placeholder="현재 비밀번호 입력"
        :errorMessage="currentPasswordError"
      />

      <InputField
        type="password"
        label="새 비밀번호"
        v-model="newPassword"
        placeholder="새 비밀번호 입력"
        :errorMessage="newPasswordError"
      />

      <InputField
        type="password"
        label="비밀번호 확인"
        v-model="confirmPassword"
        placeholder="새 비밀번호 확인"
        :errorMessage="confirmPasswordError"
      />

      <button 
        type="submit" 
        class="change-button"
        :disabled="!isFormValid"
      >
        변경하기
      </button>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import { authApi } from '@/api/auth';
import InputField from '@/components/InputField.vue';

export default {
  components: {
    InputField
  },
  
  setup() {
    const router = useRouter();
    const toast = useToast();
    
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');

    const currentPasswordError = ref('');
    const newPasswordError = ref('');
    const confirmPasswordError = ref('');

    // 비밀번호 유효성 검사 규칙
    const validatePassword = (password) => {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);
    };

    // 현재 비밀번호 입력 시 에러 메시지 초기화
    watch(currentPassword, () => {
      currentPasswordError.value = '';  // 입력이 변경되면 에러 메시지 초기화
    });

    // 새 비밀번호 입력 시 유효성 검사
    watch(newPassword, (newValue) => {
      if (newValue && !validatePassword(newValue)) {
        newPasswordError.value = '소문자, 대문자, 특수문자를 포함한 8자 이상이어야 합니다.';
      } else {
        newPasswordError.value = '';
        // 비밀번호 확인도 다시 체크
        if (confirmPassword.value) {
          if (confirmPassword.value !== newValue) {
            confirmPasswordError.value = '비밀번호가 일치하지 않습니다.';
          } else {
            confirmPasswordError.value = '';
          }
        }
      }
    });

    // 비밀번호 확인 일치 여부 검사
    watch(confirmPassword, (newValue) => {
      if (newValue && newValue !== newPassword.value) {
        confirmPasswordError.value = '비밀번호가 일치하지 않습니다.';
      } else {
        confirmPasswordError.value = '';
      }
    });

    const isFormValid = computed(() => {
      return currentPassword.value && 
             validatePassword(newPassword.value) && 
             confirmPassword.value === newPassword.value;
    });

    const handleSubmit = async () => {
      try {
        if (!isFormValid.value) return;

        console.log('비밀번호 변경 요청 데이터:', {
          currentPassword: currentPassword.value,
          newPassword: newPassword.value
        });

        const response = await authApi.changePassword({
          currentPassword: currentPassword.value,
          newPassword: newPassword.value
        });

        if (response.data.status === 'success') {
          toast.success('비밀번호가 변경되었습니다.');
          router.push('/mypage');
        }
      } catch (error) {
        console.error('비밀번호 변경 에러:', error);
        
        // error.response가 아닌 error 자체에 status와 message가 있는 경우
        if (error.status === 'error' && error.message) {
          if (error.message.includes('현재 비밀번호가 일치하지 않습니다')) {
            currentPasswordError.value = error.message;
          } else if (error.message.includes('로그인이 필요합니다')) {
            toast.error("로그인이 필요합니다.");
            router.push('/login');
          } else if (error.message.includes('존재하지 않는 회원')) {
            toast.error("회원 정보를 찾을 수 없습니다.");
            router.push('/login');
          }
        } else {
          toast.error('비밀번호 변경 중 오류가 발생했습니다.');
        }
      }
    };

    return {
      currentPassword,
      newPassword,
      confirmPassword,
      currentPasswordError,
      newPasswordError,
      confirmPasswordError,
      isFormValid,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.change-password-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.change-password-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
}

.change-button {
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
  margin-top: 16px;
}

.change-button:hover {
  background-color: #222;
}

.change-button:disabled {
  background-color: #999;
  cursor: not-allowed;
}
</style> 