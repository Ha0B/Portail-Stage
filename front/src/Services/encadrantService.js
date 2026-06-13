import api from './api';

const encadrantService = {

  getAll: async () => {
    const response = await api.get(
      '/encadrant/lister'
    );

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/encadrant/${id}`
    );

    return response.data;
  },

  getByEmail: async (email) => {
    const response = await api.get(
      `/encadrant/email/${email}`
    );

    return response.data;
  },

  create: async (data) => {
    const response = await api.post(
      '/encadrant/ajouter',
      data
    );

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(
      `/encadrant/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/encadrant/${id}`
    );

    return response.data;
  }

};

export default encadrantService;