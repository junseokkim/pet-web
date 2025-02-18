<template>
  <div class="booking-container">
    <h2>반려동물 선택</h2>
    
    <div v-if="timeSlots && service" class="selected-summary">
      <h3>선택된 시간 ({{ timeSlots.length }})</h3>
      <div class="selected-times-list">
        <div v-for="time in timeSlots" :key="time.timeSlotId" class="time-item">
          {{ formatDate(time.date) }} {{ formatTime(time.startTime) }} - {{ formatTime(time.endTime) }}
        </div>
      </div>
      <div class="price-info">
        <div>시간당 {{ formatPrice(service.hourlyPrice) }}원 × {{ timeSlots.length }}시간</div>
        <div>× {{ selectedPets.length || 0 }}마리</div>
        <div class="total-price">총 금액: {{ formatPrice(getTotalPrice()) }}원</div>
      </div>
    </div>

    <div v-if="availablePets.length === 0" class="no-pets">
      <p>현재 펫시터가 돌봄 가능한 반려동물이 없습니다.</p>
      <p>펫시터가 돌봄 가능한 동물: {{ getAvailablePetTypes() }}</p>
      <button class="go-to-mypage" @click="$router.push('/mypage')">마이페이지로 이동</button>
    </div>

    <div v-else class="pets-grid">
      <div v-for="pet in availablePets" 
           :key="pet.id" 
           class="pet-card"
           :class="{ 'selected': isSelected(pet.id) }"
           @click="togglePetSelection(pet.id)">
        <div class="image-container">
          <img :src="pet.profileUrl || defaultProfileImage" 
               :alt="pet.name" 
               class="pet-image">
        </div>
        <div class="pet-info">
          <h4>{{ pet.name }}</h4>
          <p>{{ formatBirth(pet.birth) }}</p>
          <p class="pet-type">{{ getPetTypeLabel(pet.petType) }}</p>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="back-button" @click="$router.back()">이전</button>
      <button class="next-button" 
              :disabled="selectedPets.length === 0"
              @click="goToPayment">
        결제하기 ({{ selectedPets.length }}마리 선택)
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import defaultProfileImage from '@/assets/default-profile.png';
import { petsApi } from '@/api/pets';
import { petsitterApi } from '@/api/petsitter';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const myPets = ref([]);
const selectedPets = ref([]);
const service = ref(null);
const timeSlots = ref([]);
const petsitter = ref(null);

// 펫시터가 돌봄 가능한 동물 종류에 해당하는 반려동물만 필터링
const availablePets = computed(() => {
  if (!petsitter.value?.petTypes) return [];
  console.log('Petsitter pet types:', petsitter.value.petTypes);
  console.log('My pets:', myPets.value);
  
  return myPets.value.filter(pet => 
    petsitter.value.petTypes.includes(getPetTypeLabel(pet.petType))
  );
});

const getPetTypeLabel = (type) => {
  const types = {
    DOG: '강아지',
    CAT: '고양이'
  };
  return types[type] || type;
};

const getAvailablePetTypes = () => {
  if (!petsitter.value?.petTypes) return '';
  return petsitter.value.petTypes.join(', ');
};

onMounted(async () => {
  const encodedData = route.query.data;
  if (encodedData) {
    try {
      const decodedData = JSON.parse(decodeURIComponent(encodedData));
      service.value = decodedData.service;
      timeSlots.value = decodedData.timeSlots;
      
      console.log('Decoded service data:', service.value); // 디버깅용
      
      // 펫시터 상세 정보 가져오기
      const petsitterId = service.value.petSitter.petSitterId; // 경로 수정
      const petsitterResponse = await petsitterApi.getPetsitterDetail(petsitterId);
      petsitter.value = petsitterResponse.data.data;
      
      // 내 반려동물 목록 가져오기
      const petsResponse = await petsApi.getMyPets();
      myPets.value = petsResponse.data.data.petProfiles;
      
      console.log('Petsitter:', petsitter.value);
      console.log('My pets:', myPets.value);
      
      // 선택 가능한 반려동물이 없는 경우 알림
      if (availablePets.value.length === 0) {
        toast.warning(`현재 펫시터가 돌봄 가능한 반려동물이 없습니다.\n돌봄 가능한 동물: ${getAvailablePetTypes()}`);
      }
    } catch (error) {
      console.error('Failed to parse data or fetch information:', error);
      toast.error('데이터를 불러오는데 실패했습니다.');
    }
  }
});

const isSelected = (petId) => {
  return selectedPets.value.includes(petId);
};

const formatBirth = (birthDate) => {
  if (!birthDate) return '';
  const date = new Date(birthDate);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const togglePetSelection = (petId) => {
  const index = selectedPets.value.indexOf(petId);
  if (index === -1) {
    selectedPets.value.push(petId);
  } else {
    selectedPets.value.splice(index, 1);
  }
};

const getTotalPrice = () => {
  if (!service.value || !timeSlots.value) return 0;
  return timeSlots.value.length * service.value.hourlyPrice * (selectedPets.value.length || 0);
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const formatTime = (timeStr) => {
  return timeStr.substring(0, 5);
};

const formatPrice = (price) => {
  return price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
};

const goToPayment = () => {
  if (selectedPets.value.length > 0) {
    router.push({
      name: 'BookingPayment',
      params: { id: route.params.id },
      query: {
        data: encodeURIComponent(JSON.stringify({
          timeSlots: timeSlots.value,
          service: service.value,
          selectedPets: selectedPets.value,
          totalAmount: getTotalPrice()
        }))
      }
    });
  }
};
</script>

<style scoped>
.booking-container {
  max-width: 800px;
  margin: 80px auto 0;
  padding: 20px;
}

.selected-summary {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.selected-times-list {
  margin: 10px 0;
}

.time-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px 16px;
  margin: 5px 0;
}

.price-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.total-price {
  margin-top: 10px;
  font-size: 1.2em;
  font-weight: bold;
  color: #2196F3;
}

.action-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.back-button, .next-button {
  padding: 12px 40px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
}

.back-button {
  background: white;
  border: 1px solid #2196F3;
  color: #2196F3;
}

.next-button {
  background: #2196F3;
  color: white;
  border: none;
}

.next-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pets-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.pet-card {
  width: calc(33.33% - 10px);
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
}

.image-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 16px;
}

.pet-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pet-info {
  text-align: center;
}

.pet-info h4 {
  margin-bottom: 8px;
}

.pet-info p {
  margin: 0;
}

.pet-type {
  font-size: 0.9em;
  color: #666;
  margin-top: 4px;
}

.no-pets {
  text-align: center;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 20px 0;
}

.no-pets p {
  margin: 8px 0;
  color: #666;
}

.go-to-mypage {
  margin-top: 15px;
  padding: 10px 20px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.go-to-mypage:hover {
  background: #1976d2;
}

.pet-card.selected {
  border: 2px solid #2196F3;
  background-color: #e3f2fd;
}
</style> 