<template>
  <div class="booking-payment-container">
    <div class="payment-content">
      <div class="payment-info">
        <h2>결제 정보</h2>
        <p>총 결제 금액: {{ bookingData?.totalAmount }}원</p>
        
        <div class="section">
          <h3>예약 시간</h3>
          <div class="time-slots">
            <div v-for="slot in bookingData?.timeSlots" :key="slot.timeSlotId" class="time-slot">
              {{ slot.date }} {{ slot.startTime }}-{{ slot.endTime }}
            </div>
          </div>
        </div>

        <div class="section">
          <h3>선택된 반려동물</h3>
          <div class="pets-list">
            <div v-for="pet in pets" :key="pet.id" class="pet-item">
              <img v-if="pet.profileUrl" :src="pet.profileUrl" :alt="pet.name" class="pet-image">
              <div v-else class="pet-image-placeholder">🐾</div>
              <div class="pet-info">
                <span class="pet-name">{{ pet.name }}</span>
                <span class="pet-details">{{ pet.birth }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button class="payment-button" @click="onPayment">
        결제하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { petsitterApi } from '@/api/petsitter';
import { petsApi } from '@/api/pets';

const route = useRoute();
const router = useRouter();
const bookingData = ref(null);
const pets = ref([]);

onMounted(async () => {
  const encodedData = route.query.data;
  if (encodedData) {
    try {
      const decodedData = JSON.parse(decodeURIComponent(encodedData));
      bookingData.value = decodedData;
      console.log('Booking data:', decodedData);
      
      // 선택된 반려동물 정보 가져오기
      const response = await petsApi.getMyPets();
      const allPets = response.data.data.petProfiles;
      // 선택된 반려동물만 필터링
      pets.value = allPets.filter(pet => 
        bookingData.value.selectedPets.includes(pet.id)
      );
      console.log('Filtered pets:', pets.value);
    } catch (error) {
      console.error('Failed to parse booking data or fetch pets:', error);
    }
  }
});

const onPayment = () => {
  if (!bookingData.value) return;

  const { IMP } = window;
  IMP.init('imp68345014'); // 포트원 가맹점 식별코드
  
  const data = {
    pg: 'uplus',
    pay_method: 'card',
    merchant_uid: `mid_${new Date().getTime()}`,
    amount: bookingData.value.totalAmount,
    name: '펫 서비스 예약',
    buyer_name: '홍길동',
    buyer_tel: '01012341234',
    buyer_email: 'example@email.com',
    buyer_addr: '신사동 661-16',
    buyer_postcode: '06018'
  };

  // 포트원 결제 요청
  IMP.request_pay(data, callback);
};

const callback = async (response) => {
  const {
    success,
    merchant_uid,
    error_msg,
    paid_amount
  } = response;

  if (success) {
    try {
      const result = await petsitterApi.createBooking({
        timeSlotIds: bookingData.value.timeSlots.map(slot => slot.timeSlotId),
        petProfileIds: bookingData.value.selectedPets,
        paymentMethod: 'CREDIT',
        amount: paid_amount
      });

      if (result.data.data.paymentStatus === 'SUCCESS') {
        alert('결제 및 예약이 완료되었습니다.');
        router.push('/mypage');
      } else {
        alert('서버 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('서버 요청 실패:', error);
      alert('서버 요청 중 오류가 발생했습니다.');
    }
  } else {
    alert(`결제 실패: ${error_msg}`);
  }
};
</script>

<style scoped>
.booking-payment-container {
  padding-top: 80px; /* 상단바 높이만큼 여백 추가 */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #f5f5f5;
}

.payment-content {
  width: 100%;
  max-width: 600px;
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.payment-info {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.payment-info h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
}

.payment-info p {
  margin: 10px 0;
  color: #666;
  font-size: 16px;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.time-slot {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  color: #495057;
}

.payment-button {
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.payment-button:hover {
  background-color: #0056b3;
}

.section {
  margin-top: 24px;
}

.section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
}

.pets-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pet-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  gap: 12px;
}

.pet-image {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  object-fit: cover;
}

.pet-image-placeholder {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.pet-info {
  display: flex;
  flex-direction: column;
}

.pet-name {
  font-weight: bold;
  color: #333;
}

.pet-details {
  font-size: 14px;
  color: #666;
}
</style>