<template>
    <div class="profile-field">
      <label class="profile-label">{{ label }}</label>
      <div class="profile-value">{{ value }}</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      label: String,
      value: String,
    },
  };
  </script>
  
  <style scoped>
  /* ✅ 프로필 필드 전체 스타일 (가로 길이 조정) */
  .profile-field {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 400px; /* ✅ 기존보다 넓게 설정 */
    padding: 14px; /* ✅ 내부 여백 추가 */
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 16px;
    background-color: #f8f8f8; /* ✅ 입력 불가능한 필드 느낌 */
    margin-bottom: 10px; /* ✅ 필드 간 간격 조정 */
  }
  
  /* ✅ 라벨 스타일 */
  .profile-label {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    flex-shrink: 0;
    width: 100px; /* ✅ 더 넓게 설정 */
    text-align: left;
  }
  
  /* ✅ 값 스타일 */
  .profile-value {
    flex: 1;
    text-align: left;
    font-size: 16px;
    color: #000;
    padding-left: 12px;
  }
  </style>
  