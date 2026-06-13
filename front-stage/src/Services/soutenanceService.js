import api from './api';

const soutenanceService = {

  getAll: async () => {
    const response = await api.get('/soutenance');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/soutenance/${id}`
    );

    return response.data;
  },
    // Dans soutenanceService.js

    getByJuryEncadrant: async (idEncadrant) => {
        const response = await api.get(`/soutenance/jury/${idEncadrant}`);
        return response.data;
    },

  getPlanning: async () => {
    const response = await api.get(
      '/soutenance/planning'
    );

    return response.data;
  },

  getBySalle: async (salle) => {
    const response = await api.get(
      `/soutenance/salle/${salle}`
    );

    return response.data;
  },

  getSoutenancByEtudiant: async(idEtudiant) =>{
    const response = await api.get(
      `/soutenance/etudiant/${idEtudiant}`
    );
    return response.data ;
  },

    getSoutenanceByEncadrant : async (idEncadrant) => {
      const response = await api.get(
          `/soutenance/encadrant/${idEncadrant}`
      ) ;
      return response.data;
    },

  getByDate: async (date) => {
    const response = await api.get(
      `/soutenance/date/${date}`
    );

    return response.data;
  },

  create: async (data) => {
    const response = await api.post(
      '/soutenance',
      data
    );

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(
      `/soutenance/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/soutenance/${id}`
    );

    return response.data;
  }

};

export default soutenanceService;