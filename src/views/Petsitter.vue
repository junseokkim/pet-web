<template>
  <div class="petsitter-container">
    <!-- 상단 펫시터 프로필 섹션 -->
    <section class="petsitter-profiles">
      <div class="title-wrapper">
        <h2 class="section-title">펫시터</h2>
      </div>
      <div class="profiles-scroll" ref="scrollContainer">
        <div v-if="loading" class="empty-wrapper">
          <div class="loading-spinner"></div>
          <p>펫시터 정보를 불러오는 중...</p>
        </div>
        <div v-else-if="petsitters.length === 0" class="empty-wrapper">
          <p>등록된 펫시터가 없습니다</p>
        </div>
        <div v-else class="profiles-wrapper">
          <div v-for="petsitter in petsitters" 
               :key="petsitter.petSitterId" 
               class="profile-card"
               @click="goToDetail(petsitter.petSitterId)">
            <div class="profile-image">
              <img :src="petsitter.profileImageUrl || defaultProfileImage" 
                   :alt="petsitter.name">
            </div>
            <div class="profile-info">
              <h3>{{ petsitter.name }}</h3>
              <p>{{ petsitter.introduce || '소개글이 없습니다.' }}</p>
            </div>
          </div>
        </div>
        <!-- 스크롤 버튼 -->
        <button class="scroll-button left" @click="scroll('left')" 
                v-show="canScrollLeft">&lt;</button>
        <button class="scroll-button right" @click="scroll('right')" 
                v-show="canScrollRight">&gt;</button>
      </div>
    </section>

    <!-- 하단 서비스 섹션 -->
    <section class="services-section">
      <div class="title-wrapper">
        <h2 class="section-title">서비스</h2>
        <div class="month-selector">
          <button class="month-button" @click="changeMonth(-1)">
            &#10094;
          </button>
          <span class="current-month">{{ currentYear }}년 {{ currentMonth }}월</span>
          <button class="month-button" @click="changeMonth(1)">
            &#10095;
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-wrapper">
        <div class="loading-spinner"></div>
        <p>서비스 정보를 불러오는 중...</p>
      </div>

      <div v-else-if="services.length === 0" class="empty-wrapper">
        <p>해당 월에 등록된 서비스가 없습니다</p>
      </div>

      <div v-else class="services-grid">
        <div v-for="service in services" 
             :key="service.serviceId" 
             class="service-card"
             @click="viewServiceDetail(service.serviceId)">
          <div class="service-header">
            <div class="petsitter-info">
              <div class="profile-image">
                <img :src="service.petSitter.profileImageUrl || defaultProfileImage" 
                     :alt="service.petSitter.name"
                     @error="handleImageError">
              </div>
              <div class="petsitter-details">
                <h3>{{ service.petSitter.name }}</h3>
                <p>{{ service.petSitter.introduce || '소개글이 없습니다' }}</p>
              </div>
            </div>
            <div class="price">{{ formatPrice(service.hourlyPrice) }}원/시간</div>
          </div>

          <div class="service-content">
            <div class="service-types">
              <span v-for="type in service.serviceTypes" 
                    :key="type" 
                    class="tag">{{ type }}</span>
            </div>
            <div class="service-sizes">
              <span v-for="size in service.availableSizes" 
                    :key="size" 
                    class="tag size">{{ size }}</span>
            </div>
            <div class="service-period">
              {{ formatDate(service.availableStartDate) }} ~ 
              {{ formatDate(service.availableEndDate) }}
            </div>
            <div class="available-times">
              <p>예약 가능 시간</p>
              <div class="time-slots">
                <span v-for="time in service.availableTimes.slice(0, 3)" 
                      :key="time.timeSlotId"
                      class="time-slot">
                  {{ formatTime(time.startTime) }}-{{ formatTime(time.endTime) }}
                </span>
                <span v-if="service.availableTimes.length > 3" 
                      class="more-times">
                  외 {{ service.availableTimes.length - 3 }}개
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { petsitterApi } from '@/api/petsitter';
import { useToast } from 'vue-toastification';
import defaultProfileImage from '@/assets/default-profile.png';

