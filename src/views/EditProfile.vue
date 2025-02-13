<template>
  <div class="edit-container">
    <h1 class="title">회원정보 수정</h1>
    
    <form @submit.prevent="handleSubmit" class="edit-form">
      <div class="email-field-container">
        <ProfileField 
          label="이메일" 
          :value="email"
          class="profile-field" 
        />
      </div>

      <InputField
        type="text"
        label="이름"
        v-model="name"
        placeholder="이름을 입력하세요"
        :errorMessage="nameError"
      />

      <InputField
        type="tel"
        label="연락처"
        v-model="phone"
        placeholder="연락처를 입력하세요"
        :errorMessage="phoneError"
      />

      <button 
        type="submit" 
        class="common-button"
        :disabled="!isFormValid"
      >
        수정하기
      </button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import { authApi } from '@/api/auth';
import InputField from '@/components/InputField.vue';
import ProfileField from '@/components/ProfileField.vue';
import '@/assets/styles/commonButton.css';

export default {
  components: {
    InputField,
    ProfileField
  },
  
  setup() {
    const router = useRouter();
    const toast = useToast();
    
    // 폼 데이터
    const email = ref('');
    const name = ref('');
    const phone = ref('');

    // 에러 메시지
    const nameError = ref('');
    const phoneError = ref('');

    // 초기 데이터 로드
    const fetchProfile = async () => {
      try {
        const response = await authApi.getProfile();
        
        if (response.data.status === 'success') {
          const profileData = response.data.data;
          email.value = profileData.email;
          name.value = profileData.name;
          phone.value = profileData.contact;
        }
      } catch (error) {
        console.error('프로필 조회 에러:', error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('프로필 정보를 불러오는데 실패했습니다.');
        }
        router.push('/mypage');
      }
    };

    onMounted(() => {
      fetchProfile();
    });

    // 실시간 유효성 검사
    watch(name, (newValue) => {
      if (newValue && newValue.length < 2) {
        nameError.value = "이름은 2자 이상이어야 합니다.";
      } else {
        nameError.value = "";
      }
    });

    watch(phone, (newValue) => {
      if (newValue && !/^[0-9]{3}-[0-9]{4}-[0-9]{4}$/.test(newValue)) {
        phoneError.value = "올바른 전화번호 형식이 아닙니다.";
      } else {
        phoneError.value = "";
      }
    });

    const isFormValid = computed(() => {
      return name.value.length >= 2 && 
             /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/.test(phone.value);
    });

    const handleSubmit = async () => {
      try {
        if (!isFormValid.value) {
          return;
        }

        const response = await authApi.updateProfile({
          name: name.value,
          contact: phone.value
        });
        
        if (response.data.status === 'success') {
          toast.success("회원정보가 수정되었습니다.");
          router.push('/mypage');
        }
      } catch (error) {
        console.error('정보 수정 에러:', error);
        
        if (error.response?.data) {
          const errorMessage = error.response.data.message;
          
          if (errorMessage.includes('로그인이 필요합니다')) {
            toast.error("로그인이 필요합니다.");
            router.push('/login');
          } else if (errorMessage.includes('존재하지 않는 회원')) {
            toast.error("회원 정보를 찾을 수 없습니다.");
            router.push('/login');
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error("회원정보 수정 중 오류가 발생했습니다.");
        }
      }
    };

    return {
      email,
      name,
      phone,
      nameError,
      phoneError,
      isFormValid,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.edit-container {
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

.edit-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
}

.email-field-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.profile-field {
  width: 100%;
}

.edit-button {
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

.edit-button:hover {
  background-color: #222;
}

.edit-button:disabled {
  background-color: #999;
  cursor: not-allowed;
}
</style>