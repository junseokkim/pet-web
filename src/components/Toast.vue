<template>
    <div class="toast">
      <p>{{ message }}</p>
      <button class="close-btn" @click="$emit('close')">✖</button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      message: String,
    },
  };
  </script>
  
  <style scoped>
  /* ✅ 토스트 메시지 스타일 */
  .toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: fadein 0.3s ease-in-out;
  }
  
  /* ✅ 닫기 버튼 */
  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
  }
  
  /* ✅ 애니메이션 */
  @keyframes fadein {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  </style>
  