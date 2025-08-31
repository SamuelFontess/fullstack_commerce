import { api } from '@/lib/api';
import { Product, ProductDTO } from '@/lib/types';

interface ProductsResponse {
    content: Product[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export const productService = {
    async getAll(params?: {
        page?: number;
        size?: number;
        name?: string;
        sort?: string;
    }): Promise<ProductsResponse> {
        const searchParams = new URLSearchParams();

        if (params?.page !== undefined) searchParams.append('page', params.page.toString());
        if (params?.size) searchParams.append('size', params.size.toString());
        if (params?.name) searchParams.append('name', params.name);
        if (params?.sort) searchParams.append('sort', params.sort);

        const response = await api.get(`/products?${searchParams.toString()}`);
        return response.data;
    },

    async getById(id: number): Promise<Product> {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    async create(product: Omit<ProductDTO, 'id'>): Promise<Product> {
        const response = await api.post('/products', product);
        return response.data;
    },

    async update(id: number, product: Omit<ProductDTO, 'id'>): Promise<Product> {
        const response = await api.put(`/products/${id}`, product);
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/products/${id}`);
    }
};

