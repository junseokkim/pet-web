<template>
  <div class="home-container">
    <img src="@/assets/logo.png" alt="마이펫 로고" class="logo" />
    <h1>마이 펫에 오신 것을 환영합니다..!</h1>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh; /* ✅ 화면 전체를 차지하도록 설정 */
  text-align: center;
  margin: 0;
  padding: 0;
}

.logo {
  width: 220px; /* 이미지 크기 조정 */
  margin-bottom: 20px;
}

h1 {
  font-size: 40px;
  font-weight: bold;
}
</style>
