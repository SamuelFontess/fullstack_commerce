'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Product, PageResponse } from '@/lib/types';

export const useProducts = (page = 0, size = 12) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pageInfo, setPageInfo] = useState<Omit<PageResponse<Product>, 'content'> | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get<PageResponse<Product>>('/products', {
                    params: { page, size }
                });

                const { content, ...pageData } = response.data;
                setProducts(content);
                setPageInfo(pageData);
            } catch (err) {
                setError('Erro ao carregar produtos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page, size]);

    return { products, loading, error, pageInfo };
};

export const useProduct = (id: number) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await api.get<Product>(`/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                setError('Produto não encontrado');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    return { product, loading, error };
};