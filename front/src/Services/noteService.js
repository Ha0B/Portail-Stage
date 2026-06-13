import api from './api';

const noteService = {
  
  getSuiviByStageId: async (stageId) => {
    const response = await api.get(`/suivi/stage/${stageId}`);
    return response.data;
  },


  updateObjectif: async (objectifId, payload) => {
    const response = await api.put(`/suivi/objectifs/${objectifId}`, payload);
    return response.data;
  },

  
  updateLivrable: async (livrableId, payload) => {
    const response = await api.put(`/suivi/livrables/${livrableId}`, payload);
    return response.data;
  },

  addCommentaire: async (stageId, commentPayload) => {
    const response = await api.post(`/suivi/stage/${stageId}/commentaires`, commentPayload);
    return response.data; // { id, text, date }
  },

  getNotesParStage: async (stageId) => {
    const response = await api.get(`/notes/stage/${stageId}`);
    return response.data;
  },

  getMoyenneEtudiant: async (idEtudiant) => {
    const response = await api.get(`/notes/${idEtudiant}/moyenne`);
    return response.data;
  },

  // Ajouter une nouvelle note
  ajouterNote: async (noteData) => {
    const response = await api.post("/notes", noteData);
    return response.data;
  },

  saveEvaluation: async (stageId, evaluationPayload) => {
    const response = await api.post(`/stage/${stageId}/evaluation`, evaluationPayload);
    return response.data;
  }
};

export default noteService;