<template>
    <div class="find-password-container">
      <h1 class="title">비밀번호 찾기</h1>
      <p class="description">가입 시 입력한 이메일을 입력해주세요.</p>
      <form @submit.prevent="handleFindPassword" class="find-password-form">
        <InputField 
          v-model="email" 
          label="이메일" 
          type="email"
          placeholder="이메일을 입력하세요" 
          :errorMessage="emailError" 
        />
        
        <button 
          type="submit" 
          class="find-password-button"
          :disabled="!isFormValid || isLoading"
        >
          {{ isLoading ? '처리 중...' : '비밀번호 찾기' }}
        </button>
      </form>

      <!-- 임시 비밀번호 모달 -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>임시 비밀번호가 발급되었습니다</h2>
          <p class="temp-password">{{ temporaryPassword }}</p>
          <p class="modal-description">
            로그인 후 반드시 비밀번호를 변경해주세요.<br>
            보안을 위해 이 창을 닫으면 다시 확인할 수 없습니다.
          </p>
          <button @click="handleModalClose" class="modal-button">
            확인하고 로그인하기
          </button>
        </div>
      </div>
    </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import { authApi } from '@/api/auth';
import InputField from "@/components/InputField.vue";

export default {
  components: { InputField },
  setup() {
    const router = useRouter();
    const toast = useToast();
    
    const email = ref("");
    const emailError = ref("");
    const isLoading = ref(false);
    const showModal = ref(false);
    const temporaryPassword = ref("");

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const isFormValid = computed(() => {
      return validateEmail(email.value);
    });

    // 이메일 입력 시 에러 메시지 초기화
    watch(email, () => {
      emailError.value = "";
    });

    const handleFindPassword = async () => {
      if (!isFormValid.value) {
        emailError.value = "올바른 이메일 형식이 아닙니다.";
        return;
      }

      try {
        isLoading.value = true;
        const response = await authApi.resetPassword(email.value);

        if (response.data.status === 'success') {
          temporaryPassword.value = response.data.data.temporaryPassword;
          showModal.value = true;
        }
      } catch (error) {
        console.error('비밀번호 초기화 에러:', error);
        
        // error.response가 아닌 error 자체에 status와 message가 있는 경우
        if (error.status === 'error' && error.message) {
          emailError.value = error.message;
        } else {
          toast.error('비밀번호 초기화 중 오류가 발생했습니다.');
        }
      } finally {
        isLoading.value = false;
      }
    };

    const handleModalClose = () => {
      showModal.value = false;
      router.push('/login');
    };

    return {
      email,
      emailError,
      isLoading,
      isFormValid,
      showModal,
      temporaryPassword,
      handleFindPassword,
      handleModalClose
    };
  },
};
</script>

<style scoped>
/* ✅ 비밀번호 찾기 화면 스타일 */
.find-password-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
}

/* ✅ 타이틀 스타일 (아래 간격 줄임) */
.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px; /* ✅ 기존보다 간격 줄이기 */
}

/* ✅ 설명 스타일 (위쪽 여백 최소화) */
.description {
  font-size: 16px;
  color: #666;
  margin-top: 0; /* ✅ 기본 여백 제거 */
  margin-bottom: 30px; /* ✅ 적절한 간격 유지 */
}

/* ✅ 폼 스타일 */
.find-password-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
}

/* ✅ 비밀번호 찾기 버튼 */
.find-password-button {
  width: 100%;
  max-width: 400px;
  padding: 12px;
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

.find-password-button:hover {
  background-color: #222;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.temp-password {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 6px;
  margin: 20px 0;
}

.modal-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}

.modal-button {
  width: 100%;
  padding: 12px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.modal-button:hover {
  background-color: #222;
}

/* Loading 상태 스타일 */
.find-password-button:disabled {
  background-color: #999;
  cursor: not-allowed;
}
</style>
