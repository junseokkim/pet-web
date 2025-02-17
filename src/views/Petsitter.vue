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
        <div class="view-toggle">
          <button :class="{ active: viewMode === 'list' }" 
                  @click="viewMode = 'list'">리스트</button>
          <button :class="{ active: viewMode === 'calendar' }" 
                  @click="viewMode = 'calendar'">캘린더</button>
        </div>
      </div>

      <!-- 리스트 뷰 -->
      <div v-if="viewMode === 'list'" class="services-list">
        <div v-if="services.length === 0" class="empty-wrapper">
          <p>등록된 서비스가 없습니다</p>
        </div>
        <div v-else class="services-grid">
          <div v-for="service in services" 
               :key="service.serviceId" 
               class="service-card"
               @click="viewServiceDetail(service.serviceId)">
            <div class="service-header">
              <div class="petsitter-info">
                <img :src="service.petSitter.profileImageUrl || require('@/assets/default-profile.png')" 
                     :alt="service.petSitter.name">
                <span>{{ service.petSitter.name }}</span>
              </div>
              <div class="service-price">
                {{ formatPrice(service.hourlyPrice) }}원/시간
              </div>
            </div>
            <div class="service-content">
              <div class="service-types">
                <span v-for="type in service.serviceTypes" 
                      :key="type" 
                      class="tag">{{ getServiceTypeLabel(type) }}</span>
              </div>
              <div class="service-period">
                {{ formatDate(service.availableStartDate) }} ~ 
                {{ formatDate(service.availableEndDate) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 캘린더 뷰 -->
      <div v-else class="calendar-view">
        <div class="calendar-header">
          <button @click="previousMonth">&lt;</button>
          <h3>{{ currentYear }}년 {{ currentMonth }}월</h3>
          <button @click="nextMonth">&gt;</button>
        </div>
        <div class="calendar-grid">
          <div class="calendar-days">
            <div v-for="day in ['일', '월', '화', '수', '목', '금', '토']" 
                 :key="day" class="day-header">{{ day }}</div>
          </div>
          <div class="calendar-dates">
            <div v-for="date in calendarDates" 
                 :key="date.fullDate" 
                 :class="['date-cell', { 
                   'other-month': !date.isCurrentMonth,
                   'has-services': date.services.length > 0
                 }]">
              <div class="date-number">{{ date.day }}</div>
              <div v-if="date.services.length > 0" class="service-dots">
                <span v-for="service in date.services.slice(0, 3)" 
                      :key="service.serviceId" 
                      class="service-dot"></span>
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
import defaultProfileImage from '@/assets/default-profile.png';

export default {
  setup() {
    const router = useRouter();
    const loading = ref(true);
    const petsitters = ref([]);
    const services = ref([]);
    const viewMode = ref('list');
    
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

    onMounted(() => {
      console.log('컴포넌트 마운트됨');
      fetchPetsitters();
    });

    return {
      loading,
      petsitters,
      services,
      viewMode,
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
</style>