export default {
  setup() {
    const router = useRouter();
    const toast = useToast();
    const loading = ref(false);
    const petsitters = ref([]);
    const services = ref([]);
    const currentYear = ref(new Date().getFullYear());
    const currentMonth = ref(new Date().getMonth() + 1);
    
    // 펫시터 목록 조회
    const fetchPetsitters = async () => {
      try {
        console.log('펫시터 목록 조회 시작');
        loading.value = true;
        const response = await petsitterApi.getPetsitterList();
        console.log('API Response:', response);
        
        if (response.data.status === 'success') {
          console.log('펫시터 데이터:', response.data.data.petSitters);
          petsitters.value = response.data.data.petSitters;
        }
      } catch (error) {
        console.error('펫시터 목록 조회 실패:', error);
      } finally {
        loading.value = false;
      }
    };

    const goToDetail = (petSitterId) => {
      router.push(`/petsitter/${petSitterId}`);
    };

    const fetchServices = async () => {
      loading.value = true;
      try {
        const response = await petsitterApi.getMonthlyServices(
          currentYear.value,
          currentMonth.value
        );
        if (response.data.status === 'success') {
          services.value = response.data.data.services;
        }
      } catch (error) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('서비스 목록을 불러오는데 실패했습니다.');
        }
      } finally {
        loading.value = false;
      }
    };

    const changeMonth = (delta) => {
      let newMonth = currentMonth.value + delta;
      let newYear = currentYear.value;

      if (newMonth > 12) {
        newMonth = 1;
        newYear++;
      } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
      }

      currentMonth.value = newMonth;
      currentYear.value = newYear;
      fetchServices();
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

    const handleImageError = (e) => {
      e.target.src = defaultProfileImage;
    };

    onMounted(() => {
      console.log('컴포넌트 마운트됨');
      fetchPetsitters();
      fetchServices();
    });

    return {
      loading,
      petsitters,
      services,
      currentYear,
      currentMonth,
      changeMonth,
      formatPrice,
      formatDate,
      formatTime,
      handleImageError,
      defaultProfileImage,
      goToDetail
    };
  }
};
</script>

<style scoped>
.petsitter-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 100px 20px 40px;
}

.title-wrapper {
  text-align: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.empty-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f8f8f8;
  border-radius: 12px;
  margin: 20px 0;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #333;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 프로필 섹션 스타일 */
.profiles-scroll {
  position: relative;
  overflow-x: hidden;
  padding: 20px 0;
}

.profiles-wrapper {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 0 40px;
}

.profiles-wrapper::-webkit-scrollbar {
  display: none;
}

.profile-card {
  flex: 0 0 200px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
  padding: 15px;  /* 패딩 추가 */
}

.profile-card:hover {
  transform: translateY(-5px);
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 15px auto;
  display: block;
  object-fit: cover;
  position: relative;  /* 추가 */
  overflow: hidden;   /* 추가 */
}
.profile-image img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  position: absolute;  /* 추가 */
  top: 0;             /* 추가 */
  left: 0;            /* 추가 */
}

.scroll-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 1;
}

.scroll-button.left { left: 0; }
.scroll-button.right { right: 0; }

/* 서비스 섹션 스타일 */
.services-section {
  margin-top: 40px;
  padding: 0 20px;
}

.services-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.view-toggle button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.view-toggle button.active {
  background: #333;
  color: white;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.petsitter-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.petsitter-info img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  object-fit: cover;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  background: #f0f0f0;
}

.tag.size {
  background: #e0e0e0;
}

/* 캘린더 뷰 스타일 */
.calendar-header {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.calendar-header button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 15px;
}

.month-button {
  background: #f5f5f5;  /* 배경색 추가 */
  border: 1px solid #ddd;  /* 테두리 추가 */
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;  /* 화살표 색상 추가 */
  transition: all 0.2s ease;  /* 부드러운 전환 효과 */
}

.month-button:hover {
  background-color: #e0e0e0;
  border-color: #ccc;
}

.current-month {
  font-size: 18px;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.service-card:hover {
  transform: translateY(-5px);
}

.service-header {
  margin-bottom: 15px;
}

.petsitter-info {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.profile-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.petsitter-details h3 {
  margin: 0;
  font-size: 1.1em;
}

.petsitter-details p {
  margin: 5px 0 0;
  color: #666;
  font-size: 0.9em;
}

.price {
  font-size: 1.2em;
  font-weight: 500;
  color: #2196F3;
  margin-top: 10px;
}

.service-period {
  margin: 10px 0;
  color: #666;
}

.available-times {
  margin-top: 15px;
}

.available-times p {
  margin: 0 0 5px;
  font-size: 0.9em;
  color: #666;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-slot {
  background: #e3f2fd;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.more-times {
  color: #666;
  font-size: 12px;
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
</style>