'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { Sidebar } from '@/components/Sidebar';

interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
}

export default function AdminPage() {
    const { user, isAdmin } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Simular dados para o dashboard
                // Em uma aplicação real, você faria requisições separadas
                const [productsRes, ordersRes] = await Promise.all([
                    api.get('/products?size=0'), // Para contar total
                    api.get('/orders?size=0'),   // Para contar total
                ]);

                setStats({
                    totalProducts: productsRes.data.totalElements,
                    totalOrders: ordersRes.data.totalElements,
                    totalUsers: 0, // Implementar endpoint
                    totalRevenue: 0, // Calcular a partir dos pedidos
                });
            } catch (error) {
                console.error('Erro ao carregar estatísticas:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchStats();
        }
    }, [isAdmin]);

    if (!user || !isAdmin) {
        return (
            <div className="text-center text-red-600">
                Acesso negado. Apenas administradores podem acessar esta página.
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-8">Dashboard Administrativo</h1>

                {loading ? (
                    <div className="text-center">Carregando estatísticas...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {stats?.totalProducts || 0}
                                </div>
                                <div className="text-gray-600">Produtos</div>
                            </div>
                        </Card>

                        <Card>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {stats?.totalOrders || 0}
                                </div>
                                <div className="text-gray-600">Pedidos</div>
                            </div>
                        </Card>

                        <Card>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-2">
                                    {stats?.totalUsers || 0}
                                </div>
                                <div className="text-gray-600">Usuários</div>
                            </div>
                        </Card>

                        <Card>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 mb-2">
                                    R$ {stats?.totalRevenue || 0}
                                </div>
                                <div className="text-gray-600">Receita</div>
                            </div>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
                        <div className="space-y-2">
                            <a href="/admin/products/new" className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                ➕ Adicionar Novo Produto
                            </a>
                            <a href="/admin/products" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                                📦 Gerenciar Produtos
                            </a>
                            <a href="/admin/orders" className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                                📋 Ver Pedidos Recentes
                            </a>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Novo pedido #123 realizado</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <span>Produto "Notebook" atualizado</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>Novo usuário cadastrado</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}