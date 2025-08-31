'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { orderService } from '@/services/orderService';
import { Order } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { OrderTimeline } from '@/components/OrderTimeline';
import { formatPrice, formatDate } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderDetailsPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { canViewOrder } = usePermissions();
    const { addToast } = useToast();

    const orderId = parseInt(params.id as string);

    useEffect(() => {
        if (orderId && user) {
            loadOrder();
        }
    }, [orderId, user]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const orderData = await orderService.getById(orderId);

            if (!canViewOrder(orderData)) {
                addToast({
                    type: 'error',
                    title: 'Acesso Negado',
                    message: 'Você não tem permissão para ver este pedido'
                });
                router.push('/orders');
                return;
            }

            setOrder(orderData);
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao carregar detalhes do pedido'
            });
            router.push('/orders');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Loading text="Carregando detalhes do pedido..." />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Pedido não encontrado</h2>
                    <p className="text-gray-600 mb-4">O pedido solicitado não foi encontrado.</p>
                    <Link href="/orders">
                        <Button>Voltar aos Pedidos</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Link href="/orders">
                        <Button size="sm">
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Pedido #{order.id}
                        </h1>
                        <p className="text-gray-600">
                            Realizado em {formatDate(order.moment)}
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-sm text-gray-600">Total do Pedido</p>
                    <p className="text-2xl font-bold text-green-600">
                        {formatPrice(order.total)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Timeline do Pedido */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Status do Pedido</h2>
                            <OrderTimeline order={order} />
                        </div>
                    </Card>

                    {/* Itens do Pedido */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Itens do Pedido</h2>
                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.imgUrl}
                                                    alt={item.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {formatPrice(item.price)} × {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Resumo do Pedido */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Resumo</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{formatPrice(order.total)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Frete</span>
                                    <span className="font-medium">Grátis</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="font-semibold">Total</span>
                                        <span className="font-bold text-green-600">
                      {formatPrice(order.total)}
                    </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Informações do Cliente */}
                    <Card>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Cliente</h2>
                            <div className="space-y-2">
                                <p className="font-medium">
                                    {order.client.firstName} {order.client.lastName}
                                </p>
                                <p className="text-gray-600">{order.client.email}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Ações */}
                    <Card>
                        <div className="p-6 space-y-3">
                            {order.status === 'WAITING_PAYMENT' && (
                                <Button className="w-full">
                                    Pagar Pedido
                                </Button>
                            )}

                            {(order.status === 'WAITING_PAYMENT' || order.status === 'PAID') && (
                                <Button variant="danger" className="w-full">
                                    Cancelar Pedido
                                </Button>
                            )}

                            <Button variant="outline" className="w-full">
                                Baixar Comprovante
                            </Button>

                            <Button variant="outline" className="w-full">
                                Entrar em Contato
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}