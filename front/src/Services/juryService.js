import api from './api';

const juryService = {

    getAll: async () => {
    const response = await api.get('/jury');
    return response.data;
    },

    getBySoutenance: async (soutenanceId) => {
        const response = await api.get(`/jury/soutenance/${soutenanceId}`);
        return response.data;
    },

    getByEncadrant : async (idEncadrant) => {
      const response = await api.get(`/jury/${idEncadrant}`);
      return response.data;
    },

    create: async (data) => {
    const response = await api.post(
      '/jury',
      data
    );

    return response.data;
    },

    update: async (id, data) => {
    const response = await api.put(
      `/jury/${id}`,
      data
    );

    return response.data;
    },

    delete: async (id) => {
    const response = await api.delete(
      `/jury/${id}`
    );

    return response.data;
    },

    search: async (nomJury) => {
    const response = await api.get(
      `/jury/trouver?nomJury=${nomJury}`
    );

    return response.data;
    }

};

export default juryService;