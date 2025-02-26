<template>
  <div class="petsitter-container">
    <div v-if="profile" class="petsitter-profile" @click="goToDetail">
      <div class="profile-image-container">
        <img 
          :src="profileImage" 
          alt="펫시터 프로필" 
          class="profile-image"
        />
      </div>
      <div class="profile-info">
        <h3 class="profile-name">{{ profile.name }}</h3>
        <p class="profile-bio">{{ profile.introduce || '소개글이 없습니다.' }}</p>
      </div>
    </div>
    <div v-else class="add-petsitter" @click="$emit('add-petsitter')">
      <div class="add-content">
        <span class="plus-icon">+</span>
        <span class="add-text">펫시터 프로필 등록하기</span>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import DefaultProfileImage from '@/assets/default-profile.png';

export default {
  props: { 
    profile: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const router = useRouter();

    const goToDetail = () => {
      if (props.profile?.petSitterId) {
        router.push(`/petsitter/${props.profile.petSitterId}`);
      }
    };

    return {
      profileImage: computed(() => props.profile?.image || DefaultProfileImage),
      goToDetail
    };
  },
  emits: ['add-petsitter']
};
</script>

<style scoped>
.petsitter-container {
  width: 100%;
  max-width: 600px;
}

.petsitter-profile {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.petsitter-profile:hover {
  transform: translateY(-5px);
  transition: transform 0.2s ease;
}

.profile-image-container {
  width: 120px;
  height: 120px;
  position: relative;
  border-radius: 50%;
  background-color: #f0f0f0;
  overflow: hidden;
  flex-shrink: 0;
  margin-right: 20px;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.profile-bio {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

.add-petsitter {
  cursor: pointer;
  padding: 30px;
  background: #f8f8f8;
  border: 2px dashed #ddd;
  border-radius: 12px;
  text-align: center;
  transition: background-color 0.2s;
}

.add-petsitter:hover {
  background: #f0f0f0;
}

.add-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.plus-icon {
  font-size: 32px;
  color: #666;
  margin-bottom: 10px;
}

.add-text {
  font-size: 16px;
  color: #666;
}
</style>