import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL
});

// Agregar token a cada petición
api.interceptors.request.use((config) => {

    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Detectar token inválido/expirado
api.interceptors.response.use(
    (response) => response,

    (error) => {

        const url = error.config?.url;

        if (
            error.response?.status === 401 &&
            !url?.includes('/auth/login')
        ) {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');

            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;

export function getFotoUrl(entidad, foto_nombre) {
    return baseURL.replace('/api', '') +
           "/uploads/" +
           entidad +
           "/" +
           foto_nombre;
}
