import api from './api';

const rubriqueService = {
    getAll: async () => {
        const response = await api.get('/rubrique');
        return response.data;
    },

    getOne: async (id) => {
        const response = await api.get(`/rubrique/${id}`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/rubrique', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/rubrique/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/rubrique/${id}`);
    },
};

export default rubriqueService;