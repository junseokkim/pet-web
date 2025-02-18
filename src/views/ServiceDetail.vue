<template>
  <div class="service-detail-container" v-if="service">
    <div class="petsitter-info">
      <img :src="service.petSitter.profileImageUrl || defaultProfileImage" 
           :alt="service.petSitter.name" 
           class="profile-image" />
      <div class="info">
        <h2>{{ service.petSitter.name }}</h2>
        <p>{{ service.petSitter.introduce }}</p>
      </div>
    </div>

    <div class="service-info">
      <div class="price-section">
        <h3>시간당 요금</h3>
        <p class="price">{{ formatPrice(service.hourlyPrice) }}원</p>
      </div>

      <div class="types-section">
        <h3>서비스 유형</h3>
        <div class="tags">
          <span v-for="type in service.serviceTypes" 
                :key="type" 
                class="tag">{{ getServiceTypeLabel(type) }}</span>
        </div>
      </div>

      <div class="sizes-section">
        <h3>돌봄 가능한 크기</h3>
        <div class="tags">
          <span v-for="size in service.availableSizes" 
                :key="size" 
                class="tag size">{{ getSizeLabel(size) }}</span>
        </div>
      </div>

      <div class="times-section">
        <h3>예약 가능 시간</h3>
        <div class="time-slots">
          <div v-if="availableTimeSlots.length === 0" class="no-times-message">
            예약 가능한 시간이 없습니다.
          </div>
          <div v-else v-for="time in service.availableTimes" 
               :key="time.timeSlotId" 
               class="time-slot"
               :class="{ 'booked': time.isBooked }">
            {{ formatDate(time.date) }} {{ formatTime(time.startTime) }}-{{ formatTime(time.endTime) }}
            <span v-if="time.isBooked" class="booked-tag">예약됨</span>
          </div>
        </div>
      </div>
    </div>

    <div class="action-section">
      <button v-if="service.isMine" 
              @click="handleDelete" 
              class="delete-button">
        서비스 삭제
      </button>
      <button v-else 
              @click="startBooking" 
              class="book-button"
              :disabled="!hasAvailableTimeSlots"
              :title="!hasAvailableTimeSlots ? '예약 가능한 시간이 없습니다' : ''">
        예약하기
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { petsitterApi } from '@/api/petsitter';
import defaultProfileImage from '@/assets/default-profile.png';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const service = ref(null);

    const getServiceTypeLabel = (type) => {
      const types = {
        'WALK': '산책',
        'VISITING_CARE': '방문 돌봄',
        'FOSTER_CARE': '위탁 돌봄',
        'ALL': '전체 서비스'
      };
      return types[type] || type;
    };

    const getSizeLabel = (size) => {
      const sizes = {
        'LARGE': '대형',
        'MEDIUM': '중형',
        'SMALL': '소형',
        'ALL': '전체 크기'
      };
      return sizes[size] || size;
    };

    const formatPrice = (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    };

    const formatTime = (timeStr) => {
      return timeStr.substring(0, 5);
    };

    const fetchServiceDetail = async () => {
      try {
        const response = await petsitterApi.getServiceDetail(route.params.id);
        if (response.data.status === 'success') {
          service.value = response.data.data;
        }
      } catch (error) {
        console.error('서비스 상세 조회 실패:', error);
        toast.error('서비스 정보를 불러오는데 실패했습니다.');
      }
    };

    const handleDelete = async () => {
      if (confirm('정말 이 서비스를 삭제하시겠습니까?')) {
        try {
          await petsitterApi.deleteService(route.params.id);
          toast.success('서비스가 삭제되었습니다.');
          router.back();
        } catch (error) {
          console.error('서비스 삭제 실패:', error);
          toast.error('서비스 삭제에 실패했습니다.');
        }
      }
    };

    const startBooking = () => {
      router.push(`/service/${route.params.id}/booking`);
    };

    const availableTimeSlots = computed(() => {
      if (!service.value?.availableTimes) return [];
      return service.value.availableTimes.filter(time => !time.isBooked);
    });

    const hasAvailableTimeSlots = computed(() => {
      return availableTimeSlots.value.length > 0;
    });

    onMounted(() => {
      fetchServiceDetail();
    });

    return {
      service,
      defaultProfileImage,
      getServiceTypeLabel,
      getSizeLabel,
      formatPrice,
      formatDate,
      formatTime,
      handleDelete,
      startBooking,
      availableTimeSlots,
      hasAvailableTimeSlots
    };
  }
};
</script>

<style scoped>
.service-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  margin-top: 80px;
}

.petsitter-info {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.service-info > div {
  margin-bottom: 25px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #2196F3;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  padding: 6px 12px;
  border-radius: 20px;
  background: #f0f0f0;
  font-size: 14px;
}

.tag.size {
  background: #e3f2fd;
  color: #1976d2;
}

.time-slots {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.time-slot {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-slot.booked {
  background: #f5f5f5;
  color: #999;
}

.booked-tag {
  background: #ff4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.action-section {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

.book-button, .delete-button {
  padding: 12px 30px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.book-button {
  background: #2196F3;
  color: white;
  border: none;
}

.delete-button {
  background: white;
  border: 1px solid #ff4444;
  color: #ff4444;
}

.book-button:hover {
  background: #1976d2;
}

.delete-button:hover {
  background: #ff4444;
  color: white;
}

.book-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.no-times-message {
  padding: 20px;
  text-align: center;
  color: #666;
  background: #f5f5f5;
  border-radius: 4px;
}
</style> 