'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product, ProductDTO } from '@/lib/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ProductForm } from '@/components/ProductForm';
import { Sidebar } from '@/components/Sidebar';

export default function EditProductPage() {
    const { isAdmin } = useAuth();
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get<Product>(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Erro ao carregar produto:', error);
                router.push('/admin/products');
            } finally {
                setLoading(false);
            }
        };

        if (id && isAdmin) {
            fetchProduct();
        }
    }, [id, isAdmin, router]);

    const handleSubmit = async (data: ProductDTO) => {
        await api.put(`/products/${id}`, data);
        router.push('/admin/products');
    };

    const handleCancel = () => {
        router.push('/admin/products');
    };

    if (!isAdmin) {
        return (
            <div className="text-center text-red-600">
                Acesso negado.
            </div>
        );
    }

    if (loading) {
        return <div className="text-center">Carregando...</div>;
    }

    if (!product) {
        return <div className="text-center text-red-600">Produto não encontrado</div>;
    }

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 p-8">
                <ProductForm
                    product={product}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}