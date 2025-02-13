<template>
  <div class="pet-profiles-container">
    <div class="pet-profiles-grid">
      <div v-for="(pet, index) in pets" :key="index" class="pet-profile-card">
        <div class="pet-image-container">
          <img 
            :src="pet.image" 
            @error="onImageError"
            alt="펫 프로필" 
            class="pet-image"
            ref="petImage" 
          />
          <div v-if="!pet.image" class="default-image">
            🐾
          </div>
        </div>
        <div class="pet-name">{{ pet.name || '이름 없음' }}</div>
      </div>
      <div class="pet-profile-card add-card" @click="addPet">
        <div class="add-pet-button">
          <span class="plus-icon">+</span>
          <span class="add-text">반려동물 추가</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { 
    pets: {
      type: Array,
      default: () => []
    }
  },
  emits: ['add-pet'],
  setup(_, { emit }) {
    const addPet = () => emit('add-pet');
    const onImageError = (e) => {
      e.target.style.display = 'none';
      e.target.parentElement.querySelector('.default-image').style.display = 'flex';
    };

    return { addPet, onImageError };
  }
};
</script>

<style scoped>
.pet-profiles-container {
  width: 100%;
  max-width: 600px;
}

.pet-profiles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding: 10px;
}

.pet-profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.pet-profile-card:hover {
  transform: translateY(-5px);
}

.pet-image-container {
  width: 100px;
  height: 100px;
  margin-bottom: 10px;
  position: relative;
  border-radius: 50%;
  background-color: #f0f0f0;
  overflow: hidden;
}

.pet-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.default-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  background-color: #f0f0f0;
  display: none;
}

.pet-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.add-card {
  cursor: pointer;
  background: #f8f8f8;
  border: 2px dashed #ddd;
}

.add-pet-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.plus-icon {
  font-size: 32px;
  color: #666;
  margin-bottom: 5px;
}

.add-text {
  font-size: 14px;
  color: #666;
}
</style>