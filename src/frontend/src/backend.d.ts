import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: string;
    featured: boolean;
    thumbnail: ExternalBlob;
    name: string;
    description: string;
    sizes: Array<string>;
    stock: bigint;
    category: Category;
    image: ExternalBlob;
    price: bigint;
}
export interface OrderItem {
    id: string;
    size: string;
    quantity: bigint;
    price: bigint;
}
export interface Order {
    id: string;
    status: OrderStatus;
    total: bigint;
    timestamp: bigint;
    items: Array<OrderItem>;
}
export interface ProductEditDTO {
    featured: boolean;
    thumbnail: ExternalBlob;
    name: string;
    description: string;
    sizes: Array<string>;
    stock: bigint;
    category: Category;
    image: ExternalBlob;
    price: bigint;
}
export interface Cart {
    id: string;
    items: Array<CartItem>;
}
export interface CartItem {
    id: string;
    size: string;
    quantity: bigint;
    price: bigint;
}
export enum Category {
    men = "men",
    kids = "kids",
    sale = "sale",
    newArrivals = "newArrivals",
    women = "women"
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addItemToCart(id: string, size: string, quantity: bigint): Promise<void>;
    addProduct(productData: ProductEditDTO): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearCart(): Promise<void>;
    deleteProduct(id: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Cart>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllOrders(): Promise<Array<[Principal, Array<Order>]>>;
    listProductsByCategory(category: Category): Promise<Array<Product>>;
    placeOrder(): Promise<void>;
    queryProduct(id: string): Promise<Product>;
    queryProducts(): Promise<Array<Product>>;
    removeItemFromCart(productId: string, size: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProductsByName(searchTerm: string): Promise<Array<Product>>;
    updateCartItemQuantity(productId: string, size: string, quantity: bigint): Promise<void>;
    updateOrderStatus(userId: Principal, orderId: string, newStatus: OrderStatus): Promise<void>;
    updateProduct(id: string, productData: ProductEditDTO): Promise<void>;
    viewOrderHistory(): Promise<Array<Order>>;
}
