<template>
  <div class="booking-container">
    <h2>예약 시간 선택</h2>
    
    <div class="selected-times" v-if="selectedTimeSlots.length > 0">
      <h3>선택된 시간 ({{ selectedTimeSlots.length }})</h3>
      <div class="selected-times-list">
        <div v-for="time in selectedTimeSlots" 
             :key="time.timeSlotId" 
             class="selected-time-item">
          <span>{{ formatDate(time.date) }} {{ formatTime(time.startTime) }} - {{ formatTime(time.endTime) }}</span>
          <button class="remove-btn" @click.stop="removeTimeSlot(time)">×</button>
        </div>
      </div>
      <div class="total-price">
        총 금액: {{ formatPrice(getTotalPrice()) }}원
      </div>
    </div>
    
    <div class="date-sections">
      <div v-for="(timeSlots, date) in groupedTimeSlots" 
           :key="date" 
           class="date-section">
        <h3 class="date-header">{{ formatDateFull(date) }}</h3>
        <div class="time-slots-grid">
          <div v-for="time in timeSlots" 
               :key="time.timeSlotId" 
               class="time-slot"
               :class="{ 
                 'selected': isSelected(time),
                 'disabled': time.isBooked 
               }"
               @click="toggleTimeSlot(time)">
            <div class="time">{{ formatTime(time.startTime) }} - {{ formatTime(time.endTime) }}</div>
            <div class="price">{{ formatPrice(service.hourlyPrice) }}원</div>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="back-button" @click="$router.back()">이전</button>
      <button class="next-button" 
              :disabled="selectedTimeSlots.length === 0"
              @click="goToNextStep">
        다음 단계 ({{ selectedTimeSlots.length }}개 선택)
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { petsitterApi } from '@/api/petsitter';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const service = ref(null);
    const availableTimes = ref([]);
    const selectedTimeSlots = ref([]);

    const groupedTimeSlots = computed(() => {
      const groups = {};
      availableTimes.value.forEach(time => {
        if (!groups[time.date]) {
          groups[time.date] = [];
        }
        groups[time.date].push(time);
      });
      return groups;
    });

    const fetchServiceDetail = async () => {
      try {
        const response = await petsitterApi.getServiceDetail(route.params.id);
        if (response.data.status === 'success') {
          service.value = response.data.data;
          availableTimes.value = service.value.availableTimes.filter(time => !time.isBooked);
        }
      } catch (error) {
        console.error('서비스 정보 조회 실패:', error);
        toast.error('서비스 정보를 불러오는데 실패했습니다.');
      }
    };

    const isSelected = (time) => {
      return selectedTimeSlots.value.some(t => t.timeSlotId === time.timeSlotId);
    };

    const toggleTimeSlot = (time) => {
      if (time.isBooked) return;
      
      const index = selectedTimeSlots.value.findIndex(t => t.timeSlotId === time.timeSlotId);
      if (index === -1) {
        selectedTimeSlots.value.push(time);
      } else {
        selectedTimeSlots.value.splice(index, 1);
      }
    };

    const removeTimeSlot = (time) => {
      const index = selectedTimeSlots.value.findIndex(t => t.timeSlotId === time.timeSlotId);
      if (index !== -1) {
        selectedTimeSlots.value.splice(index, 1);
      }
    };

    const getTotalPrice = () => {
      return selectedTimeSlots.value.length * service.value?.hourlyPrice || 0;
    };

    const formatDateFull = (dateStr) => {
      const date = new Date(dateStr);
      const days = ['일', '월', '화', '수', '목', '금', '토'];
      return `${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const formatTime = (timeStr) => {
      return timeStr.substring(0, 5);
    };

    const formatPrice = (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const goToNextStep = () => {
      if (selectedTimeSlots.value.length > 0) {
        router.push({
          name: 'BookingPets',
          params: { id: route.params.id },
          query: { 
            data: encodeURIComponent(JSON.stringify({
              timeSlots: selectedTimeSlots.value,
              service: service.value,
              totalAmount: getTotalPrice()
            }))
          }
        });
      }
    };

    onMounted(() => {
      fetchServiceDetail();
    });

    return {
      service,
      groupedTimeSlots,
      selectedTimeSlots,
      isSelected,
      toggleTimeSlot,
      removeTimeSlot,
      getTotalPrice,
      formatDateFull,
      formatDate,
      formatTime,
      formatPrice,
      goToNextStep
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

.date-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin: 20px 0;
}

.date-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.date-header {
  margin-bottom: 15px;
  color: #1976d2;
  font-size: 1.2em;
}

.time-slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.time-slot {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-slot:hover {
  border-color: #2196F3;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}

.time-slot.selected {
  background: #e3f2fd;
  border-color: #2196F3;
}

.time-slot.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.time-slot.disabled:hover {
  transform: none;
  border-color: #e0e0e0;
}

.time {
  font-weight: 500;
  color: #333;
}

.price {
  color: #2196F3;
  font-weight: bold;
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
  transition: all 0.2s;
}

.back-button {
  background: white;
  border: 1px solid #2196F3;
  color: #2196F3;
}

.back-button:hover {
  background: #f5f5f5;
}

.next-button {
  background: #2196F3;
  color: white;
  border: none;
}

.next-button:hover {
  background: #1976d2;
}

.next-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.selected-times {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.selected-times-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 10px 0;
}

.selected-time-item {
  background: white;
  border: 1px solid #2196F3;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff4444;
  font-size: 18px;
  cursor: pointer;
  padding: 0 4px;
}

.remove-btn:hover {
  color: #cc0000;
}

.total-price {
  margin-top: 15px;
  font-size: 1.2em;
  font-weight: bold;
  color: #2196F3;
}
</style> 