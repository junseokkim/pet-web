<template>
  <div class="service-management-container">
    <div class="header">
      <h2>서비스 관리</h2>
      <button class="add-button" @click="goToAddService">
        <i class="fas fa-plus"></i> 새 서비스 등록
      </button>
    </div>

    <div v-if="loading" class="loading-wrapper">
      <div class="loading-spinner"></div>
      <p>서비스 정보를 불러오는 중...</p>
    </div>

    <div v-else-if="services.length === 0" class="empty-wrapper">
      <p>등록된 서비스가 없습니다</p>
      <button class="add-button" @click="goToAddService">새 서비스 등록하기</button>
    </div>

    <div v-else class="services-grid">
      <div v-for="service in services" 
           :key="service.serviceId" 
           class="service-card">
        <div class="service-header">
          <div class="service-period">
            {{ formatDate(service.availableStartDate) }} ~ 
            {{ formatDate(service.availableEndDate) }}
          </div>
          <div class="service-price">
            {{ formatPrice(service.hourlyPrice) }}원/시간
          </div>
        </div>

        <div class="service-content">
          <div class="tag-section">
            <span class="tag-label">서비스 유형</span>
            <div class="tags">
              <template v-if="hasAllServiceType(service)">
                <span class="tag">산책</span>
                <span class="tag">방문 돌봄</span>
                <span class="tag">위탁 돌봄</span>
              </template>
              <template v-else>
                <span v-for="type in service.serviceTypes" 
                      :key="type" 
                      class="tag">{{ getServiceTypeLabel(type) }}</span>
              </template>
            </div>
          </div>

          <div class="tag-section">
            <span class="tag-label">가능한 크기</span>
            <div class="tags">
              <template v-if="hasAllSize(service)">
                <span class="tag size">대형</span>
                <span class="tag size">중형</span>
                <span class="tag size">소형</span>
              </template>
              <template v-else>
                <span v-for="size in service.availableSizes" 
                      :key="size" 
                      class="tag size">{{ getSizeLabel(size) }}</span>
              </template>
            </div>
          </div>
          
          <div class="available-times">
            <h4>예약 가능 시간</h4>
            <div class="time-slots">
              <div v-for="time in displayTimes(service)" 
                   :key="time.timeSlotId" 
                   class="time-slot"
                   :class="{ 'booked': time.isBooked }">
                {{ formatDate(time.date) }} 
                {{ formatTime(time.startTime) }}-{{ formatTime(time.endTime) }}
                <span v-if="time.isBooked" class="booked-tag">예약됨</span>
              </div>
              
              <button v-if="hasMoreTimes(service)" 
                      class="show-more-button"
                      @click="toggleShowMore(service)">
                {{ service.showAll ? '접기' : `${getRemainingCount(service)}개 더보기` }}
              </button>
            </div>
          </div>
        </div>

        <div class="service-actions">
          <button class="delete-button" @click="deleteService(service.serviceId)">
            삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { petsitterApi } from '@/api/petsitter';

export default {
  setup() {
    const router = useRouter();
    const toast = useToast();
    const loading = ref(true);
    const services = ref([]);
    const INITIAL_DISPLAY_COUNT = 3;

    const fetchServices = async () => {
      try {
        loading.value = true;
        const response = await petsitterApi.getMyServices();
        if (response.data.status === 'success') {
          services.value = response.data.data.services.map(service => ({
            ...service,
            showAll: false
          }));
        }
      } catch (error) {
        console.error('서비스 목록 조회 실패:', error);
        toast.error('서비스 목록을 불러오는데 실패했습니다.');
      } finally {
        loading.value = false;
      }
    };

    const formatPrice = (price) => {
      return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    const formatTime = (timeStr) => {
      return timeStr.substring(0, 5);
    };

    const goToAddService = () => {
      router.push('/service/register');
    };

    const deleteService = async (serviceId) => {
      if (confirm('정말 이 서비스를 삭제하시겠습니까?')) {
        try {
          const response = await petsitterApi.deleteService(serviceId);
          if (response.data.status === 'success') {
            toast.success('서비스가 삭제되었습니다.');
            // 목록 새로고침
            fetchServices();
          }
        } catch (error) {
          console.error('서비스 삭제 실패:', error);
          toast.error('서비스 삭제에 실패했습니다.');
        }
      }
    };

    const displayTimes = (service) => {
      if (service.showAll) {
        return service.availableTimes;
      }
      return service.availableTimes.slice(0, INITIAL_DISPLAY_COUNT);
    };

    const hasMoreTimes = (service) => {
      return service.availableTimes.length > INITIAL_DISPLAY_COUNT;
    };

    const getRemainingCount = (service) => {
      return service.availableTimes.length - INITIAL_DISPLAY_COUNT;
    };

    const toggleShowMore = (service) => {
      service.showAll = !service.showAll;
    };

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

    const hasAllServiceType = (service) => {
      return service.serviceTypes.includes('ALL');
    };

    const hasAllSize = (service) => {
      return service.availableSizes.includes('ALL');
    };

    onMounted(() => {
      fetchServices();
    });

    return {
      services,
      loading,
      formatPrice,
      formatDate,
      formatTime,
      goToAddService,
      deleteService,
      displayTimes,
      hasMoreTimes,
      getRemainingCount,
      toggleShowMore,
      getServiceTypeLabel,
      getSizeLabel,
      hasAllServiceType,
      hasAllSize
    };
  }
};
</script>

<style scoped>
.service-management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 100px 20px 40px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h2 {
  font-size: 24px;
  font-weight: bold;
}

.add-button {
  background: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-button:hover {
  background: #444;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.service-period {
  color: #666;
  font-size: 14px;
}

.service-price {
  font-weight: bold;
  color: #2196F3;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  background: #f0f0f0;
}

.available-times {
  margin-top: 15px;
}

.available-times h4 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #666;
}

.time-slots {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}

.time-slot {
  background: #f8f8f8;
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-slot.booked {
  background: #fff3f3;
}

.booked-tag {
  background: #ff4444;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
}

.service-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.delete-button {
  background: white;
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.delete-button:hover {
  background: #ff4444;
  color: white;
}

.loading-wrapper, .empty-wrapper {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.show-more-button {
  background: none;
  border: none;
  color: #2196F3;
  padding: 8px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  border-radius: 4px;
  margin-top: 5px;
}

.show-more-button:hover {
  background: #f0f9ff;
}

/* 스크롤바 스타일링 */
.time-slots::-webkit-scrollbar {
  width: 6px;
}

.time-slots::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.time-slots::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.time-slots::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.tag-section {
  margin-bottom: 15px;
}

.tag-label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #f0f0f0;
  color: #333;
}

.tag.size {
  background: #e3f2fd;
  color: #1976d2;
}
</style> 