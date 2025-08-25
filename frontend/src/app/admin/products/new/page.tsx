'use client';
import { useRouter } from 'next/navigation';
import { ProductDTO } from '@/lib/types';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ProductForm } from '@/components/ProductForm';
import { Sidebar } from '@/components/Sidebar';

export default function NewProductPage() {
    const { isAdmin } = useAuth();
    const router = useRouter();

    const handleSubmit = async (data: ProductDTO) => {
        await api.post('/products', data);
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

    return (
        <div className="flex">
            <Sidebar />

            <div className="flex-1 p-8">
                <ProductForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}