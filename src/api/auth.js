import { publicInstance, authInstance } from './axios';

export const authApi = {
  // 인증이 필요없는 요청들
  signup: async (userData) => {
    const response = await publicInstance.post('/members', userData);
    return response;
  },
  
  login: async (credentials) => {
    const response = await publicInstance.post('/auth', credentials);
    return response;
  },

  // 인증이 필요한 요청들
  logout: async () => {
    const response = await authInstance.post('/auth/logout');
    return response;
  },

  checkAuth: async () => {
    const response = await authInstance.get('/auth/check');
    return response;
  },

  // 회원 탈퇴
  withdraw: async () => {
    const response = await authInstance.delete('/members');
    return response;
  },

  // 회원 정보 조회
  getProfile: async () => {
    const response = await authInstance.get('/members');
    return response;
  },

  // 회원 정보 수정
  updateProfile: async (profileData) => {
    const response = await authInstance.patch('/members', profileData);
    return response;
  },

  // 비밀번호 변경
  changePassword: async (passwordData) => {
    const response = await authInstance.put('/members/password', passwordData);
    return response;
  },

  // 비밀번호 초기화
  resetPassword: async (email) => {
    const response = await publicInstance.put(`/auth/reset?email=${encodeURIComponent(email)}`);
    return response;
  }
}; 