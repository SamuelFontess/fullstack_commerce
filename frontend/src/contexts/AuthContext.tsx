'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { authService } from '@/lib/auth';
import { api } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Começa como true para indicar que a autenticação está sendo verificada

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const token = authService.getToken();
                if (token) {
                    // Tenta buscar os dados do usuário se houver um token
                    const response = await api.get<User>('/users/me');
                    setUser(response.data);
                    console.log('AuthContext: User loaded:', response.data);
                }
            } catch (error) {
                // Se a requisição falhar (token inválido, expirado, etc.), limpa o token e o usuário
                console.error("Erro ao verificar autenticação:", error);
                authService.logout(); // Limpa o token do localStorage
                setUser(null);
            } finally {
                setLoading(false); // Finaliza o estado de carregamento, independentemente do resultado
            }
        };

        checkAuthentication();
    }, []); // Executa apenas uma vez na montagem do componente

    const login = async (username: string, password: string) => {
        setLoading(true); // Inicia loading ao tentar logar
        try {
            await authService.login(username, password);
            // Após o login bem-sucedido, busca os dados do usuário
            const response = await api.get<User>('/users/me');
            setUser(response.data);
        } catch (error) {
            console.error("Erro no login:", error);
            setUser(null); // Garante que o usuário seja null em caso de falha no login
            throw error; // Propaga o erro para o componente de login lidar com ele
        } finally {
            setLoading(false); // Finaliza loading
        }
    };

    const logout = () => {
        authService.logout(); // Limpa o token do localStorage
        setUser(null); // Limpa o estado do usuário
        // O redirecionamento para /login deve ser feito na página que chama logout, se necessário
    };

    // Determina se o usuário é admin baseado nas roles
    const isAdmin = user?.roles?.some(role => role.authority === 'ROLE_ADMIN') || false;

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAdmin,
            login,
            logout
        }}>
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