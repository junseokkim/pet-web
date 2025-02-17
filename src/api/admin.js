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

  updateCodeGroup: async (codeGroupId, codeGroupData) => {
    const response = await authInstance.patch(`/code-group/${codeGroupId}`, codeGroupData);
    return response;
  },

  deleteCodeGroup: async (codeGroupId) => {
    const response = await authInstance.delete(`/code-group/${codeGroupId}`);
    return response;
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
    const response = await authInstance.post('/code-details', codeDetailData);
    return response;
  },

  updateCodeDetail: async (detailId, codeDetailData) => {
    const response = await authInstance.patch(`/code-details/${detailId}`, codeDetailData);
    return response;
  },

  deleteCodeDetail: async (detailId) => {
    const response = await authInstance.delete(`/code-details/${detailId}`);
    return response;
  }
}; 