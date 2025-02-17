import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

// 인증이 필요한 요청에 사용할 인스턴스
export const authInstance = axios.create({
  baseURL,
  withCredentials: true
});

// 인증이 필요없는 요청에 사용할 인스턴스
export const publicInstance = axios.create({
  baseURL,
  withCredentials: true
});

// 인터셉터에서 에러 처리 수정
authInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

authInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 콘솔 로그 제거
    return Promise.reject(error);
  }
);

publicInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // 콘솔 로그 제거
    return Promise.reject(error);
  }
);