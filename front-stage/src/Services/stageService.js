import api from './api';

const stageService = {

  getAll: async () => {
    const response = await api.get('/stage');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/stage/${id}`
    );

    return response.data;
  },

  getByEtudiant: async (id) => {
    const response = await api.get(
      `/stage/etudiant/${id}`
    );

    return response.data;
  },

  getEtudiantByEncadrant: async (id) => {
    const response = await api.get(
      `/stage/encadrant/${id}`
    );
    return response.data;
  },

  getStagiairesByEntreprise: async (id) => {
    const response = await api.get(`/stage/entreprise/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post(
      '/stage',
      data
    );

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(
      `/stage/${id}`,
      data
    );

    return response.data;
  },

  updateStatus: async (id, statut) => {
    const response = await api.put(
      `/stage/${id}/statut`,
      statut, 
      {
        headers: {
          'Content-Type': 'text/plain'
        }
      }
    );

    return response.data;
  },

  genererSignatureOTP: async (id) => {
    const response = await api.post(`/stage/${id}/otp`);
    return response.data;
  },

  verifyDates: async (id) => {
    const response = await api.put(
      `/stage/${id}/verifier-dates`
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/stage/${id}`
    );

    return response.data;
  }

};

export default stageService;