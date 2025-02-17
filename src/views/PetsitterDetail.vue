<template>
  <div class="petsitter-detail-container">
    <div class="profile-header">
      <div class="profile-image-container">
        <img :src="profileImage" alt="펫시터 프로필" class="profile-image" />
      </div>
      <div class="profile-info">
        <h2 class="name">{{ petsitter.name }}</h2>
        <p class="location">{{ petsitter.location }}</p>
      </div>
      <div v-if="petsitter.isMine" class="action-buttons">
        <button class="edit-button" @click="handleEdit">수정</button>
        <button class="delete-button" @click="handleDelete">삭제</button>
      </div>
    </div>

    <div class="detail-section">
      <div class="info-item">
        <h3>연락처</h3>
        <p>{{ petsitter.contact }}</p>
      </div>

      <div class="info-item">
        <h3>이용 요금</h3>
        <p>{{ formatPrice(petsitter.price) }}원</p>
      </div>

      <div class="info-item">
        <h3>가능 시간</h3>
        <p>{{ petsitter.availableTime }}</p>
      </div>

      <div class="info-item">
        <h3>돌봄 가능한 동물</h3>
        <div class="pet-types">
          <span v-for="type in petsitter.petTypes" :key="type" class="pet-type">
            {{ getPetTypeLabel(type) }}
          </span>
        </div>
      </div>

      <div class="info-item">
        <h3>소개</h3>
        <p>{{ petsitter.introduce || '소개글이 없습니다.' }}</p>
      </div>

      <div class="info-item">
        <h3>경력사항</h3>
        <p>{{ petsitter.experience || '경력사항이 없습니다.' }}</p>
      </div>

      <div class="services-section" v-if="services.length > 0">
        <h3>제공 서비스</h3>
        <div class="services-grid">
          <div v-for="service in services" :key="service.serviceId" 
               class="service-card" @click="viewServiceDetail(service.serviceId)">
            <div class="service-info">
              <div class="service-types">
                <span v-for="type in service.serviceTypes" :key="type" 
                      class="service-type">{{ getServiceTypeLabel(type) }}</span>
              </div>
              <div class="service-period">
                {{ formatDate(service.availableStartDate) }} ~ 
                {{ formatDate(service.availableEndDate) }}
              </div>
              <div class="service-price">
                시간당 {{ formatPrice(service.hourlyPrice) }}원
              </div>
              <div class="service-sizes">
                <span v-for="size in service.availableSizes" :key="size" 
                      class="size-tag">{{ getSizeLabel(size) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="petsitter.isMine" class="service-management">
        <button class="add-service-button" @click="goToServiceManagement">
          서비스 관리하기
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import { petsitterApi } from '@/api/petsitter';
import DefaultProfileImage from '@/assets/default-profile.png';
import { formatDate } from '@/utils/dateUtils';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const petsitter = ref({});
    const services = ref([]);

    const fetchPetsitterDetail = async () => {
      try {
        const response = await petsitterApi.getPetsitterDetail(route.params.id);
        if (response.data.status === 'success') {
          petsitter.value = response.data.data;
        }
      } catch (error) {
        console.error('펫시터 상세 정보 조회 실패:', error);
        toast.error('펫시터 정보를 불러오는데 실패했습니다.');
      }
    };

    const fetchServices = async () => {
      try {
        const response = await petsitterApi.getPetsitterServices(route.params.id);
        if (response.data.status === 'success') {
          services.value = response.data.data.services;
        }
      } catch (error) {
        console.error('서비스 목록 조회 실패:', error);
      }
    };

    const handleEdit = () => {
      router.push(`/petsitter/edit/${petsitter.value.petSitterId}`);
    };

    const handleDelete = async () => {
      if (confirm('정말 삭제하시겠습니까?')) {
        try {
          await petsitterApi.deletePetsitter(petsitter.value.petSitterId);
          toast.success('펫시터 프로필이 삭제되었습니다.');
          router.push('/mypage');
        } catch (error) {
          console.error('펫시터 프로필 삭제 실패:', error);
          toast.error('삭제에 실패했습니다.');
        }
      }
    };

    const formatPrice = (price) => {
      return price?.toLocaleString();
    };

    const getPetTypeLabel = (type) => {
      const types = {
        DOG: '강아지',
        CAT: '고양이'
      };
      return types[type] || type;
    };

    const getServiceTypeLabel = (type) => {
      const types = {
        WALK: '산책',
        CARE: '돌봄',
        TRAINING: '훈련'
      };
      return types[type] || type;
    };

    const getSizeLabel = (size) => {
      const sizes = {
        SMALL: '소형',
        MEDIUM: '중형',
        LARGE: '대형'
      };
      return sizes[size] || size;
    };

    const viewServiceDetail = (serviceId) => {
      router.push(`/service/${serviceId}`);
    };

    const goToServiceManagement = () => {
      router.push(`/petsitter/${route.params.id}/services/manage`);
    };

    const profileImage = computed(() => {
      return petsitter.value.profileUrl || DefaultProfileImage;
    });

    onMounted(() => {
      fetchPetsitterDetail();
      fetchServices();
    });

    return {
      petsitter,
      profileImage,
      handleEdit,
      handleDelete,
      formatPrice,
      getPetTypeLabel,
      services,
      getServiceTypeLabel,
      getSizeLabel,
      formatDate,
      viewServiceDetail,
      goToServiceManagement
    };
  }
};
</script>

<style scoped>
.petsitter-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 100px 20px 40px;
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
}

.profile-image-container {
  width: 150px;
  height: 150px;
  border-radius: 75px;
  overflow: hidden;
  margin-right: 30px;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.name {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.location {
  color: #666;
  font-size: 16px;
}

.action-buttons {
  position: absolute;
  top: 0;
  right: 0;
}

.action-buttons button {
  margin-left: 10px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.edit-button {
  background-color: #333;
  color: white;
  border: none;
}

.delete-button {
  background-color: white;
  color: #ff4444;
  border: 1px solid #ff4444;
}

.detail-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-item {
  margin-bottom: 25px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.info-item p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

.pet-types {
  display: flex;
  gap: 10px;
}

.pet-type {
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
}

.services-section {
  margin-top: 40px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.service-card {
  background: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s;
}

.service-card:hover {
  transform: translateY(-3px);
}

.service-types {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.service-type {
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.service-period {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.service-price {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
}

.size-tag {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 4px;
}

.service-management {
  margin-top: 30px;
  text-align: center;
}

.add-service-button {
  background: #333;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.add-service-button:hover {
  background: #444;
}
</style> 