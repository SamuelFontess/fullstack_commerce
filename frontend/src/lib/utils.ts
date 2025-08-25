export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price);
};

export const formatDate = (date: string): string => {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
};

export const getOrderStatusLabel = (status: string): string => {
    const labels = {
        WAITING_PAYMENT: 'Aguardando Pagamento',
        PAID: 'Pago',
        SHIPPED: 'Enviado',
        DELIVERED: 'Entregue',
        CANCELED: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || status;
};