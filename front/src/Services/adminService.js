import api from './api';

const adminService = {

  getAll: async () => {
    const response = await api.get(
      '/admin/lister'
    );

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/admin/${id}`
    );

    return response.data;
  },

  getByEmail: async (email) => {
    const response = await api.get(
      `/admin/email/${email}`
    );

    return response.data;
  },

  create: async (data) => {
    const response = await api.post(
      '/admin/ajouter',
      data
    );

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(
      `/admin/${id}`,
      data
    );

    return response.data;
  },

  changePassword: async (
    id,
    ancienMDP,
    nouveauMDP
  ) => {

    const response = await api.put(
      `/admin/${id}/changer-motdepasse`,
      null,
      {
        params: {
          ancienMDP,
          nouveauMDP
        }
      }
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/admin/${id}`
    );

    return response.data;
  }

};

export default adminService;
