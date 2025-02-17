<template>
  <div class="service-register-container">
    <h2>새 서비스 등록</h2>

    <form @submit.prevent="handleSubmit" class="service-form">
      <div class="form-group">
        <label>서비스 유형</label>
        <div class="checkbox-group">
          <label v-for="type in serviceTypes" :key="type.value">
            <input type="checkbox" 
                   v-model="selectedTypes" 
                   :value="type.value"
                   :disabled="isTypeDisabled(type.value)"
                   @change="handleTypeChange(type.value)">
            {{ type.label }}
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>돌봄 가능한 크기</label>
        <div class="checkbox-group">
          <label v-for="size in availableSizes" :key="size.value">
            <input type="checkbox" 
                   v-model="selectedSizes" 
                   :value="size.value"
                   :disabled="isSizeDisabled(size.value)"
                   @change="handleSizeChange(size.value)">
            {{ size.label }}
          </label>
        </div>
      </div>

      <div class="form-group">
        <label>서비스 기간</label>
        <div class="date-inputs">
          <input type="date" 
                 v-model="startDate" 
                 :min="today"
                 required>
          <span>~</span>
          <input type="date" 
                 v-model="endDate" 
                 :min="startDate"
                 required>
        </div>
      </div>

      <div class="form-group">
        <label>시간당 요금 (원)</label>
        <input type="number" 
               v-model="hourlyPrice" 
               min="0" 
               step="1000"
               required>
      </div>

      <div class="form-group">
        <label>예약 가능 시간</label>
        <div class="time-slots">
          <div v-for="(slot, index) in timeSlots" :key="index" class="time-slot">
            <div class="time-input-group">
              <input type="date" 
                     v-model="slot.date"
                     :min="startDate"
                     :max="endDate"
                     required>
              <select v-model="slot.startHour" required>
                <option value="">시간 선택</option>
                <option v-for="hour in availableHours" 
                        :key="hour" 
                        :value="hour">
                  {{ hour }}:00
                </option>
              </select>
              <span>~</span>
              <select v-model="slot.endHour" required>
                <option value="">시간 선택</option>
                <option v-for="hour in availableEndHours(slot.startHour)" 
                        :key="hour" 
                        :value="hour">
                  {{ hour }}:00
                </option>
              </select>
            </div>
            <button type="button" 
                    class="remove-slot" 
                    @click="removeTimeSlot(index)"
                    v-if="timeSlots.length > 1">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <button type="button" 
                  class="add-slot" 
                  @click="addTimeSlot">
            <i class="fas fa-plus"></i> 시간대 추가
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="cancel-button" @click="goBack">취소</button>
        <button type="submit" class="submit-button">등록하기</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { petsitterApi } from '@/api/petsitter';

