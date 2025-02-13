<template>
    <div class="input-container">
      <!-- ✅ 라벨과 입력 필드를 한 줄 정렬 -->
      <div class="input-row">
        <label class="input-label">{{ label }}</label>
        <input 
          :type="type" 
          :value="modelValue"
          @input="handleInput" 
          :placeholder="placeholder"
          class="input-field"
        />
      </div>
      <!-- ✅ showError가 true일 때만 에러 메시지 공간 유지 -->
      <p v-if="showError" class="error-message" :class="{ hidden: modelValue.trim() === '' || !errorMessage }">
        {{ errorMessage || " " }}
      </p>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      label: String,
      modelValue: String,
      type: {
        type: String,
        default: "text"
      },
      placeholder: String,
      errorMessage: String,
      showError: {
        type: Boolean,
        default: true // ✅ 기본값은 true (에러 메시지 공간 유지)
      }
    },
    emits: ["update:modelValue"],
    methods: {
      handleInput(event) {
        this.$emit("update:modelValue", event.target.value);
      }
    }
  };
  </script>
  
  <style scoped>
  /* ✅ 입력 필드 컨테이너 */
  .input-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 374px;
  }
  
  /* ✅ 라벨 + 입력 필드를 한 줄 정렬 */
  .input-row {
    display: flex;
    align-items: center;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 12px;
  }
  
  /* ✅ 라벨 스타일 */
  .input-label {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    flex-shrink: 0;
    width: 90px;
    text-align: left;
  }
  
  /* ✅ 입력 필드 */
  .input-field {
    flex: 1;
    border: none;
    text-align: left;
    font-size: 16px;
    outline: none;
    padding-left: 12px;
  }
  
  /* ✅ 플레이스홀더 색상 */
  .input-field::placeholder {
    color: #bbb;
  }
  
  /* ✅ 에러 메시지 (왼쪽 정렬 + 패딩 추가 + 입력이 없을 때 숨김) */
  .error-message {
    font-size: 12px;
    color: red;
    min-height: 16px;
    margin-top: 2px;
    text-align: left;
    padding-left: 12px;
  }
  
  /* ✅ 입력이 없거나 에러 메시지가 없을 때, 공간은 유지하지만 텍스트는 안 보이도록 설정 */
  .hidden {
    visibility: hidden;
  }
  </style>
  