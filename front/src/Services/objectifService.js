import api from './api';

const objectifService = {

  getAll: async () => {
    const response = await api.get('/objectifs');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/objectifs/${id}`);
    return response.data;
  },

  getByStage: async (stageId) => {
    const response = await api.get(`/objectifs/stage/${stageId}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/objectifs', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/objectifs/${id}`, data);
    return response.data;
  },

  valider: async (id) => {
  const response = await api.put(`/objectifs/${id}/valider`);
  return response.data;
},

rejeter: async (id) => {
  const response = await api.put(`/objectifs/${id}/rejeter`);
  return response.data;
},

  demarrer: async (id) => {
    const response = await api.put(`/objectifs/${id}`, {
      statut: 'EN_COURS'
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/objectifs/${id}`);
    return response.data;
  }

};

export default objectifService;