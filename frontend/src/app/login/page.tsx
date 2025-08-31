'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [formLoading, setFormLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const { login, user, loading: authLoading } = useAuth();
    const { addToast } = useToast();

    const redirectTo = searchParams.get('redirect') || '/products';

    useEffect(() => {
        if (!authLoading && user) {
            router.push(redirectTo);
        }
    }, [user, authLoading, router, redirectTo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Preencha todos os campos'
            });
            return;
        }

        setFormLoading(true);
        try {
            await login(formData.username, formData.password);

            addToast({
                type: 'success',
                title: 'Sucesso',
                message: 'Login realizado com sucesso!'
            });

        } catch (error: any) {
            addToast({
                type: 'error',
                title: 'Erro no Login',
                message: error.message || 'Erro desconhecido'
            });
        } finally {
            setFormLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (user) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <Card className="w-full max-w-md">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Bem-vindo de volta
                        </h1>
                        <p className="text-gray-600">
                            Faça login para acessar sua conta
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                            placeholder="seu@email.com"
                            required
                        />

                        <Input
                            label="Senha"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="Sua senha"
                            required
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            loading={formLoading}
                        >
                            Entrar
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Não tem uma conta?{' '}
                            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                Cadastre-se
                            </a>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}