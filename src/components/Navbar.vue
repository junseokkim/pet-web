<template>
    <nav class="navbar">
      <!-- 왼쪽: 사이트명 -->
      <div class="logo">마이 펫</div>
  
      <!-- 중앙: 네비게이션 메뉴 -->
      <ul class="nav-links">
        <li>
          <router-link to="/" :class="{ active: isCurrentRoute('/') }">홈</router-link>
        </li>
        <li>
          <router-link to="/shop" :class="{ active: isCurrentRoute('/shop') }">쇼핑몰</router-link>
        </li>
        <li>
          <router-link to="/petsitter" :class="{ active: isCurrentRoute('/petsitter') }">펫시터</router-link>
        </li>
        <li>
          <router-link to="/mypage" :class="{ active: isCurrentRoute('/mypage') }">마이페이지</router-link>
        </li>
      </ul>
  
      <!-- 오른쪽: 로그인 상태 -->
      <div class="auth">
        <router-link v-if="!authStore.isAuthenticated" to="/login">로그인</router-link>
        <span v-else class="username">{{ authStore.username }} 님 환영합니다.</span>
      </div>
    </nav>
  </template>
  
  <script>
  import { useAuthStore } from "@/stores/auth";
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';
  
  export default {
    setup() {
      const authStore = useAuthStore();
      const route = useRoute();
  
      const isCurrentRoute = (path) => {
        if (path === '/') {
          return route.path === '/';
        }
        return route.path.startsWith(path);
      };
  
      return { 
        authStore,
        isCurrentRoute
      };
    },
  };
  </script>
  
  <style scoped>
  /* ✅ 1. 상단바 기본 설정 */
  .navbar {
    width: 100%;
    height: 80px;
    background-color: #000; /* 검은색 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 80px; /* 좌우 간격 조정 */
    box-sizing: border-box;
    position: fixed; /* 최상단 고정 */
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  /* ✅ 2. 모든 글자 흰색 */
  .navbar * {
    color: #fff;
  }
  
  /* ✅ 3. 사이트명(왼쪽) */
  .logo {
    font-size: 30px; /* 더 크게 */
    font-weight: 800; /* 더 두껍게 */
  }
  
  /* ✅ 4. 네비게이션 메뉴 중앙 정렬 + 간격 더 넓히기 */
  .nav-links {
    display: flex;
    list-style: none;
    gap: 140px; /* ✅ 메뉴 간격 증가 */
    font-size: 20px; /* ✅ 글자 크기 증가 */
    font-weight: 500;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* ✅ 5. 네비게이션 링크 스타일 */
  .nav-links li a {
    text-decoration: none;
    transition: all 0.3s ease-in-out;
    padding: 8px 16px;
    border-radius: 20px;
    position: relative;
  }
  
  /* 활성화된 링크 스타일 */
  .nav-links li a.active {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 700;
  }
  
  /* 호버 효과 */
  .nav-links li a:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  /* 활성화된 링크 호버 효과 */
  .nav-links li a.active:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  /* ✅ 6. 로그인 (우측 정렬) */
  .auth {
    font-size: 16px;
    font-weight: 400;
  }
  </style>
  