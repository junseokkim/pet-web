<template>
  <div class="pet-detail">
    <h2>반려동물 상세 정보</h2>
    
    <div v-if="loading" class="loading">
      로딩 중...
    </div>
    
    <div v-else-if="pet" class="pet-info">
      <div class="image-container">
        <img :src="pet.profileUrl || defaultProfileImage" 
             :alt="pet.name"
             @error="handleImageError">
      </div>
      
      <div class="info-container">
        <div class="info-row">
          <span class="label">이름</span>
          <span class="value">{{ pet.name }}</span>
        </div>
        
        <div class="info-row">
          <span class="label">생년월일</span>
          <span class="value">{{ formatBirth(pet.birth) }}</span>
        </div>
        
        <div class="info-row">
          <span class="label">동물 종류</span>
          <span class="value">{{ pet.petType }}</span>
        </div>
        
        <div class="info-row">
          <span class="label">품종</span>
          <span class="value">{{ pet.petBreed }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { petsApi } from '@/api/pets';
import defaultProfileImage from '@/assets/default-profile.png';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    
    const pet = ref(null);
    const loading = ref(true);

    const formatBirth = (birthDate) => {
      if (!birthDate) return '';
      const date = new Date(birthDate);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const handleImageError = (e) => {
      e.target.src = defaultProfileImage;
    };

    const fetchPetDetail = async () => {
      try {
        const response = await petsApi.getMyPetDetail(route.params.id);
        if (response.data.status === 'success') {
          pet.value = response.data.data;
        }
      } catch (error) {
        console.error('펫 상세 정보 조회 실패:', error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('펫 정보를 불러오는데 실패했습니다.');
        }
        router.push('/mypage');
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchPetDetail();
    });

    return {
      pet,
      loading,
      formatBirth,
      handleImageError,
      defaultProfileImage
    };
  }
};
</script>

<style scoped>
.pet-detail {
  max-width: 600px;
  margin: 0 auto;
  padding: 100px 20px 40px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
}

.loading {
  text-align: center;
  padding: 20px;
}

.image-container {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.info-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  width: 100px;
  color: #666;
  font-weight: 500;
}

.value {
  flex: 1;
  color: #333;
}
</style> 