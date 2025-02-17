<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? '코드 그룹 수정' : '새 코드 그룹 추가' }}</h2>
        <button class="close-button" @click="$emit('close')">&times;</button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label>그룹 ID</label>
          <input 
            v-model="formData.codeGroupId" 
            :disabled="isEdit"
            placeholder="영문, 숫자, 언더스코어만 사용 가능"
            pattern="^[A-Za-z0-9_]+$"
            required
          >
          <small v-if="isEdit" class="help-text">코드 그룹 ID는 수정할 수 없습니다.</small>
        </div>
        
        <div class="form-group">
          <label>그룹명</label>
          <input 
            v-model="formData.codeGroupName" 
            placeholder="그룹명을 입력하세요"
            required
          >
        </div>
        
        <div class="form-group">
          <label>설명</label>
          <textarea 
            v-model="formData.codeGroupDescription" 
            placeholder="그룹에 대한 설명을 입력하세요"
            rows="3"
          ></textarea>
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
    groupData: {
      type: Object,
      default: null
    }
  },
  
  setup(props, { emit }) {
    const isEdit = ref(!!props.groupData);
    const isSubmitting = ref(false);
    const formData = ref({
      codeGroupId: '',
      codeGroupName: '',
      codeGroupDescription: ''
    });

    onMounted(() => {
      if (props.groupData) {
        formData.value = { ...props.groupData };
      }
    });

    const handleSubmit = async (event) => {
      event.preventDefault();
      if (isSubmitting.value) return;
      
      isSubmitting.value = true;
      
      const submitData = {
        codeGroupId: formData.value.codeGroupId,
        codeGroupName: formData.value.codeGroupName,
        codeGroupDescription: formData.value.codeGroupDescription
      };
      
      try {
        await emit('submit', submitData);
      } catch (error) {
        console.error('Submit error:', error);
      } finally {
        isSubmitting.value = false; // 성공/실패 상관없이 제출 상태 초기화
      }
    };

    const resetForm = () => {
      isSubmitting.value = false;
      if (props.groupData) {
        formData.value = { ...props.groupData };
      } else {
        formData.value = {
          codeGroupId: '',
          codeGroupName: '',
          codeGroupDescription: ''
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5em;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  padding: 0 8px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.cancel-button,
.submit-button {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.cancel-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.submit-button:hover {
  background-color: #45a049;
}

.help-text {
  font-size: 0.8em;
  color: #666;
  margin-top: 4px;
}
</style> 