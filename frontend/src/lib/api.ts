import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = token; // O token já deve incluir 'Bearer '
        }
    }
    return config;
});

// Interceptor para lidar com erros de autenticação (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se o erro for 401 e não for na requisição de login, redirecionar para /login
        if (error.response?.status === 401 && !error.config.url?.includes('/oauth2/token')) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;