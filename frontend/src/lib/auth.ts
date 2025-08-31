import { api } from '@/lib/api';
import { User } from '@/lib/types';

interface LoginResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    jti: string;
}

export const authService = {
    async login(username: string, password: string): Promise<string> {
        const clientId = process.env.NEXT_PUBLIC_CLIENT_ID || 'myclientid';
        const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET || 'myclientsecret';

        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);

        try {
            const response = await api.post<LoginResponse>(
                '/oauth2/token',
                params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`)
                    }
                }
            );

            const { access_token, token_type } = response.data;
            const fullToken = `${token_type} ${access_token}`;

            if (typeof window !== 'undefined') {
                // Padronizar para 'access_token' para consistência com o interceptor
                localStorage.setItem('access_token', fullToken);
            }

            return fullToken;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('Email ou senha incorretos');
            }
            if (error.response?.data?.error_description) {
                throw new Error(error.response.data.error_description);
            }
            throw new Error('Erro no servidor. Tente novamente.');
        }
    },

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
        }
    },

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('access_token');
        }
        return null;
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    },

    hasRole(user: User, role: string): boolean {
        return user?.roles?.some(r => r.authority === role) || false;
    }
};