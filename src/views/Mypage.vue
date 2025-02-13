<template>
  <div class="mypage-container">
    <h2 class="title">마이페이지</h2>

    <div class="profile-section">
      <ProfileField label="이메일" :value="profile.email" />
      <ProfileField label="이름" :value="profile.name" />
      <ProfileField label="연락처" :value="profile.contact" />
    </div>

    <div class="button-group">
      <button class="edit-button" @click="router.push('/edit-profile')">정보 수정하기</button>
      <button class="password-button" @click="router.push('/change-password')">비밀번호 변경하기</button>
    </div>

    <div class="logout-section">
      <span class="logout-text" @click="handleLogout">로그아웃</span>
      <span class="withdraw-text" @click="router.push('/withdraw')">탈퇴하기</span>
    </div>

    <h3 class="section-title">내 펫시터 프로필</h3>
    <PetsitterProfile :profile="petsitter" @add-petsitter="addPetsitter" />

    <h3 class="section-title">내 펫 프로필</h3>
    <PetProfile :pets="pets" @add-pet="addPet" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from "vue-toastification";
import { authApi } from '@/api/auth';
import PetProfile from '@/components/PetProfile.vue';
import PetsitterProfile from '@/components/PetsitterProfile.vue';
import ProfileField from '@/components/ProfileField.vue';

export default {
  components: { PetProfile, PetsitterProfile, ProfileField },
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const toast = useToast();
    
    // 회원 정보 상태
    const profile = ref({
      email: '',
      name: '',
      contact: ''
    });

    // 회원 정보 조회
    const fetchProfile = async () => {
      try {
        const response = await authApi.getProfile();
        
        if (response.data.status === 'success') {
          profile.value = response.data.data;
        }
      } catch (error) {
        console.error('프로필 조회 에러:', error);
        
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
          toast.error("회원 정보 조회 중 오류가 발생했습니다.");
        }
      }
    };

    // 컴포넌트 마운트 시 회원 정보 조회
    onMounted(() => {
      fetchProfile();
    });

    const pets = ref([
      { 
        image: 'https://via.placeholder.com/100',
        name: '멍멍이'
      },
      { 
        image: 'https://via.placeholder.com/100',
        name: '냥이'
      }
    ]);

    // 펫시터 프로필 데이터 수정
    const petsitter = ref({
      image: 'https://via.placeholder.com/100',
      name: '김준석',
      bio: '반려동물을 사랑하는 마음으로 정성껏 돌보겠습니다.'
    });

    const addPet = () => {
      pets.value.push({ 
        image: 'https://via.placeholder.com/100',
        name: '새 반려동물'
      });
    };

    const addPetsitter = () => {
      petsitter.value = {
        image: '',
        name: '',
        bio: ''
      };
    };

    const handleLogout = () => {
      authStore.clearAuth();
      toast.success("로그아웃 되었습니다.");
      router.push('/login');
    };

    return { 
      profile,
      pets, 
      petsitter, 
      addPet,
      addPetsitter,
      handleLogout,
      router
    };
  }
};
</script>

<style scoped>
.mypage-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 20px 40px;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  align-self: center;
  margin-bottom: 20px;
}

.profile-section {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-group {
  width: 100%;
  max-width: 430px;
  margin: 10px 0 2px 0;
  display: flex;
  justify-content: space-between;
  padding: 0;
}

.button-group button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  width: 48%;
}

.edit-button {
  background-color: #333;
  color: white;
  border: none;
}

.password-button {
  background-color: white;
  color: #333;
  border: 1px solid #333;
}

.logout-section {
  width: 80%;
  max-width: 400px;
  margin: 0;
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.logout-text {
  font-size: 16px;
  color: #666;
  cursor: pointer;
}

.logout-text:hover {
  text-decoration: underline;
}

.withdraw-text {
  font-size: 16px;
  color: #ff4444;
  cursor: pointer;
}

.withdraw-text:hover {
  text-decoration: underline;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
}
</style>