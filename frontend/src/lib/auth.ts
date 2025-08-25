import { api } from './api';
import { LoginDTO, TokenResponse, User } from './types';

export class AuthService {
    static async login(credentials: LoginDTO): Promise<TokenResponse> {
        const response = await api.post<TokenResponse>('/oauth/token', {
            ...credentials,
            grant_type: 'password',
        });

        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', response.data.access_token);
        }
        return response.data;
    }

    static async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/users/me');
        return response.data;
    }

    static logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
    }

    static isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem('access_token');
    }

    static hasRole(user: User, role: string): boolean {
        return user.roles.some(r => r.authority === role);
    }

    static getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    }
}