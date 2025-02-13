<template>
    <div class="signup-container">
      <h1 class="title">회원가입</h1>
      <form @submit.prevent="handleSignup" class="signup-form">
        <InputField v-model="email" label="이메일" placeholder="abc@example.com" :errorMessage="emailError" />
        <InputField v-model="password" type="password" label="비밀번호" placeholder="비밀번호 입력" :errorMessage="passwordError" />
        <InputField v-model="confirmPassword" type="password" label="비밀번호 확인" placeholder="비밀번호 확인" :errorMessage="confirmPasswordError" />
        <InputField v-model="name" label="이름" placeholder="이름 입력" :errorMessage="nameError" />
        <InputField v-model="phone" label="연락처" placeholder="010-1234-5678" :errorMessage="phoneError" />
        <button 
          type="submit" 
          class="common-button"
          :disabled="!isFormValid"
        >
          회원가입
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref, computed, watch } from "vue";
  import { useRouter } from 'vue-router';
  import InputField from "@/components/InputField.vue";
  import '@/assets/styles/commonButton.css';
  import { authApi } from '@/api/auth';
  import { useToast } from "vue-toastification";
  
  export default {
    components: { InputField },
    setup() {
      const router = useRouter();
      const toast = useToast();
      const email = ref("");
      const password = ref("");
      const confirmPassword = ref("");
      const name = ref("");
      const phone = ref("");
  
      const emailError = ref("");
      const passwordError = ref("");
      const confirmPasswordError = ref("");
      const nameError = ref("");
      const phoneError = ref("");
  
      const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
      const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);
  
      // 이메일 유효성 검사
      watch(email, (newValue) => {
        if (newValue && !validateEmail(newValue)) {
          emailError.value = "이메일 형식이 아닙니다.";
        } else {
          emailError.value = "";
        }
      });
  
      // 비밀번호 유효성 검사
      watch(password, (newValue) => {
        if (newValue && !validatePassword(newValue)) {
          passwordError.value = "소문자, 대문자, 특수문자를 포함한 8자 이상이어야 합니다.";
        } else {
          passwordError.value = "";
        }
        
        // 비밀번호 확인 필드가 비어있지 않은 경우 일치 여부 검사
        if (confirmPassword.value && newValue !== confirmPassword.value) {
          confirmPasswordError.value = "비밀번호가 일치하지 않습니다.";
        } else {
          confirmPasswordError.value = "";
        }
      });
  
      // 비밀번호 확인 유효성 검사
      watch(confirmPassword, (newValue) => {
        if (newValue && newValue !== password.value) {
          confirmPasswordError.value = "비밀번호가 일치하지 않습니다.";
        } else {
          confirmPasswordError.value = "";
        }
      });
  
      // 이름 유효성 검사
      watch(name, (newValue) => {
        if (newValue && newValue.length < 2) {
          nameError.value = "이름은 2자 이상이어야 합니다.";
        } else {
          nameError.value = "";
        }
      });
  
      // 전화번호 유효성 검사
      watch(phone, (newValue) => {
        if (newValue && newValue.length < 10) {
          phoneError.value = "올바른 전화번호 형식이 아닙니다.";
        } else {
          phoneError.value = "";
        }
      });
  
      const isFormValid = computed(() => {
        return validateEmail(email.value) && 
               validatePassword(password.value) &&
               password.value === confirmPassword.value &&
               name.value.length >= 2 &&
               phone.value.length >= 10;
      });
  
      const handleSignup = async () => {
        try {
          // 폼 데이터 유효성 검사
          if (!validateEmail(email.value)) {
            emailError.value = "이메일 형식이 아닙니다.";
            toast.error("이메일 형식이 아닙니다.");
            return;
          }
  
          if (!validatePassword(password.value)) {
            passwordError.value = "소문자, 대문자, 특수문자를 포함한 8자 이상이어야 합니다.";
            toast.error("비밀번호 형식이 올바르지 않습니다.");
            return;
          }
  
          if (password.value !== confirmPassword.value) {
            confirmPasswordError.value = "비밀번호가 일치하지 않습니다.";
            toast.error("비밀번호가 일치하지 않습니다.");
            return;
          }
  
          const userData = {
            email: email.value,
            password: password.value,
            name: name.value,
            contact: phone.value
          };
  
          console.log('Sending signup request with data:', userData);  // 요청 데이터 로깅
  
          const response = await authApi.signup(userData);
          console.log('Signup response:', response);  // 응답 로깅
          
          if (response.status === 200 || response.status === 201) {
            toast.success("회원가입이 완료되었습니다!");
            router.push('/login');
          }
        } catch (error) {
          console.error('회원가입 에러:', error);
          console.error('에러 응답:', error.response);  // 자세한 에러 정보 로깅
          
          if (error.response?.data) {
            const errorMessage = error.response.data.message;
            
            // 필드별 에러 처리
            if (errorMessage.includes('이메일')) {
              emailError.value = errorMessage;
              toast.error(errorMessage);
            } else if (errorMessage.includes('비밀번호')) {
              passwordError.value = errorMessage;
              toast.error(errorMessage);
            } else if (errorMessage.includes('이름')) {
              nameError.value = errorMessage;
              toast.error(errorMessage);
            } else if (errorMessage.includes('연락처')) {
              phoneError.value = errorMessage;
              toast.error(errorMessage);
            } else {
              toast.error(errorMessage || '회원가입 중 오류가 발생했습니다.');
            }
          } else {
            toast.error('서버와의 통신 중 오류가 발생했습니다.');
          }
        }
      };
  
      return { email, password, confirmPassword, name, phone, emailError, passwordError, confirmPasswordError, nameError, phoneError, isFormValid, handleSignup };
    },
  };
  </script>
  
  <style scoped>
  /* ✅ 회원가입 페이지 스타일 */
  .signup-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    text-align: center;
  }
  
  /* ✅ 타이틀 스타일 */
  .title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px; /* ✅ 타이틀 간격 조정 */
  }
  
  /* ✅ 회원가입 폼 스타일 (간격 조정) */
  .signup-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
  }
  
  /* ✅ 회원가입 버튼 */
  .signup-button {
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
  
  .signup-button:hover {
    background-color: #222;
  }
  </style>
  