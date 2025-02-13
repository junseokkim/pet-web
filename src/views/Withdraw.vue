<template>
  <div class="withdraw-container">
    <h1 class="title">회원 탈퇴</h1>
    
    <div class="warning-box">
      <h3>탈퇴 전 꼭 확인해주세요!</h3>
      <ul>
        <li>탈퇴 시 모든 회원 정보가 삭제됩니다.</li>
        <li>삭제된 정보는 복구할 수 없습니다.</li>
        <li>진행 중인 예약이나 서비스가 있다면 취소됩니다.</li>
      </ul>
    </div>

    <div class="confirm-box">
      <label>
        <input 
          type="checkbox" 
          v-model="isConfirmed"
        > 위 내용을 모두 확인했으며, 회원 탈퇴에 동의합니다.
      </label>
    </div>

    <div class="button-group">
      <button 
        class="cancel-button" 
        @click="router.push('/mypage')"
      >
        취소하기
      </button>
      <button 
        class="withdraw-button" 
        :disabled="!isConfirmed"
        @click="handleWithdraw"
      >
        탈퇴하기
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api/auth';
import { useToast } from "vue-toastification";

export default {
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const toast = useToast();
    const isConfirmed = ref(false);

    const handleWithdraw = async () => {
      if (!isConfirmed.value) {
        toast.error("탈퇴 동의가 필요합니다.");
        return;
      }

      // 로그인 상태 확인
      if (!authStore.isAuthenticated) {
        toast.error("로그인이 필요합니다.");
        router.push('/login');
        return;
      }

      try {
        console.log('회원 탈퇴 요청 전 인증 상태:', {
          isAuthenticated: authStore.isAuthenticated,
          memberId: authStore.memberId
        });

        const response = await authApi.withdraw();
        
        if (response.data.status === 'success') {
          toast.success("회원 탈퇴가 완료되었습니다.");
          authStore.clearAuth();
          router.push('/login');
        }
      } catch (error) {
        console.error('회원 탈퇴 에러:', error);
        console.error('에러 응답:', error.response?.data);
        
        if (error.response?.data) {
          const errorMessage = error.response.data.message;
          
          if (errorMessage.includes('로그인이 필요합니다')) {
            toast.error("로그인이 필요합니다.");
            router.push('/login');
          } else if (errorMessage.includes('존재하지 않는 회원')) {
            toast.error("회원 정보를 찾을 수 없습니다.");
            authStore.clearAuth();
            router.push('/login');
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error("회원 탈퇴 중 오류가 발생했습니다.");
        }
      }
    };

    return {
      isConfirmed,
      handleWithdraw,
      router
    };
  }
};
</script>

<style scoped>
.withdraw-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 40px;
}

.warning-box {
  width: 100%;
  background-color: #fff3f3;
  border: 1px solid #ffcdd2;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.warning-box h3 {
  color: #d32f2f;
  margin-bottom: 15px;
}

.warning-box ul {
  list-style-type: none;
  padding: 0;
}

.warning-box li {
  color: #555;
  margin-bottom: 10px;
  padding-left: 20px;
  position: relative;
}

.warning-box li:before {
  content: "•";
  color: #d32f2f;
  position: absolute;
  left: 0;
}

.confirm-box {
  width: 100%;
  margin-bottom: 30px;
}

.confirm-box label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.button-group {
  display: flex;
  gap: 20px;
  width: 100%;
}

.cancel-button, .withdraw-button {
  flex: 1;
  padding: 15px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background-color: #fff;
  border: 1px solid #333;
  color: #333;
}

.cancel-button:hover {
  background-color: #f5f5f5;
}

.withdraw-button {
  background-color: #d32f2f;
  border: none;
  color: white;
}

.withdraw-button:hover {
  background-color: #b71c1c;
}

.withdraw-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style> 