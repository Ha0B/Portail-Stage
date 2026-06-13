import api from './api';

const fichierService = {

  uploadCv: async (idEtudiant, file) => {

    const formData = new FormData();

    formData.append('file', file);

    const response = await api.post(
      `/fichier/upload/cv/${idEtudiant}`,
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data'
        }
      }
    );

    return response.data;
  }

};

export default fichierService;