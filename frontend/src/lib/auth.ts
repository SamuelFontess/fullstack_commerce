import axios from 'axios';
import { User } from './types';

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || 'myclientid';
const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET || 'myclientsecret';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const authService = {
    async login(username: string, password: string): Promise<string> {
        try {
            return await this.loginWithBasicAuth(username, password);
        } catch (error: any) {
            console.log('Basic Auth falhou, tentando com credentials no body...');
            return await this.loginWithCredentialsInBody(username, password);
        }
    },

    async loginWithBasicAuth(username: string, password: string): Promise<string> {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);

        // Cria o Basic Auth header
        const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

        console.log('=== Tentando login com Basic Authentication ===');
        console.log('URL:', `${API_URL}/oauth2/token`);
        console.log('Basic Auth Header:', `Basic ${basicAuth}`);
        console.log('Body params:', params.toString());

        const response = await axios.post(`${API_URL}/oauth2/token`, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${basicAuth}`,
            },
        });

        const token = response.data.access_token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', token);
        }
        return token;
    },

    async loginWithCredentialsInBody(username: string, password: string): Promise<string> {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', username);
        params.append('password', password);
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);

        console.log('=== Tentando login com credentials no body ===');
        console.log('URL:', `${API_URL}/oauth2/token`);
        console.log('Body params:', params.toString());

        try {
            const response = await axios.post(`${API_URL}/oauth2/token`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const token = response.data.access_token;
            if (typeof window !== 'undefined') {
                localStorage.setItem('access_token', token);
            }
            return token;
        } catch (error: any) {
            console.error('Erro no login:', error.response?.data || error.message);

            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Headers de resposta:', error.response.headers);
                console.error('Data de resposta:', error.response.data);
            }

            throw error;
        }
    },

    //degub lascado pra descobrir
    async debugLogin(username: string, password: string): Promise<void> {
        console.log('=== DEBUG COMPLETO ===');
        console.log('CLIENT_ID:', CLIENT_ID);
        console.log('CLIENT_SECRET:', CLIENT_SECRET ? '[DEFINIDO]' : '[NÃO DEFINIDO]');
        console.log('API_URL:', API_URL);
        console.log('Username:', username);

        try {
            console.log('\n--- TESTE 1: Basic Authentication ---');
            const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
            console.log('Basic Auth String:', basicAuth);

            const params1 = new URLSearchParams({
                grant_type: 'password',
                username: username,
                password: password
            });

            const config1 = {
                method: 'POST',
                url: `${API_URL}/oauth2/token`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${basicAuth}`
                },
                data: params1.toString()
            };

            console.log('Config completa:', config1);

            const response1 = await axios(config1);
            console.log('Basic Auth funcionou!');
            console.log('Token recebido:', response1.data);
            return;
        } catch (error1: any) {
            console.log('Basic Auth falhou:');
            console.log('Status:', error1.response?.status);
            console.log('Error data:', error1.response?.data);
        }

        try {
            console.log('\n--- TESTE 2: Credentials no Body ---');
            const params2 = new URLSearchParams({
                grant_type: 'password',
                username: username,
                password: password,
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET
            });

            const config2 = {
                method: 'POST',
                url: `${API_URL}/oauth2/token`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: params2.toString()
            };

            console.log('Config completa:', config2);

            const response2 = await axios(config2);
            console.log('Credentials no body funcionou!');
            console.log('Token recebido:', response2.data);
            return;
        } catch (error2: any) {
            console.log('Credentials no body falhou:');
            console.log('Status:', error2.response?.status);
            console.log('Error data:', error2.response?.data);
        }

        console.log('\n=== AMBOS OS MÉTODOS FALHARAM ===');
        console.log('Verifique se:');
        console.log('1. O servidor está rodando na porta 8080');
        console.log('2. As credenciais CLIENT_ID e CLIENT_SECRET estão corretas');
        console.log('3. O endpoint /oauth2/token está correto');
        console.log('4. O CORS está configurado no backend');
    },

    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
    },

    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    },

    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            return payload.exp > now;
        } catch {
            return false;
        }
    },

    hasRole(user: User, role: string): boolean {
        return user.roles.includes(role);
    },
};