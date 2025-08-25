export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
}

export interface Role {
    id: number;
    authority: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imgUrl: string;
    categories: Category[];
}

export interface Category {
    id: number;
    name: string;
}

export interface Order {
    id: number;
    moment: string;
    status: OrderStatus;
    client: User;
    items: OrderItem[];
    total: number;
}

export interface OrderItem {
    id: {
        product: {
            id: number;
        };
        order: {
            id: number;
        };
    };
    product: Product;
    quantity: number;
    price: number;
    subTotal: number;
}

export enum OrderStatus {
    WAITING_PAYMENT = 'WAITING_PAYMENT',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED'
}

export interface CartItem {
    product: Product;
    quantity: number;
}

// DTOs para formulários
export interface LoginDTO {
    username: string;
    password: string;
}

export interface ProductDTO {
    name: string;
    description: string;
    price: number;
    imgUrl: string;
    categories: { id: number }[];
}

export interface OrderDTO {
    items: {
        productId: number;
        quantity: number;
    }[];
}

// Tipos de resposta da API
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}