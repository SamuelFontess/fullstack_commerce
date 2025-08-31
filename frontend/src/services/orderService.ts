import { api } from '@/lib/api';
import { Order, OrderDTO } from '@/lib/types';

export const orderService = {
    async getById(id: number): Promise<Order> {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    async create(order: Omit<OrderDTO, 'id'>): Promise<Order> {
        const response = await api.post('/orders', order);
        return response.data;
    },

    // Para buscar pedidos do usuário logado
    async getMyOrders(): Promise<Order[]> {
        const response = await api.get('/orders/my-orders');
        return response.data;
    },

    // Para Admin - listar todos os pedidos
    async getAll(params?: {
        page?: number;
        size?: number;
        status?: string;
    }): Promise<{ content: Order[]; totalPages: number; totalElements: number }> {
        const searchParams = new URLSearchParams();
        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.size) searchParams.append('size', params.size.toString());
        if (params?.status) searchParams.append('status', params.status);

        const response = await api.get(`/orders?${searchParams.toString()}`);
        return response.data;
    }
};