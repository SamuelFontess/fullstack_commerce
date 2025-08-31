export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
}

export interface Role {
    id: number;
    authority: string; // 'ROLE_ADMIN' | 'ROLE_CLIENT'
}

export interface UserDTO {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    roles?: Role[];
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imgUrl: string;
    categories: Category[];
}

export interface ProductDTO {
    id?: number;
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
    subTotal: number;
    id: number;
    quantity: number;
    price: number;
    product: Product;
    name: string;
    imgUrl: string;
}

export interface OrderDTO {
    id?: number;
    items: {
        productId: number;
        quantity: number;
        price: number;
    }[];
}

export enum OrderStatus {
    WAITING_PAYMENT = 'WAITING_PAYMENT',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELED = 'CANCELED'
}

export interface CartItem extends Product {
    quantity: number;
}