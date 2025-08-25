'use client';
import { useState, useEffect } from 'react';
import { Product, Category, ProductDTO } from '@/lib/types';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ProductFormProps {
    product?: Product;
    onSubmit: (data: ProductDTO) => Promise<void>;
    onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductDTO>({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        imgUrl: product?.imgUrl || '',
        categories: product?.categories.map(c => ({ id: c.id })) || [],
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get<Category[]>('/categories');
                setCategories(response.data);
            } catch (err) {
                console.error('Erro ao carregar categorias:', err);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit(formData);
        } catch (err) {
            setError('Erro ao salvar produto');
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryId: number, checked: boolean) => {
        setFormData(current => ({
            ...current,
            categories: checked
                ? [...current.categories, { id: categoryId }]
                : current.categories.filter(c => c.id !== categoryId)
        }));
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-6">
                {product ? 'Editar Produto' : 'Novo Produto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Nome"
                    value={formData.name}
                    onChange={(e) => setFormData(current => ({
                        ...current,
                        name: e.target.value
                    }))}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(current => ({
                            ...current,
                            description: e.target.value
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        required
                    />
                </div>

                <Input
                    label="Preço"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(current => ({
                        ...current,
                        price: parseFloat(e.target.value)
                    }))}
                    required
                />

                <Input
                    label="URL da Imagem"
                    value={formData.imgUrl}
                    onChange={(e) => setFormData(current => ({
                        ...current,
                        imgUrl: e.target.value
                    }))}
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categorias
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {categories.map(category => (
                            <label key={category.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.categories.some(c => c.id === category.id)}
                                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-sm">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="flex space-x-4">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={onCancel}>
                        Cancelar
                    </Button>
                </div>
            </form>
        </Card>
    );
}