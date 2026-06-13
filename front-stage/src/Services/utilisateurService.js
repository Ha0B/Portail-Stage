import api from './api';

const utilisateurService = {

  getAll: async () => {
    const response = await api.get(
      '/utilisateur/lister'
    );

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/utilisateur/lister/${id}`
    );

    return response.data;
  },

  create: async (data) => {
    const response = await api.post(
      '/utilisateur/ajouter',
      data
    );

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(
      `/utilisateur/modifier/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/utilisateur/supprimer/${id}`
    );

    return response.data;
  }

};

export default utilisateurService;