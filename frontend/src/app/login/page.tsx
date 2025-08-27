'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Ajuste o caminho conforme necessário
import { authService } from '@/lib/auth';

export default function LoginPage() {
    const [username, setUsername] = useState('alex@gmail.com');
    const [password, setPassword] = useState('123456');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, loading } = useAuth();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Por favor, preencha todos os campos');
            return;
        }

        try {
            setError(null);
            setIsSubmitting(true);

            console.log('Tentando fazer login...');
            await login(username, password);

            console.log('Login bem-sucedido!');
        } catch (err: any) {
            console.error('Erro no login:', err);

            if (err.response?.data?.error === 'invalid_client') {
                setError('Erro de autenticação do cliente. Verifique as configurações OAuth2.');
            } else if (err.response?.data?.error === 'invalid_grant') {
                setError('Usuário ou senha inválidos.');
            } else if (err.response?.status === 401) {
                setError('Credenciais inválidas. Verifique seu usuário e senha.');
            } else {
                setError(err.message || 'Erro desconhecido durante o login');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDebugLogin = async () => {
        try {
            console.clear();
            await authService.debugLogin(username, password);
        } catch (error) {
            console.error('Erro no debug:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Faça login em sua conta
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Email
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="email"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Senha
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Erro no login
                                    </h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Fazendo login...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}