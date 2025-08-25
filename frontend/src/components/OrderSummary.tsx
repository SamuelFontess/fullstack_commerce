import { Order } from '@/lib/types';
import { formatPrice, formatDate, getOrderStatusLabel } from '@/lib/utils';
import { Card } from '@/components/ui/Card';

interface OrderSummaryProps {
    order: Order;
}

export function OrderSummary({ order }: OrderSummaryProps) {
    return (
        <div className="space-y-6">
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Pedido #{order.id}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
            {getOrderStatusLabel(order.status)}
          </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Data do Pedido:</p>
                        <p className="font-semibold">{formatDate(order.moment)}</p>
                    </div>

                    <div>
                        <p className="text-gray-600">Cliente:</p>
                        <p className="font-semibold">
                            {order.client.firstName} {order.client.lastName}
                        </p>
                        <p className="text-gray-600">{order.client.email}</p>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold mb-4">Itens do Pedido</h3>

                <div className="space-y-4">
                    {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                            <div className="flex-1">
                                <h4 className="font-medium">{item.product.name}</h4>
                                <p className="text-sm text-gray-600">
                                    Preço unitário: {formatPrice(item.price)}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-medium">Qtd: {item.quantity}</p>
                                <p className="text-green-600 font-semibold">
                                    {formatPrice(item.subTotal)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-green-600">
              {formatPrice(order.total)}
            </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
function getStatusColor(status: string) {
    const colors = {
        WAITING_PAYMENT: 'bg-yellow-100 text-yellow-800',
        PAID: 'bg-blue-100 text-blue-800',
        SHIPPED: 'bg-purple-100 text-purple-800',
        DELIVERED: 'bg-green-100 text-green-800',
        CANCELED: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

