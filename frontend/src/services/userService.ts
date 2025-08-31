import { api } from '@/lib/api';
import { User, UserDTO } from '@/lib/types';

interface UsersResponse {
    content: User[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export const userService = {
    async getAll(params?: {
        page?: number;
        size?: number;
        search?: string;
    }): Promise<UsersResponse> {
        const searchParams = new URLSearchParams();

        if (params?.page !== undefined) searchParams.append('page', params.page.toString());
        if (params?.size) searchParams.append('size', params.size.toString());
        if (params?.search) searchParams.append('search', params.search);

        const response = await api.get(`/users?${searchParams.toString()}`);
        return response.data;
    },

    async getById(id: number): Promise<User> {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    async create(user: Omit<UserDTO, 'id'>): Promise<User> {
        const response = await api.post('/users', user);
        return response.data;
    },

    async update(id: number, user: Omit<UserDTO, 'id'>): Promise<User> {
        const response = await api.put(`/users/${id}`, user);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/users/${id}`);
    }
};