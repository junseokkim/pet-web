<template>
  <div class="booking-container">
    <h2>결제 방법 선택</h2>
    
    <div class="booking-summary">
      <h3>예약 정보</h3>
      <div class="summary-item">
        <span>날짜</span>
        <span>{{ formatDate(timeSlot.date) }}</span>
      </div>
      <div class="summary-item">
        <span>시간</span>
        <span>{{ formatTime(timeSlot.startTime) }} - {{ formatTime(timeSlot.endTime) }}</span>
      </div>
      <div class="summary-item">
        <span>금액</span>
        <span>{{ formatPrice(service.hourlyPrice) }}원</span>
      </div>
    </div>

    <div class="payment-methods">
      <div class="payment-option"
           v-for="method in paymentMethods"
           :key="method.value"
           :class="{ 'selected': selectedMethod === method.value }"
           @click="selectPaymentMethod(method.value)">
        {{ method.label }}
      </div>
    </div>

    <div class="action-buttons">
      <button class="back-button" @click="$router.back()">이전</button>
      <button class="pay-button" 
              :disabled="!selectedMethod"
              @click="processPayment">
        결제하기
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { petsitterApi } from '@/api/petsitter';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const { timeSlot, service, selectedPets } = route.state;
    
    const paymentMethods = [
      { value: 'CREDIT', label: '신용카드' },
      { value: 'SIMPLE_PAY', label: '간편결제' }
    ];
    
    const selectedMethod = ref(null);

    const selectPaymentMethod = (method) => {
      selectedMethod.value = method;
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const formatTime = (timeStr) => {
      return timeStr.substring(0, 5);
    };

    const formatPrice = (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const processPayment = async () => {
      if (!selectedMethod.value) return;

      try {
        const bookingData = {
          timeSlotId: timeSlot.timeSlotId,
          petProfileIds: selectedPets,
          paymentMethod: selectedMethod.value,
          amount: service.hourlyPrice
        };

        const response = await petsitterApi.createBooking(bookingData);
        
        if (response.data.status === 'success') {
          toast.success('예약이 완료되었습니다.');
          router.push('/bookings'); // 예약 목록 페이지로 이동
        }
      } catch (error) {
        console.error('예약 실패:', error);
        toast.error('예약에 실패했습니다.');
      }
    };

    return {
      timeSlot,
      service,
      paymentMethods,
      selectedMethod,
      selectPaymentMethod,
      formatDate,
      formatTime,
      formatPrice,
      processPayment
    };
  }
};
</script>

<style scoped>
.booking-container {
  max-width: 800px;
  margin: 80px auto 0;
  padding: 20px;
}

.booking-summary {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.payment-methods {
  display: grid;
  gap: 15px;
  margin: 30px 0;
}

.payment-option {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.payment-option:hover {
  border-color: #2196F3;
}

.payment-option.selected {
  background: #e3f2fd;
  border-color: #2196F3;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.back-button, .pay-button {
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

.pay-button {
  background: #2196F3;
  color: white;
  border: none;
}

.pay-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 