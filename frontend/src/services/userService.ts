import {api} from '@/lib/api';
import { User } from '@/lib/types';

export const userService = {
    async getMe(): Promise<User> {
        const response = await api.get<User>('/users/me');
        return response.data;
    },
};