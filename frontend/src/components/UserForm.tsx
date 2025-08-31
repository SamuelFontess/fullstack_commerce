'use client';
import { useState } from 'react';
import { User, UserDTO } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface UserFormProps {
    user?: User | UserDTO;
    onSubmit: (data: UserDTO) => Promise<void>;
    onCancel: () => void;
}

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
    const [formData, setFormData] = useState<UserDTO>({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                    {user ? 'Editar Usuário' : 'Novo Usuário'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Nome"
                            value={formData.firstName}
                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            required
                        />
                        <Input
                            label="Sobrenome"
                            value={formData.lastName}
                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            required
                        />
                    </div>

                    <Input
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                    />

                    <Input
                        label={user ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        required={!user}
                    />

                    <div className="flex justify-end space-x-3">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancelar
                        </Button>
                        <Button type="submit" loading={loading}>
                            {user ? 'Atualizar' : 'Criar'} Usuário
                        </Button>
                    </div>
                </form>
            </div>
        </Card>
    );
}