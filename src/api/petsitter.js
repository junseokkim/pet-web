import { authInstance, publicInstance } from '@/api/axios';

export const petsitterApi = {
  getPetsitterList: () => {
    return publicInstance.get('/pet-sitters/list');
  },

  getPetsitter: () => {
    return authInstance.get('/pet-sitters');
  },
  
  registerPetsitter: (data) => {
    return authInstance.post('/pet-sitters', data);
  },

  getPetsitterDetail: (id) => {
    return publicInstance.get(`/pet-sitters/${id}`);
  },

  deletePetsitter: (id) => {
    return authInstance.delete(`/pet-sitters/${id}`);
  },

  getPetsitterServices: (id) => {
    return publicInstance.get(`/pet-sitters/${id}/services`);
  },

  getMyServices: () => {
    return authInstance.get('/pet-sitters/services');
  },

  getMonthlyServices: (year, month) => {
    return publicInstance.get(`/pet-sitters/services/monthly?year=${year}&month=${month}`);
  },

  getServiceDetail: (serviceId) => {
    return publicInstance.get(`/pet-sitters/services/${serviceId}`);
  }
};