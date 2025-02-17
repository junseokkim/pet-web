<template>
  <div class="pet-profiles">
    <div v-if="pets.length === 0" class="empty-profile">
      <p>등록된 반려동물이 없습니다</p>
      <button @click="$emit('add-pet')" class="add-button">반려동물 등록하기</button>
    </div>
    <div v-else class="profile-list">
      <div v-for="pet in pets" 
           :key="pet.id" 
           class="profile-card"
           @click="goToDetail(pet.id)">
        <div class="image-container">
          <img :src="pet.profileUrl || defaultProfileImage" 
               :alt="pet.name" 
               class="pet-image"
               @error="handleImageError">
        </div>
        <div class="pet-info">
          <h4>{{ pet.name }}</h4>
          <p>{{ formatBirth(pet.birth) }}</p>
        </div>
      </div>
      <button @click="$emit('add-pet')" class="add-button">
        <i class="fas fa-plus"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import defaultProfileImage from '@/assets/default-profile.png';  // 기존에 있는 이미지 사용

export default {
  props: {
    pets: {
      type: Array,
      required: true
    }
  },

  setup() {
    const router = useRouter();

    const formatBirth = (birthDate) => {
      if (!birthDate) return '';
      const date = new Date(birthDate);
      return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const handleImageError = (e) => {
      e.target.src = defaultProfileImage;
    };

    const goToDetail = (petId) => {
      router.push(`/pet/${petId}`);
    };

    return {
      defaultProfileImage,
      formatBirth,
      handleImageError,
      goToDetail
    };
  }
};
</script>

<style scoped>
.pet-profiles {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.empty-profile {
  text-align: center;
  padding: 20px;
}

.profile-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.profile-card:hover {
  transform: translateY(-5px);
}

.image-container {
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background-color: #f5f5f5;
}

.pet-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.pet-info h4 {
  margin: 0;
  font-size: 1.1em;
}

.pet-info p {
  margin: 5px 0 0;
  font-size: 0.9em;
  color: #666;
}

.add-button {
  width: 100%;
  padding: 10px;
  background: #f5f5f5;
  border: 2px dashed #ddd;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1em;
  color: #666;
}

.add-button:hover {
  background: #eee;
}
</style>