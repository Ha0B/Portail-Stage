import api from './api';

const rapportService = {

    getAll: async () => {
        const response = await api.get('/rapport');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/rapport/${id}`);
        return response.data;
    },

    getByEncadrant: async (idEncadrant) => {
        const response = await api.get(`/rapport/encadrant/${idEncadrant}`);
        return response.data;
    },

    create: async (formData) => {
        const response = await api.post(
            '/rapport',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    },

    update: async (id, statut) => {
        const response = await api.put(
            `/rapport/${id}/statut`,
            null,
            {
                params: { statut }
            }
        );

        return response.data;
    },

    getRapportsParStage: async (stageId) => {
        const response = await api.get(
            `/rapport/stage/${stageId}`
        );

        return response.data;
    },

    getFichier: async (id) => {
        const response = await api.get(
            `/rapport/${id}/fichier`,
            {
                responseType: 'blob'
            }
        );

        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(
            `/rapport/${id}`
        );

        return response.data;
    }

};

export default rapportService;