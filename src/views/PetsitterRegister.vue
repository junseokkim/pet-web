<template>
  <div class="petsitter-register-container">
    <h2 class="title">펫시터 프로필 등록</h2>
    
    <form @submit.prevent="handleSubmit" class="register-form">
      <div class="form-group">
        <label for="name">이름 <span class="required">*</span></label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name"
          required
          maxlength="20"
          placeholder="펫시터 이름을 입력해주세요"
          @input="validateName"
          :class="{ 'error-input': errors.name }"
        >
        <span class="error-message" v-if="errors.name">{{ errors.name }}</span>
      </div>

      <div class="form-group">
        <label for="contact">연락처 <span class="required">*</span></label>
        <input 
          type="tel" 
          id="contact" 
          v-model="formData.contact"
          required
          placeholder="연락처를 입력해주세요 (예: 010-1234-5678)"
          @input="formatPhoneNumber"
          maxlength="13"
        >
        <span class="error-message" v-if="errors.contact">{{ errors.contact }}</span>
      </div>

      <div class="form-group">
        <label for="price">시간당 요금 (원) <span class="required">*</span></label>
        <div class="price-input-container">
          <input 
            type="text" 
            id="price" 
            v-model="displayPrice"
            required
            placeholder="시간당 요금을 입력해주세요"
            @input="handlePriceInput"
            @blur="validatePrice"
          >
          <div class="price-controls">
            <button type="button" @click="adjustPrice(1000)" class="price-button">▲</button>
            <button type="button" @click="adjustPrice(-1000)" class="price-button">▼</button>
          </div>
        </div>
        <span class="price-hint">1,000원 단위로 입력해주세요 (최소 10,000원)</span>
        <span class="error-message" v-if="errors.price">{{ errors.price }}</span>
      </div>

      <div class="form-group">
        <label for="availableTime">가능한 시간 <span class="required">*</span></label>
        <input 
          type="text" 
          id="availableTime" 
          v-model="formData.availableTime"
          required
          placeholder="예: 평일 오전 9시 ~ 오후 6시"
          :class="{ 'error-input': errors.availableTime }"
        >
        <span class="error-message" v-if="errors.availableTime">{{ errors.availableTime }}</span>
      </div>

      <div class="form-group">
        <label for="introduce">자기소개 <span class="required">*</span></label>
        <textarea 
          id="introduce" 
          v-model="formData.introduce"
          required
          placeholder="자기소개를 입력해주세요 (최소 10자)"
          @input="validateIntroduce"
          :class="{ 'error-input': errors.introduce }"
        ></textarea>
        <span class="error-message" v-if="errors.introduce">{{ errors.introduce }}</span>
      </div>

      <div class="form-group">
        <label for="experience">경력사항</label>
        <textarea 
          id="experience" 
          v-model="formData.experience"
          placeholder="관련 경력사항을 입력해주세요"
          :class="{ 'error-input': errors.experience }"
        ></textarea>
        <span class="error-message" v-if="errors.experience">{{ errors.experience }}</span>
      </div>

      <div class="form-group">
        <label>돌봄 가능한 반려동물 <span class="required">*</span></label>
        <div class="checkbox-group" :class="{ 'error-border': errors.petTypes }">
          <label v-for="type in petTypes" :key="type.value">
            <input 
              type="checkbox" 
              :value="type.value" 
              v-model="formData.petTypes"
            > {{ type.label }}
          </label>
        </div>
        <span class="error-message" v-if="errors.petTypes">{{ errors.petTypes }}</span>
      </div>

      <div class="address-section">
        <div class="form-group">
          <label for="region">시/도</label>
          <input 
            type="text" 
            id="region" 
            v-model="formData.region"
            required
            placeholder="예: 서울특별시"
          >
        </div>

        <div class="form-group">
          <label for="district">구/군</label>
          <input 
            type="text" 
            id="district" 
            v-model="formData.district"
            required
            placeholder="예: 강남구"
          >
        </div>

        <div class="form-group">
          <label for="neighborhood">동</label>
          <input 
            type="text" 
            id="neighborhood" 
            v-model="formData.neighborhood"
            required
            placeholder="예: 역삼동"
          >
        </div>

        <div class="form-group">
          <label for="address">상세주소</label>
          <input 
            type="text" 
            id="address" 
            v-model="formData.address"
            required
            placeholder="상세주소를 입력해주세요"
          >
        </div>
      </div>

      <div class="button-group">
        <button type="button" class="cancel-button" @click="router.go(-1)">취소</button>
        <button type="submit" class="submit-button">등록하기</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";
