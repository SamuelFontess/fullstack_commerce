'use client';
import { Product, ProductDTO } from '@/lib/types';
import { productService } from '@/services/productService';
import { Modal } from '@/components/ui/Modal';
import { ProductForm } from '@/components/ProductForm';
import { useToast } from '@/hooks/useToast';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product?: Product | null;
}

export function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
    const { addToast } = useToast();

    const handleSubmit = async (data: ProductDTO) => {
        try {
            if (product) {
                await productService.update(product.id, data);
                addToast({
                    type: 'success',
                    title: 'Sucesso',
                    message: 'Produto atualizado com sucesso'
                });
            } else {
                await productService.create(data);
                addToast({
                    type: 'success',
                    title: 'Sucesso',
                    message: 'Produto criado com sucesso'
                });
            }
            onClose();
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao salvar produto'
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ProductForm
                product={product}
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </Modal>
    );
}