import { useAuth } from '@/contexts/AuthContext';

export function usePermissions() {
    const { user, isAdmin } = useAuth();

    const hasRole = (role: string): boolean => {
        return user?.roles?.some(r => r.authority === role) || false;
    };

    const canManageProducts = (): boolean => {
        return hasRole('ROLE_ADMIN');
    };

    const canManageOrders = (): boolean => {
        return hasRole('ROLE_ADMIN');
    };

    const canCreateOrder = (): boolean => {
        return hasRole('ROLE_CLIENT') || hasRole('ROLE_ADMIN');
    };

    const canViewOrder = (order: any): boolean => {
        if (hasRole('ROLE_ADMIN')) return true;
        if (hasRole('ROLE_CLIENT') && user && order.client.id === user.id) return true;
        return false;
    };

    const canManageUsers = (): boolean => {
        return hasRole('ROLE_ADMIN');
    };

    return {
        isAdmin,
        hasRole,
        canManageProducts,
        canManageOrders,
        canCreateOrder,
        canViewOrder,
        canManageUsers // CORREÇÃO: Exportar canManageUsers
    };
}