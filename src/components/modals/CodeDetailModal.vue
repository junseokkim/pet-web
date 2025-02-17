<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? '코드 상세 수정' : '새 코드 상세 추가' }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label>코드 ID</label>
          <input 
            v-model="formData.codeDetailId" 
            :disabled="isEdit"
            placeholder="영문, 숫자, 언더스코어만 사용 가능"
            pattern="^[A-Za-z0-9_]+$"
            required
          >
          <small v-if="isEdit" class="help-text">코드 상세 ID는 수정할 수 없습니다.</small>
        </div>
        
        <div class="form-group">
          <label>코드명</label>
          <input 
            v-model="formData.codeDetailName" 
            placeholder="코드 이름을 입력하세요"
            required
          >
        </div>

        <div class="form-group">
          <label>코드값</label>
          <input 
            v-model="formData.codeDetailValue" 
            placeholder="코드 값을 입력하세요"
            required
          >
        </div>

        <div class="form-group">
          <label>정렬 순서</label>
          <input 
            type="number"
            v-model.number="formData.sortOrder"
            min="1"
            required
          >
        </div>

        <div class="modal-actions">
          <button type="button" class="cancel-button" @click="$emit('close')">취소</button>
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            {{ isEdit ? '수정' : '추가' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  props: {
    detailData: {
      type: Object,
      default: null
    },
    codeGroupId: {
      type: String,
      required: true
    }
  },

  setup(props, { emit }) {
    const isEdit = ref(!!props.detailData);
    const isSubmitting = ref(false);
    const formData = ref({
      codeGroupId: props.codeGroupId,
      codeDetailId: '',
      codeDetailName: '',
      codeDetailValue: '',
      sortOrder: 1
    });

    // 수정 모드일 때 기존 데이터로 초기화
    onMounted(() => {
      if (props.detailData) {
        formData.value = { ...props.detailData };
      }
    });

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (isSubmitting.value) return;
      
      isSubmitting.value = true;
      
      try {
        await emit('submit', { ...formData.value });
      } catch (error) {
        console.error('Submit error:', error);
      } finally {
        isSubmitting.value = false;
      }
    };

    const resetForm = () => {
      isSubmitting.value = false;
      if (props.detailData) {
        formData.value = { ...props.detailData };
      } else {
        formData.value = {
          codeGroupId: props.codeGroupId,
          codeDetailId: '',
          codeDetailName: '',
          codeDetailValue: '',
          sortOrder: 1
        };
      }
    };

    return {
      isEdit,
      formData,
      handleSubmit,
      isSubmitting,
      resetForm
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.submit-button, .cancel-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button {
  background: #4CAF50;
  color: white;
  border: none;
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-button {
  background: white;
  border: 1px solid #ddd;
}

.help-text {
  font-size: 0.8em;
  color: #666;
  margin-top: 4px;
}
</style> 