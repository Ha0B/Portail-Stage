import api from './api';

const offreService = {

  getAll: async () => {
    const response = await api.get('/offre');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/offre/${id}`);
    return response.data;
  },

  getByEntreprise: async (id) => {
    const response = await api.get(
      `/offre/entreprise/${id}`
    );
    return response.data;
  },

  create: async (offreData) => {
    const response = await api.post(
      '/offre',
      offreData
    );

    return response.data;
  },

  update: async (id, offreData) => {
    const response = await api.put(
      `/offre/${id}`,
      offreData
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/offre/${id}`
    );

    return response.data;
  }

};

export default offreService;