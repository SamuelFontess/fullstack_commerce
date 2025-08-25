'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState('');

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setDebugInfo('');

        try {
            // Debug: mostrar dados que estão sendo enviados
            setDebugInfo(`Tentando login com: ${username}`);
            console.log('🔐 Tentando login com:', { username, password: '***' });
            console.log('🌐 URL da API:', process.env.NEXT_PUBLIC_API_URL);

            await login(username, password);

            console.log('✅ Login bem-sucedido!');
            setDebugInfo('Login bem-sucedido! Redirecionando...');

            router.push('/');
        } catch (err: any) {
            console.error('❌ Erro no login:', err);
            console.error('📋 Response:', err.response?.data);
            console.error('📋 Status:', err.response?.status);

            let errorMessage = 'Erro desconhecido';

            if (err.response?.status === 401) {
                errorMessage = 'Credenciais inválidas';
            } else if (err.response?.status === 400) {
                errorMessage = 'Dados inválidos';
            } else if (err.response?.data?.error_description) {
                errorMessage = err.response.data.error_description;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            setDebugInfo(`Erro: ${err.response?.status} - ${JSON.stringify(err.response?.data)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <Card>
                <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

                {/* Informações de Debug */}
                <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
                    <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}</p>
                    <p><strong>Debug:</strong> {debugInfo}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Input
                        label="Email/Username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Digite seu email ou username"
                        required
                    />

                    <Input
                        label="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        required
                    />

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            <strong>Erro:</strong> {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                </form>

                {/* Credenciais de teste (remover em produção) */}
                <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
                    <p className="font-semibold">Credenciais de teste:</p>
                    <p>Email: maria@gmail.com</p>
                    <p>Senha: 123456</p>
                    <div className="mt-2 space-x-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                                setUsername('maria@gmail.com');
                                setPassword('123456');
                            }}
                        >
                            Usar Admin
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                                setUsername('alex@gmail.com');
                                setPassword('123456');
                            }}
                        >
                            Usar Cliente
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}