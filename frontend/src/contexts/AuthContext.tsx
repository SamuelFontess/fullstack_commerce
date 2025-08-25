'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import { User, LoginDTO, TokenResponse } from '@/lib/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Função para verificar se tem token
    const getToken = (): string | null => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('access_token');
    };

    // Função para fazer login
    const login = async (username: string, password: string) => {
        try {
            console.log('🔐 AuthContext: Iniciando login...');

            // Chamada ao endpoint /auth/login no backend
            const response = await api.post<TokenResponse>('/oauth2/token', {
                username,
                password,
                grant_type: 'password',
            });

            console.log('✅ Token recebido:', response.data);

            // Salvar token no localStorage
            localStorage.setItem('access_token', response.data.access_token);

            // Buscar dados do usuário usando o token no Authorization header
            console.log('👤 Buscando dados do usuário...');
            const userResponse = await api.get<User>('/users/me');

            console.log('✅ Dados do usuário:', userResponse.data);
            setUser(userResponse.data);

        } catch (error: any) {
            console.error('❌ Erro no AuthContext login:', error);
            console.error('📋 Error response:', error.response?.data);
            throw error;
        }
    };

    // Função para fazer logout
    const logout = () => {
        console.log('🚪 Fazendo logout...');
        localStorage.removeItem('access_token');
        setUser(null);
        window.location.href = '/login';
    };

    // Função para verificar se é admin
    const hasRole = (user: User, role: string): boolean => {
        return user.roles.some(r => r.authority === role);
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = getToken();

            console.log('🔍 Token encontrado:', !!token);

            if (token) {
                try {
                    console.log('👤 Carregando usuário com token existente...');
                    const userResponse = await api.get<User>('/users/me');
                    console.log('✅ Usuário carregado:', userResponse.data);
                    setUser(userResponse.data);
                } catch (error) {
                    console.error('❌ Erro ao carregar usuário:', error);
                    localStorage.removeItem('access_token');
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const isAdmin = user ? hasRole(user, 'ROLE_ADMIN') : false;

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};