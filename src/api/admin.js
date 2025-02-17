import { authInstance } from './axios';

export const adminApi = {
  // 코드 그룹 관련 API
  getCodeGroups: async () => {
    const response = await authInstance.get('/code-group');
    return response;
  },

  createCodeGroup: async (codeGroupData) => {
    try {
      const response = await authInstance.post('/code-group', codeGroupData);
      return response;
    } catch (error) {
      // 400 에러(중복 ID 등)는 그대로 throw
      if (error.response?.status === 400) {
        throw error;
      }
      // 다른 에러는 일반적인 에러로 처리
      throw new Error('코드 그룹 저장에 실패했습니다.');
    }
  },

  updateCodeGroup: async (originalGroupId, codeGroupData) => {
    try {
      const response = await authInstance.patch('/code-group', codeGroupData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteCodeGroup: async (groupId) => {
    try {
      const response = await authInstance.delete(`/code-group/${groupId}`);
      return response;
    } catch (error) {
      // 수정과 동일하게 에러를 그대로 throw
      throw error;
    }
  },

  // 코드 상세 관련 API
  getCodeDetails: async (groupId) => {
    const response = await authInstance.get(`/code-details/group/${groupId}`);
    return response;
  },

  getCodeDetail: async (detailId) => {
    const response = await authInstance.get(`/code-details/${detailId}`);
    return response;
  },

  createCodeDetail: async (codeDetailData) => {
    try {
      const response = await authInstance.post('/code-details', codeDetailData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateCodeDetail: async (codeDetailData) => {
    try {
      const response = await authInstance.patch('/code-details', codeDetailData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteCodeDetail: async (codeDetailId) => {
    try {
      const response = await authInstance.delete(`/code-details/${codeDetailId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 