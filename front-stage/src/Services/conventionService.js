import api from './api';

const conventionService = {

  getAll: async () => {
    const response = await api.get(
      '/conventions'
    );

    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(
      `/conventions/${id}`
    );

    return response.data;
  },

  getByEtudiant: async (id) => {
    const response = await api.get(
      `/etudiant/${id}/conventions`
    );

    return response.data;
  },

  create: async (data) => {
    const response = await api.post(
      '/conventions',
      data
    );

    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(
      `/conventions/${id}`,
      data
    );

    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(
      `/conventions/${id}`
    );

    return response.data;
  },

  sendOtp: async (id) => {
    const response = await api.post(
      `/conventions/${id}/otp`
    );

    return response.data;
  },

  validateOtp: async (id, otpData) => {
    const response = await api.post(
      `/conventions/${id}/valider-otp`,
      otpData
    );

    return response.data;
  },

  signer: async (id) => {
    const response = await api.post(
      `/conventions/${id}/signer`
    );

    return response.data;
  },

  getSignatureStatus: async (id) => {
    const response = await api.get(
      `/conventions/${id}/signature`
    );

    return response.data;
  },

  generatePdf: async (id) => {
    const response = await api.get(
      `/conventions/${id}/genererPdf`,
      {
        responseType: 'blob'
      }
    );

    return response.data;
  }

};

export default conventionService;