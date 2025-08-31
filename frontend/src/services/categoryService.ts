import { api } from '@/lib/api';
import { Category } from '@/lib/types';

export const categoryService = {
    async getAll(): Promise<Category[]> {
        const response = await api.get('/categories');
        return response.data;
    }
};