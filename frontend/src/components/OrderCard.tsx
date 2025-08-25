import { Order } from '@/lib/types';
import { formatPrice, formatDate, getOrderStatusLabel } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface OrderCardProps {
    order: Order;
    onClick?: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
    const getStatusColor = (status: string) => {
        const colors = {
            WAITING_PAYMENT: 'bg-yellow-100 text-yellow-800',
            PAID: 'bg-blue-100 text-blue-800',
            SHIPPED: 'bg-purple-100 text-purple-800',
            DELIVERED: 'bg-green-100 text-green-800',
            CANCELED: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <Card
            className={`${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                    Pedido #{order.id}
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
          {getOrderStatusLabel(order.status)}
        </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
                <p>Data: {formatDate(order.moment)}</p>
                <p>Cliente: {order.client.firstName} {order.client.lastName}</p>
                <p>Items: {order.items.length}</p>
            </div>

            <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total:</span>
                    <span className="text-xl font-bold text-green-600">
            {formatPrice(order.total)}
          </span>
                </div>
            </div>
        </Card>
    );
}