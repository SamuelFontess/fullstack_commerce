'use client';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Card } from '@/components/ui/Card';
import {
    ShoppingBagIcon,
    CubeIcon,
    UsersIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const { isAdmin } = usePermissions();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/');
        }
    }, [loading, isAdmin, router]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
    }

    if (!isAdmin) {
        return null;
    }

    const adminCards = [
        {
            title: 'Gerenciar Produtos',
            description: 'Adicionar, editar e remover produtos',
            icon: CubeIcon,
            href: '/admin/products',
            color: 'bg-blue-500'
        },
        {
            title: 'Gerenciar Pedidos',
            description: 'Visualizar e gerenciar pedidos',
            icon: ShoppingBagIcon,
            href: '/admin/orders',
            color: 'bg-green-500'
        },
        {
            title: 'Usuários',
            description: 'Gerenciar usuários do sistema',
            icon: UsersIcon,
            href: '/admin/users',
            color: 'bg-purple-500'
        },
        {
            title: 'Relatórios',
            description: 'Visualizar relatórios e estatísticas',
            icon: ChartBarIcon,
            href: '/admin/reports',
            color: 'bg-orange-500'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
                <p className="text-gray-600">Bem-vindo, {user?.firstName}! Gerencie sua loja aqui.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {adminCards.map((card) => (
                    <Link key={card.href} href={card.href}>
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                            <div className="p-6">
                                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                                    {card.title}
                                </h3>
                                <p className="text-gray-600 text-sm">{card.description}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">150</div>
                        <div className="text-gray-600">Produtos Ativos</div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">45</div>
                        <div className="text-gray-600">Pedidos Hoje</div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">1.2k</div>
                        <div className="text-gray-600">Usuários Ativos</div>
                    </div>
                </Card>
            </div>
        </div>
    );
}