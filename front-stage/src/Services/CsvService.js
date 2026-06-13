import api from './api';

const CsvService = {

    exportCandidatures: async (filters) => {
        const cleanParams = {};
        if (filters.offreId) cleanParams.offreId = filters.offreId;
        if (filters.promo && filters.promo !== "") cleanParams.promo = filters.promo;
        if (filters.statut && filters.statut !== "") cleanParams.statut = filters.statut;

        const response = await api.get('/export/candidatures', {
            params: cleanParams,
            responseType: 'blob'
        });
        return response.data;
    },

    exportConventions: async (filters) => {
        const cleanParams = {};
        if (filters.entreprise && filters.entreprise !== "") cleanParams.entrepriseNom = filters.entreprise;
        if (filters.etat && filters.etat !== "") cleanParams.statut = filters.etat;

        const response = await api.get('/export/conventions', {
            params: cleanParams,
            responseType: 'blob'
        });
        return response.data;
    },

    exportSoutenances: async (filters) => {
        const cleanParams = {};
        if (filters.salle && filters.salle !== "") cleanParams.salle = filters.salle;
        if (filters.jury && filters.jury !== "") cleanParams.jury = filters.jury;

        const response = await api.get(`/export/soutenances`, {
            params: cleanParams,
            responseType: 'blob'
        });
        return response.data;
    },

    exportNotes: async (filters) => {
        const cleanParams = {};
        if (filters.min && filters.min !== "") cleanParams.min = filters.min;
        if (filters.max && filters.max !== "") cleanParams.max = filters.max;

        const response = await api.get(`/export/notes`, {
            params: cleanParams,
            responseType: 'blob'
        });
        return response.data;
    }
};

export default CsvService;