import { petsitterApi } from '@/api/petsitter';

export default {
  setup() {
    const router = useRouter();
    const toast = useToast();

    const petTypes = [
      { value: 'DOG', label: '강아지' },
      { value: 'CAT', label: '고양이' },
      { value: 'TURTLE', label: '거북이' },
      { value: 'BIRD', label: '새' },
      { value: 'RABBIT', label: '토끼' },
      { value: 'HAMSTER', label: '햄스터' },
      { value: 'FISH', label: '물고기' },
      { value: 'REPTILE', label: '파충류' },
      { value: 'OTHER', label: '그 이외' }
    ];

    const formData = ref({
      name: '',
      contact: '',
      price: null,
      availableTime: '',
      introduce: '',
      experience: '',
      petTypes: [],
      region: '',
      district: '',
      neighborhood: '',
      address: ''
    });

    const errors = ref({
      name: '',
      contact: '',
      price: '',
      availableTime: '',
      introduce: '',
      experience: '',
      petTypes: '',
      address: ''
    });

    // 가격 표시용 계산된 속성
    const displayPrice = computed({
      get: () => {
        return formData.value.price ? formData.value.price.toLocaleString() : '';
      },
      set: (value) => {
        handlePriceInput({ target: { value } });
      }
    });

    // 전화번호 형식화
    const formatPhoneNumber = (event) => {
      let value = event.target.value.replace(/[^\d]/g, '');
      
      if (value.length > 11) {
        value = value.slice(0, 11);
      }
      
      // 입력 길이에 따라 자동으로 하이픈 추가
      if (value.length <= 3) {
        formData.value.contact = value;
      } else if (value.length <= 7) {
        formData.value.contact = value.slice(0, 3) + '-' + value.slice(3);
      } else {
        formData.value.contact = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
      }
      
      // 전화번호 형식 즉시 검증
      validateContact();
    };

    // 가격 입력 처리
    const handlePriceInput = (event) => {
      let value = event.target.value.replace(/[^\d]/g, '');
      if (value) {
        value = parseInt(value);
        // 1000원 단위로 반올림
        value = Math.round(value / 1000) * 1000;
        formData.value.price = value;
      } else {
        formData.value.price = null;
      }
      validatePrice();  // 가격 변경 시 즉시 검증
    };

    // 가격 조정 버튼
    const adjustPrice = (amount) => {
      let currentPrice = formData.value.price || 0;
      let newPrice = currentPrice + amount;
      if (newPrice >= 10000) {  // 최소 10,000원
        formData.value.price = newPrice;
      }
    };

    // 유효성 검사 함수들
    const validateName = () => {
      if (!formData.value.name) {
        errors.value.name = '이름을 입력해주세요.';
      } else if (formData.value.name.length < 2) {
        errors.value.name = '이름은 최소 2자 이상이어야 합니다.';
      } else {
        errors.value.name = '';
      }
    };

    const validateContact = () => {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!formData.value.contact) {
        errors.value.contact = '연락처를 입력해주세요.';
      } else if (!phoneRegex.test(formData.value.contact)) {
        errors.value.contact = '올바른 휴대폰 번호 형식이 아닙니다.';
      } else {
        errors.value.contact = '';
      }
    };

    const validatePrice = () => {
      if (!formData.value.price) {
        errors.value.price = '시간당 요금을 입력해주세요.';
      } else if (formData.value.price < 10000) {
        errors.value.price = '최소 시간당 요금은 10,000원입니다.';
      } else if (formData.value.price % 1000 !== 0) {
        errors.value.price = '1,000원 단위로 입력해주세요.';
      } else {
        errors.value.price = '';
      }
    };

    const validateIntroduce = () => {
      if (!formData.value.introduce) {
        errors.value.introduce = '자기소개를 입력해주세요.';
      } else if (formData.value.introduce.length < 10) {
        errors.value.introduce = '자기소개는 최소 10자 이상 입력해주세요.';
      } else {
        errors.value.introduce = '';
      }
    };

    // 펫 타입 선택 시 즉시 검증
    const validatePetTypes = () => {
      if (formData.value.petTypes.length === 0) {
        errors.value.petTypes = '최소 한 개 이상의 돌봄 가능한 반려동물을 선택해주세요.';
      } else {
        errors.value.petTypes = '';
      }
    };

    // watch를 사용하여 petTypes 배열 변경 감지
    watch(() => formData.value.petTypes, validatePetTypes);

    const validateForm = () => {
      let isValid = true;
      
      // 각 필드 유효성 검사
      validateName();
      validateContact();
      validatePrice();
      
      if (!formData.value.availableTime) {
        errors.value.availableTime = '가능한 시간을 입력해주세요.';
        isValid = false;
      } else {
        errors.value.availableTime = '';
      }
      
      if (!formData.value.introduce || formData.value.introduce.length < 10) {
        errors.value.introduce = '자기소개는 최소 10자 이상 입력해주세요.';
        isValid = false;
      } else {
        errors.value.introduce = '';
      }
      
      // 경력사항은 입력된 경우에만 길이 체크
      if (formData.value.experience && formData.value.experience.length < 10) {
        errors.value.experience = '경력사항은 최소 10자 이상 입력해주세요.';
        isValid = false;
      } else {
        errors.value.experience = '';
      }
      
      if (formData.value.petTypes.length === 0) {
        errors.value.petTypes = '최소 한 개 이상의 돌봄 가능한 반려동물을 선택해주세요.';
        isValid = false;
      } else {
        errors.value.petTypes = '';
      }

      // 이름, 연락처, 가격 유효성 검사 결과 반영
      if (errors.value.name || errors.value.contact || errors.value.price) {
        isValid = false;
      }

      // 주소 관련 필드 검사
      if (!formData.value.region || !formData.value.district || 
          !formData.value.neighborhood || !formData.value.address) {
        errors.value.address = '모든 주소 정보를 입력해주세요.';
        isValid = false;
      } else {
        errors.value.address = '';
      }

      return isValid;
    };

    const handleSubmit = async () => {
      try {
        if (!validateForm()) {
          const errorFields = Object.entries(errors.value)
            .filter(([_, value]) => value !== '')
            .map(([key, value]) => {
              const fieldNames = {
                name: '이름',
                contact: '연락처',
                price: '시간당 요금',
                availableTime: '가능한 시간',
                introduce: '자기소개',
                experience: '경력사항',
                petTypes: '돌봄 가능한 반려동물',
                address: '주소'
              };
              return `${fieldNames[key]}: ${value}`;
            });

          if (errorFields.length > 0) {
            toast.error(`다음 항목을 확인해주세요:\n${errorFields.join('\n')}`, {
              duration: 5000,
              position: "top-center"
            });
          }
          return;
        }

        const response = await petsitterApi.registerPetsitter(formData.value);
        
        if (response.data.status === 'success') {
          toast.success('펫시터 프로필이 등록되었습니다.');
          router.push('/mypage');
        }
      } catch (error) {
        console.error('펫시터 등록 에러:', error);
        
        if (error.response?.data) {
          const errorMessage = error.response.data.message;
          if (errorMessage.includes('로그인이 필요합니다')) {
            toast.error("로그인이 필요합니다.");
            router.push('/login');
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error('펫시터 등록 중 오류가 발생했습니다.');
        }
      }
    };

    return {
      formData,
      errors,
      petTypes,
      displayPrice,
      handleSubmit,
      handlePriceInput,
      formatPhoneNumber,
      adjustPrice,
      validateName,
      validateContact,
      validatePrice,
      validateIntroduce,
      validatePetTypes,
      router
    };
  }
};
</script>

<style scoped>
.petsitter-register-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 100px 20px 40px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  margin-bottom: 20px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
}

.form-group input[type="text"],
.form-group input[type="tel"],
.form-group input[type="number"],
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.address-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.button-group button {
  flex: 1;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button {
  background-color: #333;
  color: white;
  border: none;
}

.cancel-button {
  background-color: white;
  color: #333;
  border: 1px solid #333;
}

.price-hint {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.required {
  color: #ff4444;
  margin-left: 2px;
}

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.price-input-container {
  display: flex;
  align-items: stretch;
  gap: 8px;
}

.price-input-container input {
  flex: 1;
}

.price-controls {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-button {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.price-button:hover {
  background: #eee;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #333;
}

.form-group input.error-input:focus,
.form-group textarea.error-input:focus {
  border-color: #ff4444;
}

.error-input {
  border-color: #ff4444 !important;
  background-color: #fff6f6;
}

.error-border {
  border: 1px solid #ff4444;
  border-radius: 4px;
  padding: 8px;
  background-color: #fff6f6;
}
</style> 