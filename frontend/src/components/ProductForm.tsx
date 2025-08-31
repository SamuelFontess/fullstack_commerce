'use client';
import { useState, useEffect } from 'react';
import { Product, ProductDTO, Category } from '@/lib/types';
import { categoryService } from '@/services/categoryService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks/useToast';
import { Select } from "./ui/Select";

interface ProductFormProps {
    product?: Product | null;
    onSubmit: (data: ProductDTO) => Promise<void>;
    onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState<ProductDTO>({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        imgUrl: product?.imgUrl || '',
        categories: product?.categories || []
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const categoriesData = await categoryService.getAll();
            setCategories(categoriesData);
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao carregar categorias'
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (categoryId: string) => {
        const category = categories.find(c => c.id === parseInt(categoryId));
        if (category && !formData.categories.find(c => c.id === category.id)) {
            setFormData(prev => ({
                ...prev,
                categories: [...prev.categories, category]
            }));
        }
    };

    const removeCategory = (categoryId: number) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c.id !== categoryId)
        }));
    };

    return (
        <Card>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                    {product ? 'Editar Produto' : 'Novo Produto'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Nome do Produto"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                    />

                    <Textarea
                        label="Descrição"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={4}
                        required
                    />

                    <Input
                        label="Preço"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                        required
                    />

                    <Input
                        label="URL da Imagem"
                        type="url"
                        value={formData.imgUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, imgUrl: e.target.value }))}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Categorias
                        </label>
                        <Select
                            value=""
                            onChange={(e: { target: { value: string; }; }) => handleCategoryChange(e.target.value)}
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>

                        {formData.categories.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {formData.categories.map(category => (
                                    <span
                                        key={category.id}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                    >
                    {category.name}
                                        <button
                                            type="button"
                                            onClick={() => removeCategory(category.id)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                      ×
                    </button>
                  </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button type="submit" loading={loading}>
                            {product ? 'Atualizar' : 'Criar'} Produto
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}