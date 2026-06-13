import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9092',
});

api.interceptors.request.use((config) => {
    // Ne pas envoyer de token pour les requetes d'authentification
    if (config.url.startsWith('/auth/')) {
        return config;
    }

    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;