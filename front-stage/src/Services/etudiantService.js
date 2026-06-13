import api from './api';

const etudiantService = {

  getAll: async () => {
    const response = await api.get(
      '/etudiant/lister'
    );

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/etudiant/${id}`
    );

    return response.data;
  },

  getCandidatures: async (id) => {
    const response = await api.get(
      `/etudiant/candidatures/${id}`
    );

    return response.data;
  },

  getStages: async (id) => {
    const response = await api.get(
      `/etudiant/stages/${id}`
    );

    return response.data;
  },

  getConventions: async (id) => {
    const response = await api.get(
      `/etudiant/conventions/${id}`
    );

    return response.data;
  },

  create: async (data) => {
    const response = await api.post(
      '/etudiant/ajouter',
      data
    );

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(
      `/etudiant/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/etudiant/${id}`
    );

    return response.data;
  }

};

export default etudiantService;