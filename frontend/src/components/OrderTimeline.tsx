'use client';
import { Order, OrderStatus } from '@/lib/types';
import {
    CheckCircleIcon,
    ClockIcon,
    TruckIcon,
    CreditCardIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

interface OrderTimelineProps {
    order: Order;
}

export function OrderTimeline({ order }: OrderTimelineProps) {
    const steps = [
        {
            status: 'WAITING_PAYMENT',
            title: 'Aguardando Pagamento',
            icon: ClockIcon,
            completed: ['PAID', 'SHIPPED', 'DELIVERED'].includes(order.status),
            current: order.status === 'WAITING_PAYMENT'
        },
        {
            status: 'PAID',
            title: 'Pagamento Confirmado',
            icon: CreditCardIcon,
            completed: ['SHIPPED', 'DELIVERED'].includes(order.status),
            current: order.status === 'PAID'
        },
        {
            status: 'SHIPPED',
            title: 'Produto Enviado',
            icon: TruckIcon,
            completed: ['DELIVERED'].includes(order.status),
            current: order.status === 'SHIPPED'
        },
        {
            status: 'DELIVERED',
            title: 'Produto Entregue',
            icon: CheckCircleIcon,
            completed: order.status === 'DELIVERED',
            current: order.status === 'DELIVERED'
        }
    ];

    // Se o pedido foi cancelado, mostrar apenas o status de cancelado
    if (order.status === 'CANCELED') {
        return (
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
                <XCircleIcon className="w-8 h-8 text-red-600 mr-4" />
                <div>
                    <h4 className="font-medium text-red-600">Pedido Cancelado</h4>
                    <p className="text-sm text-red-500">Este pedido foi cancelado</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {steps.map((step, index) => (
                <div key={step.status} className="flex items-center">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                            ? 'bg-green-100 text-green-600'
                            : step.current
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-gray-100 text-gray-400'
                    }`}>
                        <step.icon className="w-4 h-4" />
                    </div>

                    {index < steps.length - 1 && (
                        <div className={`w-px h-8 ml-4 ${
                            step.completed ? 'bg-green-300' : 'bg-gray-200'
                        }`} />
                    )}

                    <div className="ml-4 flex-1">
                        <h4 className={`font-medium ${
                            step.completed
                                ? 'text-green-600'
                                : step.current
                                    ? 'text-blue-600'
                                    : 'text-gray-400'
                        }`}>
                            {step.title}
                        </h4>
                        {step.current && (
                            <p className="text-sm text-gray-500">Em andamento</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}