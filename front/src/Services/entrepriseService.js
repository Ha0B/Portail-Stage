import api from './api';

const entrepriseService = {

  getAll: async () => {
    const response = await api.get(
      '/entreprise/lister'
    );

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/entreprise/${id}`
    );

    return response.data;
  },

  getOffres: async (id) => {
    const response = await api.get(
      `/offre/entreprise/${id}`
    );

    return response.data;
  },

  create: async (data) => {
    const response = await api.post(
      '/entreprise/ajouter',
      data
    );

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(
      `/entreprise/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/entreprise/${id}`
    );

    return response.data;
  }

};

export default entrepriseService;