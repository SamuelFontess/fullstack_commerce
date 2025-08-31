'use client';
import { User, UserDTO } from '@/lib/types';
import { userService } from '@/services/userService';
import { Modal } from '@/components/ui/Modal';
import { UserForm } from '@/components/UserForm';
import { useToast } from '@/hooks/useToast';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User | null;
}

export function UserModal({ isOpen, onClose, user }: UserModalProps) {
    const { addToast } = useToast();

    const handleSubmit = async (data: UserDTO) => {
        try {
            if (user) {
                await userService.update(user.id, data);
                addToast({
                    type: 'success',
                    title: 'Sucesso',
                    message: 'Usuário atualizado com sucesso'
                });
            } else {
                await userService.create(data);
                addToast({
                    type: 'success',
                    title: 'Sucesso',
                    message: 'Usuário criado com sucesso'
                });
            }
            onClose();
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao salvar usuário'
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <UserForm
                user={user ? {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    roles: user.roles
                } : undefined}
                onSubmit={handleSubmit}
                onCancel={onClose}
            />
        </Modal>
    );
}