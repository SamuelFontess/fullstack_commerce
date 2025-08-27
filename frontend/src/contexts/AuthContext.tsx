'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { authService } from '@/lib/auth';
import { userService } from '@/services/userService';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUser = async () => {
        const token = authService.getToken();
        if (token) {
            try {
                const userData = await userService.getMe();
                setUser(userData);
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error);
                authService.logout();
                router.push('/login');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogin = async (username: string, password: string) => {
        setLoading(true);
        try {
            const token = await authService.login(username, password);
            await fetchUser();
            router.push('/');
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
    };

    const isAuthenticated = !!user;
    const isAdmin = user ? authService.hasRole(user, 'ROLE_ADMIN') : false;

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login: handleLogin,
            logout: handleLogout,
            isAuthenticated,
            isAdmin
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