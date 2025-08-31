'use client';
import { useState, useEffect } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { userService } from '@/services/userService';
import { User } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loading } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { UserTable } from '@/components/admin/UserTable';
import { UserModal } from '@/components/admin/UserModal';
import { Sidebar } from '@/components/Sidebar';
import { useToast } from '@/hooks/useToast';
import { UsersIcon, PlusIcon } from '@heroicons/react/24/outline';

interface UsersResponse {
    content: User[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { canManageUsers } = usePermissions();
    const { addToast } = useToast();

    useEffect(() => {
        if (canManageUsers()) {
            loadUsers();
        }
    }, [currentPage, searchTerm, canManageUsers]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response: UsersResponse = await userService.getAll({
                page: currentPage - 1,
                size: 10,
                search: searchTerm
            });

            setUsers(response.content);
            setTotalPages(response.totalPages);
        } catch (error) {
            addToast({
                type: 'error',
                title: 'Erro',
                message: 'Erro ao carregar usuários'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId: number) => {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await userService.delete(userId);
                addToast({
                    type: 'success',
                    title: 'Sucesso',
                    message: 'Usuário excluído com sucesso'
                });
                loadUsers();
            } catch (error) {
                addToast({
                    type: 'error',
                    title: 'Erro',
                    message: 'Erro ao excluir usuário'
                });
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        loadUsers();
    };

    if (!canManageUsers()) {
        return (
            <div className="text-center text-red-600 p-8">
                Acesso negado. Você não tem permissão para gerenciar usuários.
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
                        <p className="text-gray-600">Adicione, edite ou remova usuários do sistema</p>
                    </div>
                    <Button onClick={handleCreateUser}>
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Novo Usuário
                    </Button>
                </div>

                {/* Busca */}
                <Card className="mb-6">
                    <div className="p-4">
                        <Input
                            placeholder="Buscar usuários..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Card>

                {loading ? (
                    <Loading text="Carregando usuários..." />
                ) : users.length === 0 ? (
                    <EmptyState
                        icon={UsersIcon}
                        title="Nenhum usuário encontrado"
                        description="Comece adicionando seu primeiro usuário ao sistema."
                        action={
                            <Button onClick={handleCreateUser}>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Adicionar Usuário
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <UserTable
                            users={users}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                        />

                        {totalPages > 1 && (
                            <div className="mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}

                <UserModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    user={editingUser}
                />
            </div>
        </div>
    );
}