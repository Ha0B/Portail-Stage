import api from "./api";

const candidatureService = {

    getAll: async () => {
        const response = await api.get('/candidature');
        return response.data;
    },

    getByIdEtudiant: async (id) => {
        const response = await api.get(
            `/candidature/etudiant/${id}`
        );
        return response.data;
    },

    getCv: async (id) => {

        const response = await api.get(
            `/candidature/${id}/cv`,
            {
                responseType: 'blob'
            }
        );

        return response.data;
    },

    getByIdOffre: async (id) => {
        const response = await api.get(
            `/candidature/offre/${id}`
        );
        return response.data;
    },

    create: async (formData) => {
        const response = await api.post(
            '/candidature',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        return response.data;
    },

    update: async (id, updateData) => {
        const response = await api.put(`/candidature/${id}`, updateData, {
            headers: { 'Content-Type': 'application/json' }
        });
        return response.data;
    },

    updateAccepte: async (id) => {
        const response = await api.put(
            `/candidature/${id}/accepter`
        );
        return response.data;
    },

    updateRefuser: async (id) => {
        const response = await api.put(
            `/candidature/${id}/refuser`
        );
        return response.data;
    }

};

export default candidatureService;