import { authInstance } from '@/api/axios';
import axios from 'axios';

export const petsitterApi = {
  getPetsitter: () => {
    return authInstance.get('/pet-sitters');
  },
  
  registerPetsitter: (data) => {
    return authInstance.post('/pet-sitters', data);
  },

  getPetsitterDetail: (id) => {
    return axios.get(`/api/v1/pet-sitters/${id}`);
  },

  deletePetsitter: (id) => {
    return axios.delete(`/api/v1/pet-sitters/${id}`);
  }
}; 