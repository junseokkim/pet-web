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

  getPetsitterServices: async (petsitterId) => {
    try {
      const response = await authInstance.get(`/pet-sitters/${petsitterId}/services`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMyServices: async () => {
    try {
      const response = await authInstance.get('/pet-sitters/services');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMonthlyServices: (year, month) => {
    return publicInstance.get(`/pet-sitters/services/monthly?year=${year}&month=${month}`);
  },

  getServiceDetail: async (serviceId) => {
    try {
      const response = await authInstance.get(`/pet-sitters/services/${serviceId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createService: async (serviceData) => {
    try {
      const response = await authInstance.post('/pet-sitters/services', serviceData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteService: async (serviceId) => {
    try {
      const response = await authInstance.delete(`/pet-sitters/services/${serviceId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await authInstance.post('/bookings', bookingData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};