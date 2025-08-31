'use client';
import { useState } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatPrice, formatDate } from '@/lib/utils';
import {
    ChevronDownIcon,
    ChevronUpIcon,
    TruckIcon,
    CreditCardIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getStatusConfig = (status: OrderStatus) => {
        const configs = {
            WAITING_PAYMENT: {
                color: 'warning',
                icon: ClockIcon,
                label: 'Aguardando Pagamento'
            },
            PAID: {
                color: 'info',
                icon: CreditCardIcon,
                label: 'Pago'
            },
            SHIPPED: {
                color: 'info',
                icon: TruckIcon,
                label: 'Enviado'
            },
            DELIVERED: {
                color: 'success',
                icon: CheckCircleIcon,
                label: 'Entregue'
            },
            CANCELED: {
                color: 'danger',
                icon: XCircleIcon,
                label: 'Cancelado'
            }
        };
        return configs[status] || configs.WAITING_PAYMENT;
    };

    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    return (
        <Card className="overflow-hidden">
            <div className="p-6">
                {/* Header do Pedido */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Pedido #{order.id}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Realizado em {formatDate(order.moment)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Badge variant={statusConfig.color as any} className="flex items-center">
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {statusConfig.label}
                        </Badge>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-lg font-bold text-green-600">
                                {formatPrice(order.total)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Resumo dos Itens */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden">
                                    <Image
                                        src={item.imgUrl}
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                            {order.items.length > 3 && (
                                <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    +{order.items.length - 3}
                  </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
                            </p>
                        </div>
                    </div>

                    <Button
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                        {isExpanded ? (
                            <ChevronUpIcon className="w-4 h-4 ml-2" />
                        ) : (
                            <ChevronDownIcon className="w-4 h-4 ml-2" />
                        )}
                    </Button>
                </div>

                {/* Detalhes Expandidos */}
                {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-4">Itens do Pedido</h4>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                                            <Image
                                                src={item.imgUrl}
                                                alt={item.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Quantidade: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {formatPrice(item.price)} cada
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Ações do Pedido */}
                        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                            <Link href={`/orders/${order.id}`}>
                                <Button variant="outline" size="sm">
                                    Ver Detalhes Completos
                                </Button>
                            </Link>

                            {order.status === 'WAITING_PAYMENT' && (
                                <Button size="sm">
                                    Pagar Agora
                                </Button>
                            )}

                            {(order.status === 'WAITING_PAYMENT' || order.status === 'PAID') && (
                                <Button variant="danger" size="sm">
                                    Cancelar Pedido
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}