export default {
  setup() {
    const router = useRouter();
    const toast = useToast();

    const serviceTypes = [
      { value: 'WALK', label: '산책' },
      { value: 'VISITING_CARE', label: '방문 돌봄' },
      { value: 'FOSTER_CARE', label: '위탁 돌봄' },
      { value: 'ALL', label: '전부' }
    ];

    const availableSizes = [
      { value: 'LARGE', label: '대형' },
      { value: 'MEDIUM', label: '중형' },
      { value: 'SMALL', label: '소형' },
      { value: 'ALL', label: '전부' }
    ];

    const selectedTypes = ref([]);
    const selectedSizes = ref([]);
    const startDate = ref('');
    const endDate = ref('');
    const hourlyPrice = ref(15000);
    const timeSlots = ref([{ 
      date: '', 
      startHour: '', 
      endHour: '' 
    }]);

    const today = computed(() => {
      const date = new Date();
      return date.toISOString().split('T')[0];
    });

    const availableHours = Array.from({ length: 24 }, (_, i) => 
      i.toString().padStart(2, '0')
    );

    const availableEndHours = (startHour) => {
      if (!startHour) return [];
      const start = parseInt(startHour);
      return availableHours.filter(hour => parseInt(hour) > start);
    };

    const addTimeSlot = () => {
      timeSlots.value.push({ 
        date: '', 
        startHour: '', 
        endHour: '' 
      });
    };

    const removeTimeSlot = (index) => {
      timeSlots.value.splice(index, 1);
    };

    const isTypeDisabled = (value) => {
      return (selectedTypes.value.includes('ALL') && value !== 'ALL') ||
             (value !== 'ALL' && selectedTypes.value.some(type => type === 'ALL'));
    };

    const handleTypeChange = (value) => {
      if (value === 'ALL') {
        selectedTypes.value = selectedTypes.value.includes('ALL') ? ['ALL'] : [];
      } else {
        selectedTypes.value = selectedTypes.value.filter(type => type !== 'ALL');
      }
    };

    const isSizeDisabled = (value) => {
      return (selectedSizes.value.includes('ALL') && value !== 'ALL') ||
             (value !== 'ALL' && selectedSizes.value.some(size => size === 'ALL'));
    };

    const handleSizeChange = (value) => {
      if (value === 'ALL') {
        selectedSizes.value = selectedSizes.value.includes('ALL') ? ['ALL'] : [];
      } else {
        selectedSizes.value = selectedSizes.value.filter(size => size !== 'ALL');
      }
    };

    // 서비스 기간이 변경될 때 예약 가능 시간 유효성 검사
    watch([startDate, endDate], ([newStartDate, newEndDate]) => {
      if (newStartDate && newEndDate) {
        timeSlots.value = timeSlots.value.map(slot => {
          const slotStartDate = slot.date ? slot.date : '';
          const slotEndDate = slot.date ? slot.date : '';
          
          // 기간을 벗어난 시간대는 초기화
          if (slotStartDate < newStartDate || slotStartDate > newEndDate ||
              slotEndDate < newStartDate || slotEndDate > newEndDate) {
            return { date: '', startHour: '', endHour: '' };
          }
          return slot;
        });
      }
    });

    const handleSubmit = async () => {
      try {
        // 유효성 검사
        if (selectedTypes.value.length === 0) {
          toast.error('서비스 유형을 선택해주세요.');
          return;
        }
        if (selectedSizes.value.length === 0) {
          toast.error('돌봄 가능한 크기를 선택해주세요.');
          return;
        }

        // 시간대 유효성 검사 및 포맷팅
        const formattedTimeSlots = timeSlots.value.map(slot => {
          if (!slot.date || !slot.startHour || !slot.endHour) {
            throw new Error('모든 시간대를 입력해주세요.');
          }

          return {
            startTime: `${slot.date}T${slot.startHour}:00:00.000Z`,
            endTime: `${slot.date}T${slot.endHour}:00:00.000Z`
          };
        });

        const serviceData = {
          serviceTypes: selectedTypes.value,
          availableSizes: selectedSizes.value,
          availableTimes: formattedTimeSlots,
          hourlyPrice: parseInt(hourlyPrice.value),
          availableStartDate: startDate.value,
          availableEndDate: endDate.value
        };

        const response = await petsitterApi.createService(serviceData);
        
        if (response.data.status === 'success') {
          toast.success('서비스가 성공적으로 등록되었습니다.');
          router.back();
        }
      } catch (error) {
        if (error.message) {
          toast.error(error.message);
        } else {
          console.error('서비스 등록 실패:', error);
          toast.error(error.response?.data?.message || '서비스 등록에 실패했습니다.');
        }
      }
    };

    const goBack = () => {
      router.back();
    };

    return {
      serviceTypes,
      availableSizes,
      selectedTypes,
      selectedSizes,
      startDate,
      endDate,
      hourlyPrice,
      timeSlots,
      today,
      addTimeSlot,
      removeTimeSlot,
      handleSubmit,
      goBack,
      isTypeDisabled,
      handleTypeChange,
      isSizeDisabled,
      handleSizeChange,
      availableHours,
      availableEndHours
    };
  }
};
</script>

<style scoped>
.service-register-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 100px 20px 40px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
}

.service-form {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
  opacity: 1;
  transition: opacity 0.2s;
}

.checkbox-group label:has(input:disabled) {
  opacity: 0.5;
  cursor: not-allowed;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-inputs input {
  flex: 1;
}

input[type="date"],
input[type="datetime-local"],
input[type="number"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-slot input {
  flex: 1;
}

.remove-slot {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  padding: 5px;
}

.add-slot {
  background: none;
  border: 1px dashed #ddd;
  padding: 10px;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
}

.add-slot:hover {
  background: #f5f5f5;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.form-actions button {
  padding: 12px 30px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button {
  background: #333;
  color: white;
  border: none;
}

.cancel-button {
  background: white;
  border: 1px solid #ddd;
}

.submit-button:hover {
  background: #444;
}

.cancel-button:hover {
  background: #f5f5f5;
}

.time-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.time-input-group input[type="date"],
.time-input-group select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.time-input-group input[type="date"] {
  flex: 2;
}

.time-input-group select {
  flex: 1;
}

.time-input-group span {
  margin: 0 5px;
}
</style>