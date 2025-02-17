import axios from 'axios';

// 인증이 필요한 API 요청을 위한 인스턴스
export const authInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json;charset=UTF-8'  // Accept 헤더 추가
  },
  withCredentials: true  // 인증이 필요한 요청에만 적용
});

// 인증이 필요없는 API 요청을 위한 인스턴스
export const publicInstance = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true  // 로그인 요청에도 필요
});

// 응답 인터셉터 (인증 필요한 요청용)
authInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response); // 에러 로깅 추가
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = '/login';
      }
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
publicInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response);
    // authInstance와 동일한 방식으로 에러 변환
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);