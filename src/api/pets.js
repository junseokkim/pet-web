import { authInstance } from './axios';

export const petsApi = {
  getMyPets: async () => {
    try {
      const response = await authInstance.get('/pets/my');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getMyPetDetail: async (petId) => {
    try {
      const response = await authInstance.get(`/pets/my/${petId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 