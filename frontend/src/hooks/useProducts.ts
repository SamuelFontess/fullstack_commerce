import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import { Product } from '@/lib/types';

interface UseProductsParams {
    page?: number;
    size?: number;
    name?: string;
    sort?: string;
}

interface UseProductsReturn {
    products: Product[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    totalElements: number;
    refetch: () => void;
}

export function useProducts(params: UseProductsParams = {}): UseProductsReturn {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await productService.getAll(params);

            if (Array.isArray(response)) {
                // Se for array simples
                setProducts(response);
                setTotalPages(1);
                setTotalElements(response.length);
            } else {
                // Se for resposta paginada
                setProducts(response.content || []);
                setTotalPages(response.totalPages || 0);
                setTotalElements(response.totalElements || 0); // CORREÇÃO: Removido response.length
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao carregar produtos');
            setProducts([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [params.page, params.size, params.name, params.sort]);

    return {
        products,
        loading,
        error,
        totalPages,
        totalElements,
        refetch: fetchProducts
    };
}